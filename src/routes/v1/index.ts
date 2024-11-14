import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import docsRoute from './docs.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/docs',
    route: docsRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/auth',
    route: authRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
