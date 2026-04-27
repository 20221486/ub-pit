import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';

export const useUser = () => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await client.get('/user');
      return data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await client.put('/user', updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    updateUser: updateUserMutation.mutateAsync,
  };
};
