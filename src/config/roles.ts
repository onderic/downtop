import { Role } from '@prisma/client';

const allRoles = {
  [Role.buyer]: [],
  [Role.admin]: ['getAllUsers', 'manageUsers'],
  [Role.seller]: ['updateMyshop', 'getMyShops']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
