

export interface User {
  id: string;
  username: string;
  email: string;
  role: "OPERATOR" | "ADMIN" | "SUPERADMIN"; 
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  identifier: string; 
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    expires_in: number; 
  };
}