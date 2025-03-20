import express from "express";
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../middleware/auth_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: comments
 *     description: Endpoints related to comments.
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     tags:
 *       - comments
 *     summary: Add a comment
 *     description: Adds a new comment to a post.
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - postId
 *             - text
 *           properties:
 *             postId:
 *               type: string
 *               description: The ID of the post to comment on.
 *             text:
 *               type: string
 *               description: The content of the comment.
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Error adding comment.
 */
router.post("/", authMiddleware, commentsController.addComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     tags:
 *       - comments
 *     summary: Delete a comment
 *     description: Deletes a comment by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Error deleting comment.
 */
router.delete("/:id", authMiddleware, commentsController.deleteComment);

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     tags:
 *       - comments
 *     summary: Get comments for a post
 *     description: Fetches all comments for a specific post.
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the post.
 *     responses:
 *       200:
 *         description: List of comments for the post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error fetching comments for post.
 */
router.get('/:postId', commentsController.getCommentsPerPost);

export default router;