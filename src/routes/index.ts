import { Express } from 'express';

import userRoutes from './user-routes';
import neutralRoutes from './neutral-routes';
import skillsRoutes from './skill-routes';
import seekersRoutes from './seeker-routes';
import providersRoutes from './provider-routes';
import jobsRoutes from './job-routes';
import checkAuth from '../middleware/check-auth';

const useRoute = (app: Express) => {
  app.use('/user', userRoutes);
  app.use('/neutral', neutralRoutes);
  app.use('/auth/*', checkAuth);
  app.use('/skills', skillsRoutes);
  app.use('/auth/users', userRoutes);
  app.use('/seekers', seekersRoutes);
  app.use('/auth/seekers', seekersRoutes);
  app.use('/auth/providers', providersRoutes);
  app.use('/providers', providersRoutes);
  app.use('/auth/jobs', jobsRoutes);
  app.use('/jobs', jobsRoutes);
};

export default useRoute;