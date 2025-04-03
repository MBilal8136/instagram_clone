import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController';

const router = express.router();

router.post('/register', registerUser);
router.post('/login' , loginUser);
router.get('/logout', logoutUser);
