export interface Sumber-daya-air {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add more properties based on your API response
}

export interface CreateSumber-daya-airInput {
  name: string;
  // Add more properties for creation
}

export interface UpdateSumber-daya-airInput {
  id: string;
  name?: string;
  // Add more properties for updates
}

export interface Sumber-daya-airFilters {
  search?: string;
  limit?: number;
  offset?: number;
  // Add more filter properties
}
