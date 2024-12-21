import { Request, Response } from 'express';
import Post from '../models/post_model';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { userId } = req.params;

    const post = new Post({ text, image, userId: userId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await Post.find()
      .skip((page - 1) * limit)  // Skip posts for pagination
      .limit(limit);  // Limit number of posts per page

    const totalPosts = await Post.countDocuments();
    res.json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error liking post' });
  }
};

export const unLikePost = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error unliking post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return
    }

    if (post.userId != userId) {
      res
        .status(401)
        .json({ error: 'User is not authorized to delete post of another user' });
      return
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error deleting post' });
    }
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
}

export const generatePost = async (req: Request, res: Response) => {
  // TODO
};

export default {
  deletePost,
  createPost,
  likePost,
  unLikePost,
  generatePost,
  getPosts,
  getPostById
}