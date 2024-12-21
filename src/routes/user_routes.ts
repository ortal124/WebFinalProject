import express from "express";
import authController from "../controllers/users_controller";

const router = express.Router();

router.get('/profile/:id', authController.getUserProfile);

router.post('/userPhoto', authController.addUserPhoto);

router.put('/userName', authController.updateUserName);

export default router;