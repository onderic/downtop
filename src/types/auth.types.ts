import { User } from './user.types';
import { Role } from './enums';


// Interface for JWT payload (contents of the token)
export interface JwtPayload {
    userId: string; // User ID (the subject of the JWT)
    username: string; // User's username (optional)
    role: Role; // User role (optional)
    iat: number; // Issued At timestamp
    exp: number; // Expiration timestamp
}


// JWT Token interface for access and refresh tokens
export interface JwtToken {
    accessToken: string; // The access token to access protected routes
    refreshToken: string; // The refresh token to get a new access token when expired
}

// Interface for login credentials (used when logging in a user)
export interface Login {
    username: string; // User's username
    password: string; // User's password
}

// Interface for response after successful login (user data and token)
export interface AuthResponse {
    user: User; // User details after login
    token: JwtToken; // JWT tokens (access and refresh)
}


// Interface for refresh token request (used to get a new access token)
export interface RefreshTokenDTO {
    refreshToken: string; // The refresh token to get a new access token
}

