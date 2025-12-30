import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt';

// Signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};