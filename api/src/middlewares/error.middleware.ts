import { Request, Response, NextFunction } from 'express';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(error.errors).map((err: any) => err.message);
    message = errors.join(', ');
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please login again';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

