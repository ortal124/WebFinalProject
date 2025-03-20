import express from "express";
import authController from "../controllers/auth_controller";
import upload from "../utils/upload"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: Endpoints related to authentication.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       500:
 *         description: Error registering user.
 */
router.post("/register",upload.single("profileImage"), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: "User login"
 *     description: "Authenticates a user and returns a token."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                  type: string
 *                  description: "The user's username."
 *              password:
 *                  type: string
 *                  description: "The user's password."
 *     responses:
 *       200:
 *         description: "Login successful."
 *       401:
 *         description: "Invalid credentials."
 *       500:
 *         description: "Error logging in."
 */
router.post("/login", authController.login);

router.post("/google/login", authController.googleSignin);

router.post("/google/register", authController.googleSignUp);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags:
 *       - auth
 *     summary: Refresh token
 *     description: Generates a new access token using the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token used to generate a new access token.
 *     responses:
 *       200:
 *         description: New access token generated.
 *       400:
 *         description: Invalid or missing refresh token.
 *       500:
 *         description: Error refreshing token.
 */
router.post("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - auth
 *     summary: User logout
 *     description: Logs out the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token used to generate a new access token.
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Error logging out.
 */
router.post("/logout", authController.logout);

export default router;