import express from 'express';
import userRoute from './user/user.route';
import authRoute from './user/auth.route';
import docsRoute from './docs.route';
import shopRoute from './shop/shop.route';
import categoryRoute from './product/category.route';
import productRoute from './product/product.route';
import cartRoute from './product/cart.route';
import orderRoute from './product/order.route';
import paymentRoute from './payment/payment.route';
import subscriptionRoute from './payment/subscription.route';

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
  {
    path: '/cart',
    route: cartRoute
  },
  {
    path: '/orders',
    route: orderRoute
  },
  {
    path: '/payments',
    route: paymentRoute
  },

  {
    path: '/subscriptions',
    route: subscriptionRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
