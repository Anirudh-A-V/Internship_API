import { Express } from 'express';

import userRoutes from './user-routes.js';
import neutralRoutes from './neutral-routes.js';
import skillsRoutes from './skill-routes.js';
import seekersRoutes from './seeker-routes.js';
import providersRoutes from './provider-routes.js';
import jobsRoutes from './job-routes.js';
import checkAuth from '../middleware/check-auth.js';

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