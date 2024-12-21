import express from 'express';
import postController from '../controllers/posts_controller';
import { authMiddleware } from '../middleware/auth_middleware';
import upload from "../utils/upload"
import multer from 'multer';

const router = express.Router();

router.get('/', postController.getPosts);

router.get('/:id', postController.getPostById);

router.get('/user/:id', postController.getPostsByUserId);

router.post('/', authMiddleware, upload.single('image'), postController.createPost);

router.put('/:id',authMiddleware, upload.single('image'), postController.updatePostById);

router.post('/generate', authMiddleware, postController.generatePost);

router.post('/:id/like', authMiddleware, postController.likePost);

router.delete('/:id/like', authMiddleware, postController.unLikePost);

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
