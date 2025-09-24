import { create } from 'zustand';

interface Tata-ruangUIState {
  // UI State
  isLoading: boolean;
  isCreating: boolean;
  isEditing: boolean;
  selectedId: string | null;
  searchTerm: string;
  filters: Record<string, any>;
  modalOpen: boolean;
  sidebarOpen: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setEditing: (editing: boolean) => void;
  setSelectedId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  isCreating: false,
  isEditing: false,
  selectedId: null,
  searchTerm: '',
  filters: {},
  modalOpen: false,
  sidebarOpen: false,
};

export const useTata-ruangStore = create<Tata-ruangUIState>((set) => ({
  ...initialState,
  
  setLoading: (loading) => set({ isLoading: loading }),
  setCreating: (creating) => set({ isCreating: creating }),
  setEditing: (editing) => set({ isEditing: editing }),
  setSelectedId: (id) => set({ selectedId: id }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilters: (filters) => set({ filters }),
  setModalOpen: (open) => set({ modalOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  reset: () => set(initialState),
}));
