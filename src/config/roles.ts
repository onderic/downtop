import { Role } from '@prisma/client';

const allRoles = {
  [Role.buyer]: ['buy', 'createProduct'],
  [Role.admin]: ['admin'],
  [Role.seller]: [
    'createShop',
    'getShop',
    'updateShop',
    'deleteShop',
    'createProduct',
    'getProduct',
    'updateProduct',
    'deleteProduct'
  ]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
