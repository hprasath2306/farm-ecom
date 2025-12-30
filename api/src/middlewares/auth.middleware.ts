import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/user.model';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided. Please login to access this resource');
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found. Token is invalid');
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

