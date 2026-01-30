import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllProducts);

// Protected routes (require authentication)
// Note: /seller/my-products must come before /:id to avoid route conflicts
router.get('/seller/my-products', authenticate, getMyProducts);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

// Public route with param (must be after specific routes)
router.get('/:id', getProductById);

export default router;
