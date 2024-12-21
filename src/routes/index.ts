import { Express } from 'express';
import authRoutes from './auth_routes';
import postRoutes from './posts_routes';
import userRoutes from './user_routes';
import commentRoutes from './comments_routes';

export const appRoutes = (app: Express) => {
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/posts', postRoutes);
  app.use('/comments', commentRoutes);
};