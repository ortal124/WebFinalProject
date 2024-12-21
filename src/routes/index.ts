import { Express } from 'express';
import userRoutes from './auth_routes';
import postRoutes from './posts_routes';
import commentRoutes from './comments_routes';

export const appRoutes = (app: Express) => {
  app.use('/auth', userRoutes);
  app.use('/posts', postRoutes);
  app.use('/comments', commentRoutes);
};