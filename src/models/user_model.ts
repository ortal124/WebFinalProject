import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
  refreshToken: { type: String, required: false, unique: true }
});

const User = mongoose.model<IUser>('Users', userSchema);
export default User;