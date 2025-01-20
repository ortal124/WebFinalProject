import { IPost } from '../interfaces/IPost';
import Post from '../models/post_model';

export const createPost = async (post: IPost) => {
    const newPost = new Post(post);
    return await newPost.save();
};

interface PaginationParams {
    limit: number;
    page: number;
}

export const getPosts = async ({ limit, page }: PaginationParams) => {
    return await Post.find()
      .skip((page - 1) * limit)  // Skip posts for pagination
      .limit(limit);  // Limit number of posts per page
};

export const countPosts = async () =>{
    return await Post.countDocuments();
};

export const getPostsByUser = async (userId: string) => {
    return await Post.find({ userId });
};

export const getPostById = async (postId: string) => {
    return await Post.findById(postId);
};

export const deletePost = async (postId: string) => {
    return await Post.findByIdAndDelete(postId);
};

export const updatePost = async (postId: string, updateData: Partial<IPost>) => {
    return Post.findByIdAndUpdate(postId, updateData, { new: true });
};