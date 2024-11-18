import { Role } from '@prisma/client';

const allRoles = {
  [Role.buyer]: [],
  [Role.admin]: ['getAllUsers', 'manageUsers'],
  [Role.seller]: ['createShop', 'getShop', 'updateShop', 'deleteShop']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
