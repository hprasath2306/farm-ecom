import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  seedCategories
} from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Seed route (can be protected in production)
router.post('/seed', seedCategories);

// Protected routes (for admin - in production, add admin middleware)
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
