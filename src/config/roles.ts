import { Role } from '@prisma/client';

const allRoles = {
  [Role.buyer]: [],
  [Role.admin]: [
    'getAllUsers',
    'manageUsers',
    'createCategory',
    'updateCategory',
    'deleteCategory'
  ],
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
