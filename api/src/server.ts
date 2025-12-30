import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDatabase from './config/database';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req: Request, res: Response) => {
    res.json({
      status: 'success',
      message: 'Farm E-commerce API is running',
      version: '1.0.0'
    });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
