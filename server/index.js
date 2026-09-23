import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import ordersRoutes from './routes/orders.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection with Auto-Retry
const MONGODB_URI = process.env.MONGODB_URI;

const connectWithRetry = () => {
  if (!MONGODB_URI) {
    console.warn('⚠️ Warning: MONGODB_URI is not defined in .env');
    return;
  }

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error (retrying in 5s):', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Sneakerhead API Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
