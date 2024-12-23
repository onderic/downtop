import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../utils/ApiError';
import { shopService } from '../../services';
import { reqUser } from '../../types/request.types';

const createShop = catchAsync(async (req, res) => {
  const { name, desc, street, businessType, buildingName, shopNumber, image } = req.body;
  const user = req.user as reqUser;

  if (user.role !== 'seller' && user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is not authorized to create a shop');
  }

  const shop = await shopService.createShop({
    name,
    desc,
    street,
    businessType,
    buildingName,
    shopNumber,
    userId: user.id,
    image
  });
  res.status(httpStatus.CREATED).send(shop);
});

const getShop = catchAsync(async (req, res) => {
  const shop = await shopService.getShop(req.params.shopId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  res.send(shop);
});

const updateShop = catchAsync(async (req, res) => {
  const shop = await shopService.updateShop(req.params.shopId, req.body);
  res.send(shop);
});

const deleteShop = catchAsync(async (req, res) => {
  const user = req.user as reqUser;
  await shopService.deleteShop(req.params.shopId, user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getShops = catchAsync(async (req, res) => {
  interface QueryParams {
    limit?: string;
    page?: string;
    street?: string;
    businessType?: string;
    buildingName?: string;
    name?: string;
    endDate?: string;
    startDate?: string;
  }
  const {
    limit = '10',
    page = '1',
    endDate,
    startDate,
    street,
    businessType,
    buildingName,
    name
  } = req.query as QueryParams;
  const result = await shopService.getShops({
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    startDate,
    endDate,
    street,
    businessType,
    buildingName,
    name
  });
  res.send(result);
});

export default {
  createShop,
  getShop,
  updateShop,
  deleteShop,
  getShops
};
