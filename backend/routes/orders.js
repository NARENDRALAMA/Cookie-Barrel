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
    const { items, notes, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    let subtotal = 0;
    const orderItems = [];
    
    // Validate and calculate order items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      
      if (!product.available) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      subtotal,
      total: subtotal, // Will be updated if discount applied
      notes,
      paymentMethod: paymentMethod || 'cash',
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    });
    
    await order.save();
    
    // Populate order with product details
    await order.populate('items.product', 'name description image');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders or all orders (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show user's orders
    if (!req.user.isAdmin) {
      query.user = req.user._id;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name description image')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
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

