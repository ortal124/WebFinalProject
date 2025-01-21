import { IComment } from '../interfaces/IComment';
import Comment from '../models/comment_model';

export const createComment = async (comment: IComment) => {
    const newComment = new Comment(comment);
    return await newComment.save();
};

export const updateComment = async (commentId: string, updateData: Partial<IComment>) => {
    return Comment.findByIdAndUpdate(commentId, updateData, { new: true });
};

export const getCommentById = async (id: string) => {
    return await Comment.findById(id);
};

export const getAllComments = async () => {
    return await Comment.find();
};

export const getCommentsByPostId = async (postId: string) => {
    return await Comment.find({ postId });
};

export const deleteComment = async (commentId: string) => {
    await Comment.findByIdAndDelete(commentId);
};