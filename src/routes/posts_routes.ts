import express from 'express';
import postController from '../controllers/posts_controller';
import { authMiddleware } from '../middleware/auth_middleware';
import upload from "../utils/upload"
import multer from 'multer';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: posts
 *     description: Endpoints related to posts.
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *       - posts
 *     summary: Get a post by ID
 *     description: Fetches a specific post by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the post to fetch.
 *     responses:
 *       200:
 *         description: Post fetched successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error fetching post.
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - posts
 *     summary: Get all posts
 *     description: Fetches a list of all posts with pagination.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         type: integer
 *         description: Page number.
 *       - name: limit
 *         in: query
 *         required: false
 *         type: integer
 *         description: Number of posts per page.
 *     responses:
 *       200:
 *         description: List of posts.
 *       500:
 *         description: Error fetching posts.
 */
router.get('/', postController.getPosts);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - posts
 *     summary: Get posts by user ID
 *     description: Fetches all posts made by a user based on their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: List of posts by the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error fetching posts by user.
 */
router.get('/user/:id', postController.getPostsByUserId);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - posts
 *     security:
 *       - bearerAuth: []
 *     summary: Create a post
 *     description: Creates a new post.
 *     parameters:
 *       - name: text
 *         in: formData
 *         required: true
 *         type: string
 *         description: The text content of the post
 *       - name: image
 *         in: formData
 *         required: true
 *         type: file
 *         description: The image file to be uploaded
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Error creating post.
 */
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags:
 *       - posts
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing post by ID
 *     description: Updates a post's text and/or image based on the provided data. Fields will only be updated if new, non-empty values are provided.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to be updated
 *         schema:
 *           type: string
 *       - name: text
 *         in: formData
 *         required: false
 *         type: string
 *         description: The text content of the post
 *       - name: image
 *         in: formData
 *         type: file
 *         required: false
 *         description: The new image file for the post
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error updating post.
 */
router.put('/:id',authMiddleware, upload.single('image'), postController.updatePostById);

/**
 * @swagger
 * /posts/generate:
 *   post:
 *     tags:
 *       - posts
 *     security:
 *       - bearerAuth: []
 *     summary: Generate a random post
 *     description: Generates a random post with random text and image from a predefined list.
 *     responses:
 *       200:
 *         description: Random post generated.
 *       500:
 *         description: Error generating post.
 */
router.post('/generate', authMiddleware,upload.single('image'), postController.generatePost);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     tags:
 *       - posts
 *     security:
 *       - bearerAuth: []
 *     summary: Like a post
 *     description: Adds a like to a post.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Post liked successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error liking post.
 */
router.post('/:id/like', authMiddleware, postController.likePost);

/**
 * @swagger
 * /posts/{id}/like:
 *   delete:
 *     tags:
 *       - posts
 *     security:
 *       - bearerAuth: []
 *     summary: Unlike a post
 *     description: Removes a like from a post.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Post unliked successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error unliking post.
 */
router.delete('/:id/like', authMiddleware, postController.unLikePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - posts
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a post
 *     description: Deletes a post by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Error deleting post.
 */
router.delete('/:id', authMiddleware, postController.deletePost);

// Error handling middleware for multer
router.use((err:any, req:any, res:any, next:any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large' });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Too many files or invalid file type' });
      }
    } else if (err) {
        console.log(err)
      return res.status(500).json({ message: 'Unexpected error' });
    }
    next();
  });

export default router;
