import { apiClient } from '@/lib/api/client';
import { Tata-ruang, CreateTata-ruangInput, UpdateTata-ruangInput, Tata-ruangFilters } from '../types/tata-ruang-types';

export const Tata-ruangService = {
  async getAll(filters: Tata-ruangFilters = {}) {
    const response = await apiClient.get<Tata-ruang[]>('/tata-ruang', { params: filters });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Tata-ruang>(`/tata-ruang/${id}`);
    return response.data;
  },

  async create(input: CreateTata-ruangInput) {
    const response = await apiClient.post<Tata-ruang>(`/tata-ruang`, input);
    return response.data;
  },

  async update(id: string, input: UpdateTata-ruangInput) {
    const response = await apiClient.put<Tata-ruang>(`/tata-ruang/${id}`, input);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/tata-ruang/${id}`);
    return response.data;
  }
};
