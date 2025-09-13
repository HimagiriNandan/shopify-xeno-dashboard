import { Router } from 'express';
const authRoutes = Router();

import { userSignup, userLogin, userLogout, userDetails } from '../Controllers/AuthController.js';
import {authMiddleware} from '../Middleware/index.js';

authRoutes.post('/signup', userSignup);
authRoutes.post('/login', userLogin);
authRoutes.post('/logout', userLogout);
authRoutes.get('/userdetails', authMiddleware, userDetails);

export { authRoutes };