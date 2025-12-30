import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;

