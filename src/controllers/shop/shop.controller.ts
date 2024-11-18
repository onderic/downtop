import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../utils/ApiError';
import { shopService } from '../../services';
import { userService } from '../../services';
import { reqUser } from '../../types/request.types';

const createShop = catchAsync(async (req, res) => {
  const { desc, street, businessType, buildingName, shopNumber, userId } = req.body;
  const user = await userService.getUser({ id: userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const shop = await shopService.createShop({
    desc,
    street,
    businessType,
    buildingName,
    shopNumber,
    userId
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
    buildingName
  } = req.query as QueryParams;
  const result = await shopService.getShops({
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    startDate,
    endDate,
    street,
    businessType,
    buildingName
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
