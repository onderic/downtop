import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import CartService from '../../services/cart.service';
import { reqUser } from '../../types/request.types';

const createCart = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  const cart = await CartService.createCart(user.id);
  res.status(httpStatus.CREATED).send(cart);
});

const getCart = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  const cart = await CartService.getCart(user.id, req.params.cartId);
  res.send(cart);
});

const clearCart = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  await CartService.clearCart(user.id, req.params.cartId);
  res.status(httpStatus.NO_CONTENT).send({ message: 'Cart cleared successfully' });
});

const addCartItem = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  const cartItem = await CartService.addCartItem(
    user.id,
    req.params.cartId,
    req.body.productId,
    req.body.quantity
  );
  res.status(httpStatus.CREATED).send(cartItem);
});

const updateCartItem = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  const cartItem = await CartService.updateCartItem(
    user.id,
    req.params.cartItemId,
    req.body.quantity
  );
  res.send(cartItem);
});

const deleteCartItem = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  await CartService.deleteCartItem(user.id, req.params.cartItemId);
  res.status(httpStatus.NO_CONTENT).send({ message: 'Item removed from cart successfully' });
});

export default {
  createCart,
  getCart,
  clearCart,
  addCartItem,
  updateCartItem,
  deleteCartItem
};
