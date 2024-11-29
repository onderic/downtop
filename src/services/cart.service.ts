import productService from './product.service';
import httpStatus from 'http-status';
import prisma from '../client';
import { Cart, CartItem } from '@prisma/client';
import ApiError from '../utils/ApiError';
import { CartItemWithProduct, CartWithItemsAndProducts } from '../types/cart.types';

const createCart = async (userId: string): Promise<Cart> => {
  const existingCart = await prisma.cart.findFirst({
    where: { userId }
  });

  if (existingCart) {
    return existingCart;
  }

  const cart = await prisma.cart.create({
    data: {
      userId
    }
  });
  return cart;
};

const getCart = async (userId: string, cartId: string): Promise<CartWithItemsAndProducts> => {
  const existingCart = await prisma.cart.findFirst({
    where: { id: cartId, userId: userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });
  if (!existingCart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const items: CartItemWithProduct[] = existingCart.items.map((item) => ({
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    amount: item.amount,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product: item.product
  }));

  const cart: CartWithItemsAndProducts = {
    id: existingCart.id,
    userId: existingCart.userId,
    createdAt: existingCart.createdAt,
    updatedAt: existingCart.updatedAt,
    items // Mapped items
  };

  return cart;
};

const clearCart = async (userId: string, cartId: string): Promise<void> => {
  const cart = await getCart(userId, cartId);
  if (!cart) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized to clear this cart');
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cartId }
  });
};

const addCartItem = async (
  userId: string,
  cartId: string,
  productId: string,
  quantity: number
): Promise<CartItem> => {
  const cart = await getCart(userId, cartId);
  if (!cart) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized to add items to this cart');
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: { cartId, productId }
  });
  if (existingCartItem) {
    return existingCartItem;
  }

  const product = await productService.getProduct(productId);
  if (quantity <= 0 || quantity > product.quantity) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Quantity must be greater than zero and not exceed ${product.quantity} units of ${product.name}.`
    );
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity,
      amount: product.sellingPrice
    }
  });
  return cartItem;
};

const updateCartItem = async (
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<CartItem> => {
  const existingCartItem = await getCartItem(userId, cartItemId);

  if (quantity <= 0 || quantity > existingCartItem.product.quantity) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Product may be out of stock or quantity is invalid`
    );
  }

  const cartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity }
  });
  return cartItem;
};

const deleteCartItem = async (userId: string, cartItemId: string): Promise<void> => {
  await getCartItem(userId, cartItemId);
  await prisma.cartItem.delete({
    where: { id: cartItemId }
  });
};

const getCartItem = async (userId: string, cartItemId: string): Promise<CartItemWithProduct> => {
  const existingCartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId },
    include: {
      product: true,
      cart: {
        select: {
          userId: true
        }
      }
    }
  });

  if (!existingCartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found or does not belong to the user');
  } else if (existingCartItem.cart.userId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized to access this cart item');
  }

  const cartItem: CartItemWithProduct = {
    id: existingCartItem.id,
    cartId: existingCartItem.cartId,
    productId: existingCartItem.productId,
    quantity: existingCartItem.quantity,
    amount: existingCartItem.amount,
    createdAt: existingCartItem.createdAt,
    updatedAt: existingCartItem.updatedAt,
    product: existingCartItem.product
  };

  return cartItem;
};

export default {
  createCart,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItem,
  clearCart
};
