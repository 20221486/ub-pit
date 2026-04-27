import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';
import { useAuthStore } from '../storage/useAuthStore';

export const useUsers = () => {
  const queryClient = useQueryClient();
  const updateSessionProfile = useAuthStore(state => state.updateSessionProfile);
  const currentUser = useAuthStore(state => state.currentUser);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await client.get('/users');
      return data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const { data } = await client.put(`/users/${id}`, updatedData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // If the updated user is the currently logged in user, update the local session too
      if (currentUser && currentUser.id === data.id) {
          updateSessionProfile(data);
      }
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    updateUser: updateUserMutation.mutateAsync,
  };
};
