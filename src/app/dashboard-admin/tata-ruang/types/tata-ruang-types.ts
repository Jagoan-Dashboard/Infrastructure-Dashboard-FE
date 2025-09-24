export interface Tata-ruang {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add more properties based on your API response
}

export interface CreateTata-ruangInput {
  name: string;
  // Add more properties for creation
}

export interface UpdateTata-ruangInput {
  id: string;
  name?: string;
  // Add more properties for updates
}

export interface Tata-ruangFilters {
  search?: string;
  limit?: number;
  offset?: number;
  // Add more filter properties
}
