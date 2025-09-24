export interface Binamarga {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add more properties based on your API response
}

export interface CreateBinamargaInput {
  name: string;
  // Add more properties for creation
}

export interface UpdateBinamargaInput {
  id: string;
  name?: string;
  // Add more properties for updates
}

export interface BinamargaFilters {
  search?: string;
  limit?: number;
  offset?: number;
  // Add more filter properties
}
