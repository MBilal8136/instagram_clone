import express from 'express';
import { registerUser, loginUser, logoutUser, getProfile, updateProfile, getSuggestedUser, followorUnfollow } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthencateduser.js';
import uploadImage from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login' , loginUser);
router.get('/logout', logoutUser);
router.get('/:id/profile', isAuthenticated, getProfile);
router.post('/profile/edit', isAuthenticated, uploadImage, updateProfile);
router.get('/suggested', isAuthenticated, getSuggestedUser);
router.post('/follow/:id', isAuthenticated, followorUnfollow);

export default router;
