import mongoose from 'mongoose';
import { IPost } from '../interfaces/IPost';

const postSchema = new mongoose.Schema<IPost>({
  text: { type: String, required: true },
  image: { type: String },
  userId:  { type: String, required: true },
  likes: [ { type: String, required: true }],
});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
