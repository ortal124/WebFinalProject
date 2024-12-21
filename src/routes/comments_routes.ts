import express from "express";
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../middleware/auth_middleware";

const router = express.Router();

router.post("/", authMiddleware, commentsController.addComment);

router.delete("/:id", authMiddleware, commentsController.deleteComment);

router.get('/:postId', commentsController.getCommentsPerPost);


export default router;