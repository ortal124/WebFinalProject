import express from 'express';
import postController from '../controllers/posts_controller';
import { authMiddleware } from '../middleware/auth_middleware';

const router = express.Router();

router.get('/', postController.getPosts);

router.get('/:id', postController.getPostById);

router.post('/', authMiddleware, postController.createPost);

router.post('/generate', authMiddleware, postController.generatePost);

router.post('/:id/like', authMiddleware, postController.likePost);

router.delete('/:id/like', authMiddleware, postController.unLikePost);

router.delete('/:id', authMiddleware, postController.deletePost);

export default router;
