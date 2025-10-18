

import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/api-endpoints";
import { LoginRequest, LoginResponse } from "@/types/user";

export class LoginService {
  /**
   * Login user dengan email/username dan password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        ENDPOINTS.LOGIN,
        credentials
      );
      
      return response.data;
    } catch (error) {
      console.error("Login Service Error:", error);
      throw error;
    }
  }

  /**
   * Logout user (opsional jika backend punya endpoint logout)
   */
  static async logout(): Promise<void> {
    try {
      
      await apiClient.post(ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout Service Error:", error);
      
    }
  }
}