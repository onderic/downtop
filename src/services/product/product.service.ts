import { Product } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { NewProduct, ProductUpdateDTO } from '../../types/product.types';

const createProduct = async (productData: NewProduct): Promise<Product> => {
  const product = await prisma.product.create({
    data: productData
  });
  return product;
};

const getProduct = async (productId: string): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const updateProduct = async (
  productId: string,
  productData: ProductUpdateDTO
): Promise<Product> => {
  const product = await prisma.product.update({
    where: { id: productId },
    data: productData
  });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const deleteProduct = async (productId: string): Promise<Product> => {
  const product = await prisma.product.delete({
    where: { id: productId }
  });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const getAllProducts = async ({
  limit,
  page,
  name,
  categoryId,
  minPrice,
  maxPrice
}: {
  limit: number;
  page: number;
  name?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<{
  products: Product[];
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  if (page < 1 || limit < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Page and limit must be greater than 0');
  }

  const where: any = {};

  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive'
    };
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = minPrice;
    }
    if (maxPrice) {
      where.price.lte = maxPrice;
    }
  }

  // Get total count of products with the same filters
  const totalProducts = await prisma.product.count({
    where: where
  });

  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch the products with pagination
  const products = await prisma.product.findMany({
    where: where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  // Calculate if there is a next page
  const hasNextPage = skip + limit < totalProducts;

  return {
    products,
    totalProducts,
    totalPages,
    hasNextPage
  };
};

export default { createProduct, getProduct, updateProduct, deleteProduct, getAllProducts };
