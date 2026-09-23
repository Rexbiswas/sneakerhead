import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'sneakerhead_jwt_fallback_secret_key_2026';

// Helper to optionally extract user ID from auth token
const getOptionalUserId = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return decoded.id || null;
  } catch (err) {
    return null;
  }
};

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      items,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      total
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order.' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Shipping address is incomplete.' });
    }

    const orderNumber = `SNK-${Math.floor(100000 + Math.random() * 900000)}`;
    const userId = getOptionalUserId(req);

    // If database is connected, persist to MongoDB
    if (mongoose.connection.readyState === 1) {
      const newOrder = new Order({
        orderNumber,
        user: userId,
        customerName: customerName || `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail: customerEmail || 'guest@sneakerhead.com',
        items,
        shippingAddress,
        shippingMethod: shippingMethod || 'standard',
        paymentMethod: paymentMethod || 'card',
        subtotal: Number(subtotal) || 0,
        shippingFee: Number(shippingFee) || 0,
        discount: Number(discount) || 0,
        total: Number(total) || 0,
        status: 'confirmed'
      });

      await newOrder.save();
    }

    res.status(201).json({
      success: true,
      orderNumber,
      message: 'Order placed successfully!',
      details: {
        orderNumber,
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order.'
    });
  }
});

// @route   GET /api/orders
// @desc    Get order history (if user logged in)
router.get('/', async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, orders: [] });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
