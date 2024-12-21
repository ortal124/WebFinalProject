import express from "express";
import authController from "../controllers/auth_controller";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

router.get('/profile/:id', authController.getUserProfile);

router.post('/userPhoto', authController.addUserPhoto);

export default router;