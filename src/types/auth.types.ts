import { User } from './user.types';
import { Role } from './enums';

export interface JwtPayload {
  userId: string;
  username: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: JwtToken;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
