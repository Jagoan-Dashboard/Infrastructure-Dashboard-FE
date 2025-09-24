import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sumber-daya-airService } from '../service/sumber-daya-air-service';
import { Sumber-daya-air, CreateSumber-daya-airInput, UpdateSumber-daya-airInput, Sumber-daya-airFilters } from '../types/sumber-daya-air-types';
import { useSumber-daya-airStore } from '../store/sumber-daya-air-store';

export const useSumber-daya-air = () => {
  const queryClient = useQueryClient();
  const { 
    searchTerm, 
    filters, 
    setLoading,
    setCreating,
    setEditing 
  } = useSumber-daya-airStore();

  // GET all sumber-daya-air dengan filters
  const { data, isLoading, error, refetch } = useQuery<Sumber-daya-air[]>({
    queryKey: ['sumber-daya-air', { ...filters, search: searchTerm }],
    queryFn: () => {
      const searchFilters: Sumber-daya-airFilters = { 
        ...filters, 
        search: searchTerm 
      };
      return Sumber-daya-airService.getAll(searchFilters);
    },
  });

  // GET single sumber-daya-air
  const useSumber-daya-airById = (id: string) => {
    return useQuery<Sumber-daya-air>({
      queryKey: ['sumber-daya-air', id],
      queryFn: () => Sumber-daya-airService.getById(id),
      enabled: !!id,
    });
  };

  // CREATE sumber-daya-air
  const createMutation = useMutation({
    mutationFn: (input: CreateSumber-daya-airInput) => Sumber-daya-airService.create(input),
    onMutate: () => setCreating(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sumber-daya-air'] });
    },
    onSettled: () => setCreating(false),
  });

  // UPDATE sumber-daya-air
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSumber-daya-airInput }) => 
      Sumber-daya-airService.update(id, input),
    onMutate: () => setEditing(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sumber-daya-air'] });
      queryClient.invalidateQueries({ queryKey: ['sumber-daya-air', 'detail'] });
    },
    onSettled: () => setEditing(false),
  });

  // DELETE sumber-daya-air
  const deleteMutation = useMutation({
    mutationFn: (id: string) => Sumber-daya-airService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sumber-daya-air'] });
    },
  });

  return {
    // Data
     data || [],
    loading: isLoading,
    error,
    
    // Actions
    refetch,
    createSumber-daya-air: createMutation.mutate,
    updateSumber-daya-air: updateMutation.mutate,
    deleteSumber-daya-air: deleteMutation.mutate,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Detail
    useSumber-daya-airById,
  };
};
