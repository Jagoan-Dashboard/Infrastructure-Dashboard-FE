import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserManagementService } from '../service/user-management-service';
import { User, CreateUserInput, UpdateUserInput, UsersResponse, ApiUser } from '../types/user-management-types';
import { useUserManagementStore } from '../store/user-management-store';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { 
    setModalOpen,
    setSelectedId
  } = useUserManagementStore();

  // GET all users
  const { data, isLoading, error, refetch } = useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: () => UserManagementService.getAll(),
  });

  const apiUsers = data?.data?.users;
  const mappedUsers: User[] = Array.isArray(apiUsers)
    ? apiUsers.map((u: ApiUser) => ({
        id: u.id,
        name: u.username,
        email: u.email,
        // Sederhanakan role untuk kebutuhan UI: hanya SUPERADMIN vs USER
        role: u.role === 'SUPERADMIN' ? 'SUPERADMIN' : 'USER',
      }))
    : [];


  // CREATE user
  const createMutation = useMutation({
    mutationFn: (input: CreateUserInput) => UserManagementService.create(input),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Berhasil', { description: response.message });
      setModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[] | string>;
          };
        };
      };

      const baseMessage = err.response?.data?.message || 'Terjadi kesalahan';
      const validationErrors = err.response?.data?.errors;

      let details = '';
      if (validationErrors) {
        const parts: string[] = [];
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            parts.push(...messages);
          } else if (typeof messages === 'string') {
            parts.push(messages);
          }
        });
        if (parts.length > 0) {
          details = parts.join(' ');
        }
      }

      toast.error('Gagal membuat user', {
        description: details || baseMessage,
      });
    },
  });

  // UPDATE user
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      UserManagementService.update(id, input),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Berhasil', { description: response.message });
      setModalOpen(false);
      setSelectedId(null);
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[] | string>;
          };
        };
      };

      const baseMessage = err.response?.data?.message || 'Terjadi kesalahan';
      const validationErrors = err.response?.data?.errors;

      let details = '';
      if (validationErrors) {
        const parts: string[] = [];
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            parts.push(...messages);
          } else if (typeof messages === 'string') {
            parts.push(messages);
          }
        });
        if (parts.length > 0) {
          details = parts.join(' ');
        }
      }

      toast.error('Gagal mengubah user', {
        description: details || baseMessage,
      });
    },
  });

  // DELETE user
  const deleteMutation = useMutation({
    mutationFn: (id: string) => UserManagementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Berhasil', { description: 'User berhasil dihapus' });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error('Gagal menghapus user', { 
        description: err.response?.data?.message || 'Terjadi kesalahan'
      });
    },
  });

  return {
    // Data
    users: mappedUsers,
    total: data?.data?.total ?? mappedUsers.length,
    loading: isLoading,
    error,
    
    // Actions
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
