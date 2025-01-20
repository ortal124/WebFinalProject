import { Request, Response } from 'express';
import * as commentService from '../services/comment_service';
import * as postService from '../services/post_service';

export const addComment = async (req: Request, res: Response) => {
  try {
    const { post, text } = req.body;
    const { userId } = req.params;
    
    const postDoc = await postService.getPostById(post);
    if (!postDoc) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comment = await commentService.createComment({ postId: post, text, userId });
    res.status(201).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error adding comment' });
  }
};

export const getCommentsPerPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const comment = await commentService.getCommentById(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
    }
    else if(comment.userId != userId) {
        res.status(401).json({ error: 'User is not authorized to delete comment of another user' });
    }
    await commentService.deleteComment(id);
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