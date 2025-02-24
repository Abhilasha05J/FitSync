import { signup, login } from '../Controllers/AuthController.js';
import { signupValidation, loginValidation } from '../Middleware/AuthValidation.js';
import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

export default router;
