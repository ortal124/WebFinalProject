import { Request, Response } from 'express';
import Comment from '../models/comment_model';

export const addComment = async (req: Request, res: Response) => {
  try {
    const { post, text } = req.body;
    const { userId } = req.params;

    const comment = new Comment({ postId: post, text, userId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
};

export const getCommentsPerPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
    }
    else if(comment.userId != userId) {
        res.status(401).json({ error: 'User is not authorized to delete comment of another user' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
};


export default {
    addComment,
    deleteComment,
    getCommentsPerPost
}