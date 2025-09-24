import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tata-ruangService } from '../service/tata-ruang-service';
import { Tata-ruang, CreateTata-ruangInput, UpdateTata-ruangInput, Tata-ruangFilters } from '../types/tata-ruang-types';
import { useTata-ruangStore } from '../store/tata-ruang-store';

export const useTata-ruang = () => {
  const queryClient = useQueryClient();
  const { 
    searchTerm, 
    filters, 
    setLoading,
    setCreating,
    setEditing 
  } = useTata-ruangStore();

  // GET all tata-ruang dengan filters
  const { data, isLoading, error, refetch } = useQuery<Tata-ruang[]>({
    queryKey: ['tata-ruang', { ...filters, search: searchTerm }],
    queryFn: () => {
      const searchFilters: Tata-ruangFilters = { 
        ...filters, 
        search: searchTerm 
      };
      return Tata-ruangService.getAll(searchFilters);
    },
  });

  // GET single tata-ruang
  const useTata-ruangById = (id: string) => {
    return useQuery<Tata-ruang>({
      queryKey: ['tata-ruang', id],
      queryFn: () => Tata-ruangService.getById(id),
      enabled: !!id,
    });
  };

  // CREATE tata-ruang
  const createMutation = useMutation({
    mutationFn: (input: CreateTata-ruangInput) => Tata-ruangService.create(input),
    onMutate: () => setCreating(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tata-ruang'] });
    },
    onSettled: () => setCreating(false),
  });

  // UPDATE tata-ruang
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTata-ruangInput }) => 
      Tata-ruangService.update(id, input),
    onMutate: () => setEditing(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tata-ruang'] });
      queryClient.invalidateQueries({ queryKey: ['tata-ruang', 'detail'] });
    },
    onSettled: () => setEditing(false),
  });

  // DELETE tata-ruang
  const deleteMutation = useMutation({
    mutationFn: (id: string) => Tata-ruangService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tata-ruang'] });
    },
  });

  return {
    // Data
     data || [],
    loading: isLoading,
    error,
    
    // Actions
    refetch,
    createTata-ruang: createMutation.mutate,
    updateTata-ruang: updateMutation.mutate,
    deleteTata-ruang: deleteMutation.mutate,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Detail
    useTata-ruangById,
  };
};
