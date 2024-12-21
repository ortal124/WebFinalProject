import express from "express";
import authController from "../controllers/users_controller";
import { authMiddleware } from '../middleware/auth_middleware';
import upload from "../utils/upload"

const router = express.Router();

router.get('/profile/:id', authController.getUserProfile);

router.put('/:id/photo', authMiddleware, upload.single('photo'), authController.addUserPhoto);

router.put('/userName', authMiddleware, authController.updateUserName);

export default router;