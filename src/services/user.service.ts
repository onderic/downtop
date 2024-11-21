import { Role, User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import { NewUser, UserUpdateDTO, SafeUser } from '../types/user.types';
import exclude from '../utils/exclude';

const createUser = async (userData: NewUser): Promise<Omit<User, 'password'>> => {
  const role = userData.role as Role;
  if (role == 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const user = await getUser({ phone: userData.phone });

  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      password: await encryptPassword(userData.password)
    }
  });

  const safeUser = exclude(newUser, ['password']);
  return safeUser;
};

const updateUser = async (
  userId: string,
  updateProfileDto: UserUpdateDTO
): Promise<Omit<User, 'password'>> => {
  const user = await getUser({ id: userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updateData: UserUpdateDTO = {};

  if (updateProfileDto.username) {
    updateData.username = updateProfileDto.username;
  }

  if (updateProfileDto.password) {
    const hashedNewPassword = await encryptPassword(updateProfileDto.password);
    updateData.password = hashedNewPassword;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });

  const safeUser = exclude(updatedUser, ['password']);
  return safeUser;
};

const deleteUser = async (userId: string): Promise<void> => {
  const user = await getUser({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await prisma.user.delete({
    where: { id: userId },
    select: { id: true } // Only select the id to check if the user exists
  });
};

const getAllUsers = async ({
  limit,
  page,
  role,
  startDate,
  endDate
}: {
  limit: number;
  page: number;
  role?: Role;
  startDate?: string;
  endDate?: string;
}): Promise<{
  users: SafeUser[];
  totalUsers: number;
  totalPages: number;
  hasNextPage: boolean;
}> => {
  const skip = (page - 1) * limit;

  if (page < 1 || limit < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Page and limit must be greater than 0');
  }

  const where: any = {};

  if (role) {
    where.role = role;
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
  const totalUsers = await prisma.user.count({
    where: where
  });

  const totalPages = Math.ceil(totalUsers / limit);

  // Fetch the users with pagination
  const users = await prisma.user.findMany({
    where: where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  // Calculate if there is a next page
  const hasNextPage = skip + limit < totalUsers;

  return {
    users: users.map((user) => {
      const safeUser = exclude(user, ['password']);
      return safeUser;
    }),
    totalUsers,
    totalPages,
    hasNextPage
  };
};

export const getUser = async (userParams: {
  phone?: string;
  id?: string;
}): Promise<User | null> => {
  const where: { phone?: string; id?: string } = {};

  if (userParams.phone) {
    where.phone = userParams.phone;
  } else if (userParams.id) {
    where.id = userParams.id;
  }

  const user = await prisma.user.findFirst({
    where: where
  });
  return user;
};

export default {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser
};
