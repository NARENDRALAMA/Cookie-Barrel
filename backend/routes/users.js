const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    // Calculate order counts and total spent for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        
        return {
          ...user.toObject(),
          orderCount: orders.length,
          totalSpent
        };
      })
    );
    
    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (!req.user.isAdmin && req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's orders
    const orders = await Order.find({ user: user._id })
      .populate('items.product', 'name description image')
      .sort({ createdAt: -1 });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        orders,
        orderCount: orders.length,
        totalSpent
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (!req.user.isAdmin && req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { name, phone, email } = req.body;
    const updateData = { name, phone };
    
    // Only allow email update if it's the user themselves
    if (req.params.id === req.user._id.toString() && email) {
      updateData.email = email;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

