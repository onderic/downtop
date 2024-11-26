import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { userService } from '../../services';
import { Role } from '@prisma/client';
import ApiError from '../../utils/ApiError';
import exclude from '../../utils/exclude';

const createUser = catchAsync(async (req, res) => {
  const { phone, password, username, role } = req.body;
  const user = await userService.createUser({ phone, password, username, role });
  res.status(httpStatus.CREATED).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User data is required');
  }
  const user = await userService.updateUser(userId, req.body);
  res.send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
  interface QueryParams {
    limit?: string;
    page?: string;
    role?: Role;
    endDate?: string;
    startDate?: string;
  }
  const { limit = '10', page = '1', role, endDate, startDate } = req.query as QueryParams;
  const typedRole = role as Role | undefined;
  const result = await userService.getAllUsers({
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    role: typedRole,
    startDate,
    endDate
  });
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  console.log('userId', userId);
  const user = await userService.getUser({ id: userId });
  console.log('user', user?.id);

  const safeUser = exclude(user, ['password'] as (keyof typeof user)[]);
  res.send(safeUser);
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await userService.deleteUser(userId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createUser,
  updateUser,
  getAllUsers,
  getUser,
  deleteUser
};
