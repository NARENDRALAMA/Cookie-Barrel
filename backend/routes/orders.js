const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== Create Order Request ===');
    console.log('User:', req.user ? { id: req.user._id, email: req.user.email } : 'No user');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { items, paymentMethod, deliveryAddress, contactInfo, specialInstructions, notes } = req.body;
    
    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }
    
    if (!deliveryAddress || !contactInfo || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Delivery address, contact info, and payment method are required' 
      });
    }
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.available) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${item.productId} not available` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Calculate delivery fee (free for orders over $50, otherwise $5)
    const deliveryFee = totalAmount >= 50 ? 0 : 5;
    
    // Calculate tax (10% tax)
    const tax = totalAmount * 0.1;
    
    const finalAmount = totalAmount + deliveryFee + tax;
    
    // Generate order number (count-based like Next.js)
    const count = await Order.countDocuments();
    const orderNumber = `CB${String(count + 1).padStart(6, '0')}`;
    
    console.log('Order calculation:', { totalAmount, deliveryFee, tax, finalAmount, orderNumber });
    
    // Create order with all fields
    const orderData = {
      orderNumber,
      user: req.user._id,
      items: orderItems,
      subtotal: totalAmount,
      discount: 0,
      total: finalAmount,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      notes: notes || specialInstructions || '',
      deliveryAddress: {
        street: deliveryAddress.street || '',
        city: deliveryAddress.city || '',
        state: deliveryAddress.state || '',
        zipCode: deliveryAddress.zipCode || ''
      },
      contactInfo: {
        phone: contactInfo.phone || '',
        email: contactInfo.email || ''
      },
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    };
    
    console.log('Order data before save:', JSON.stringify(orderData, null, 2));
    
    const order = new Order(orderData);
    await order.save();
    
    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name description image');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders or all orders (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== Get Orders Request ===');
    console.log('User:', req.user ? { id: req.user._id, email: req.user.email, isAdmin: req.user.isAdmin } : 'No user');
    
    let query = {};
    
    // If not admin, only show user's orders
    if (!req.user.isAdmin) {
      query.user = req.user._id;
      console.log('Fetching orders for user:', req.user._id);
    } else {
      console.log('Admin fetching all orders');
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name description image price')
      .sort({ createdAt: -1 }) // Latest first
      .lean();
    
    console.log(`Found ${orders.length} orders`);
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name description image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns the order or is admin
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['ordered', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'delivered' && { deliveredAt: new Date() })
      },
      { new: true }
    ).populate('user', 'name email phone')
     .populate('items.product', 'name description image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

