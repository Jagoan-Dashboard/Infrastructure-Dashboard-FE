import apiClient from '@/lib/api-client';
import { CreateUserInput, UpdateUserInput, UsersResponse, UserResponse } from '../types/user-management-types';

export const UserManagementService = {
  async getAll(): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/api/v1/users');
    return response.data;
  },

  async create(input: CreateUserInput): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/api/v1/users', input);
    return response.data;
  },

  async update(id: string, input: UpdateUserInput): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>(`/api/v1/users/${id}`, input);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/v1/users/${id}`);
    return response.data;
  },
};
