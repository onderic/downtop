import { Role } from './enums'

export interface NewUser {
    username: string;
    contact: number;
    role: Role;
    password: string;
}

export interface User extends NewUser {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface UserUpdateDTO extends Partial<User> {
    id: string;
}