import { Shop } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { NewShop, ShopUpdateDTO } from '../../types/shop.types';

const createShop = async (shopData: NewShop): Promise<Shop> => {
  const existingShop = await prisma.shop.findUnique({
    where: { userId: shopData.userId }
  });

  if (existingShop) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already has a shop');
  }
  const shop = await prisma.shop.create({
    data: shopData
  });
  return shop;
};

const getShop = async (shopId: string): Promise<Shop> => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId }
  });

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }

  return shop;
};

const updateShop = async (shopId: string, shopData: ShopUpdateDTO): Promise<Shop> => {
  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: shopData
  });
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  return shop;
};

const deleteShop = async (shopId: string, userId: string): Promise<void> => {
  const shop = await prisma.shop.findFirst({
    where: {
      id: shopId,
      userId: userId
    }
  });

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }

  await prisma.shop.delete({
    where: { id: shop.id }
  });
};

const getShops = async ({
  limit,
  page,
  street,
  businessType,
  buildingName,
  name,
  startDate,
  endDate
}: {
  limit: number;
  page: number;
  street?: string;
  businessType?: string;
  buildingName?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{
  shops: Shop[];
  totalShops: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  if (page < 1 || limit < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Page and limit must be greater than 0');
  }

  const where: any = {};
  if (name) {
    where.name = name;
  }

  if (street) {
    where.street = street;
  }
  if (businessType) {
    where.businessType = businessType;
  }
  if (buildingName) {
    where.buildingName = buildingName;
  }

  if (startDate && endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  // Get the total count of users with the same filters
  const totalShops = await prisma.shop.count({
    where: where
  });

  const totalPages = Math.ceil(totalShops / limit);

  // Fetch the users with pagination
  const shops = await prisma.shop.findMany({
    where: where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  // Calculate if there is a next page
  const hasNextPage = skip + limit < totalShops;

  return {
    shops,
    totalShops,
    totalPages,
    hasNextPage
  };
};

export default {
  createShop,
  getShop,
  updateShop,
  deleteShop,
  getShops
};
