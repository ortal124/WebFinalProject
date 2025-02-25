import express from "express";
import authController from "../controllers/auth_controller";
import upload from "../utils/upload"

const router = express.Router();

router.post("/register",upload.single("profileImage"), authController.register);

router.post("/login", authController.login);

router.post("/google/login", authController.googleSignin);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

export default router;