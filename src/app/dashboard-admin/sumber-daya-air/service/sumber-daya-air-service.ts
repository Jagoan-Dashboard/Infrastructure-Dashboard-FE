import { apiClient } from '@/lib/api/client';
import { Sumber-daya-air, CreateSumber-daya-airInput, UpdateSumber-daya-airInput, Sumber-daya-airFilters } from '../types/sumber-daya-air-types';

export const Sumber-daya-airService = {
  async getAll(filters: Sumber-daya-airFilters = {}) {
    const response = await apiClient.get<Sumber-daya-air[]>('/sumber-daya-air', { params: filters });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Sumber-daya-air>(`/sumber-daya-air/${id}`);
    return response.data;
  },

  async create(input: CreateSumber-daya-airInput) {
    const response = await apiClient.post<Sumber-daya-air>(`/sumber-daya-air`, input);
    return response.data;
  },

  async update(id: string, input: UpdateSumber-daya-airInput) {
    const response = await apiClient.put<Sumber-daya-air>(`/sumber-daya-air/${id}`, input);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/sumber-daya-air/${id}`);
    return response.data;
  }
};
