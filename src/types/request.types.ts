import { Role } from '@prisma/client';

export interface reqUser {
  id: string;
  role: Role;
}
