import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/category.model';
import mongoose from 'mongoose';

// Create a new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, image, parentCategory } = req.body;

    if (!name) {
      throw new Error('Category name is required');
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      throw new Error('Category already exists');
    }

    const category = await Category.create({
      name,
      description,
      image,
      parentCategory: parentCategory || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { active } = req.query;

    const query: any = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid category ID');
    }

    const category = await Category.findById(id)
      .populate('parentCategory', 'name');

    if (!category) {
      throw new Error('Category not found');
    }

    res.status(200).json({
      status: 'success',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid category ID');
    }

    const allowedUpdates = ['name', 'description', 'image', 'parentCategory', 'isActive'];
    const updates: any = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const category = await Category.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name');

    if (!category) {
      throw new Error('Category not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid category ID');
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new Error('Category not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Seed default categories
export const seedCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const defaultCategories = [
      { name: 'Vegetables', description: 'Fresh vegetables from local farms' },
      { name: 'Fruits', description: 'Seasonal fruits and berries' },
      { name: 'Grains', description: 'Rice, wheat, and other grains' },
      { name: 'Dairy', description: 'Milk, cheese, and dairy products' },
      { name: 'Meat', description: 'Fresh meat and poultry' },
      { name: 'Eggs', description: 'Farm-fresh eggs' },
      { name: 'Honey', description: 'Natural honey and bee products' },
      { name: 'Herbs', description: 'Fresh and dried herbs' },
      { name: 'Nuts', description: 'Various nuts and seeds' },
      { name: 'Organic', description: 'Certified organic products' }
    ];

    const createdCategories = [];

    for (const cat of defaultCategories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        const newCategory = await Category.create(cat);
        createdCategories.push(newCategory);
      }
    }

    res.status(201).json({
      status: 'success',
      message: `${createdCategories.length} categories seeded successfully`,
      data: { categories: createdCategories }
    });
  } catch (error) {
    next(error);
  }
};
