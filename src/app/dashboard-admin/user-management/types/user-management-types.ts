export type UserRole = 'SUPERADMIN' | 'USER';

// Bentuk user dari API
export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Bentuk user yang dipakai di UI
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
}

export interface UpdateUserInput {
  role?: UserRole;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: ApiUser[];
    total: number;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: ApiUser;
}
