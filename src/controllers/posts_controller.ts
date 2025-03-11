import { Request, Response } from 'express';
import * as postService from '../services/post_service';
import { processPostsWithImages } from '../utils/download'
import { generateContent } from "../utils/gemini"; 

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }

    const { text } = req.body;

    if (!text) {
      res.status(400).json({ message: 'No text provided' });
      return;
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const { userId } = req.params;

    const post = await postService.createPost({ text, image: imageUrl, userId, likes: [] });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await postService.getPosts({limit, page});
    
    const downloadedPosts = await processPostsWithImages(posts);

    const totalPosts = await postService.countPosts();

    res.json({
      downloadedPosts,
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
    const post = await postService.getPostById(id);
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
    const post = await postService.getPostById(id);
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

    const post = await postService.getPostById(id);
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

    await postService.deletePost(id);

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
    const post = await postService.getPostById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const poatDoc = post.toObject();
    const downloadedPost = (await processPostsWithImages([poatDoc]))[0];

    res.status(200).json(downloadedPost);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
}

export const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const posts = await postService.getPostsByUser(id);

    const downloadedPosts = await processPostsWithImages(posts);

    res.status(200).json(downloadedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
}

export const updatePostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;

    const post = await postService.getPostById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.userId != userId) {
      res
        .status(401)
        .json({ error: 'User is not authorized to delete post of another user' });
      return
    }

    if(!req.file && !req.body.text) {
      res.status(400).json({ error: 'No update fields provided' });
      return 
    }

    const { text } = req.body || ""; 
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;  // Construct the image URL
    }

    const updateFields: any = {};

    if (text && text.trim()) {
      updateFields.text = text;
    }

    if (imageUrl) {
      updateFields.image = imageUrl;
    }

    const updatedPost = await postService.updatePost(id, updateFields);

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

export const generatePost = async (req: Request, res: Response): Promise<void> =>{
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }
    const imageUrl = `/uploads/${req.file.filename}`;

    const text = await generateContent(imageUrl, req.file.mimetype);
    res.status(200).json({ text });
    return;
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default {
  deletePost,
  createPost,
  likePost,
  unLikePost,
  generatePost,
  getPosts,
  getPostById,
  getPostsByUserId,
  updatePostById
}