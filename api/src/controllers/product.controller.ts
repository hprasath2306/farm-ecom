import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const {
      title,
      description,
      category,
      images,
      video,
      price,
      unit,
      quantityAvailable,
      location,
      isOrganic,
      harvestDate,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !price || !unit || !quantityAvailable || !location) {
      throw new Error('Please provide all required fields');
    }

    // Create product with seller as the authenticated user
    const product = await Product.create({
      seller: req.user._id,
      title,
      description,
      category,
      images: images || [],
      video,
      price,
      unit,
      quantityAvailable,
      location,
      isOrganic: isOrganic || false,
      harvestDate,
      tags: tags || []
    });

    // Add product to user's productsListed
    await User.findByIdAndUpdate(req.user._id, {
      $push: { productsListed: product._id }
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Get all products (with filtering, sorting, pagination)
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      isOrganic,
      status = 'available',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query: any = { status };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isOrganic !== undefined) {
      query.isOrganic = isOrganic === 'true';
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // Build sort
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .populate('seller', 'firstName lastName rating')
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalProducts: total,
          hasMore: pageNum * limitNum < total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    const product = await Product.findById(id)
      .populate('seller', 'firstName lastName email phoneNumber rating')
      .populate('category', 'name description');

    if (!product) {
      throw new Error('Product not found');
    }

    // Increment view count
    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      throw new Error('You are not authorized to update this product');
    }

    // Update allowed fields
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'images',
      'video',
      'price',
      'unit',
      'quantityAvailable',
      'location',
      'isOrganic',
      'harvestDate',
      'status',
      'tags'
    ];

    const updates: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('seller', 'firstName lastName rating')
      .populate('category', 'name');

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      throw new Error('You are not authorized to delete this product');
    }

    // Remove from user's productsListed
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { productsListed: product._id }
    });

    // Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get products by seller (my products)
export const getMyProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query: any = { seller: req.user._id };
    if (status) {
      query.status = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalProducts: total,
          hasMore: pageNum * limitNum < total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
