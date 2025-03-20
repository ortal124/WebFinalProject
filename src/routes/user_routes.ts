import express from "express";
import authController from "../controllers/users_controller";
import { authMiddleware } from '../middleware/auth_middleware';
import upload from "../utils/upload"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: users
 *     description: Endpoints related to user.
 */

/**
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     tags:
 *       - users
 *     summary: Get user profile
 *     description: Fetches profile details of a user by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User profile data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error fetching user profile.
 */
router.get('/profile/:id', authController.getUserProfile);

/**
 * @swagger
 * /{id}/photo:
 *   put:
 *     tags:
 *       - users
*     security:
 *       - bearerAuth: []
 *     summary: Add user profile photo
 *     description: Uploads a profile photo for the user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user.
 *       - name: photo
 *         in: formData
 *         required: true
 *         type: file
 *         description: The photo to upload.
 *     responses:
 *       200:
 *         description: Profile photo added successfully.
 *       400:
 *         description: Invalid photo or user ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error adding profile photo.
 */
router.put('/:id/photo', authMiddleware, upload.single('photo'), authController.addUserPhoto);

/**
 * @swagger
 * /users/username:
 *   put:
 *     tags:
 *       - users
*     security:
 *       - bearerAuth: []
 *     summary: Update user username
 *     description: Update username of a user by ID.
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *           properties:
 *             username:
 *               type: string
 *     responses:
 *       201:
 *         description: Username updated successfully.
 *       400:
 *         description: Username required.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Username does not exist.
 *       500:
 *         description: Error updating username.
 */
router.put('/userName', authMiddleware, authController.updateUserName);

export default router;