import { Express } from 'express';
import userRoutes from './auth_routes';

export const appRoutes = (app: Express) => {
  app.use('/auth', userRoutes);
};