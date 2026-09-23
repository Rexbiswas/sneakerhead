import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    price: { type: mongoose.Schema.Types.Mixed },
    quantity: { type: Number, default: 1 },
    img: { type: String },
    size: { type: String },
    color: { type: String }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerEmail: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'cod'],
      default: 'card'
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'processing', 'shipped', 'delivered'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
