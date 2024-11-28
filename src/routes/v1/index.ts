import express from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import docsRoute from './docs.route';
import shopRoute from './shop.route';
import categoryRoute from './category.route';
import productRoute from './product.route';
import cartRoute from './cart.route';
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
  },
  {
    path: '/shops',
    route: shopRoute
  },
  {
    path: '/categories',
    route: categoryRoute
  },
  {
    path: '/products',
    route: productRoute
  },
  { path: '/cart', route: cartRoute }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
