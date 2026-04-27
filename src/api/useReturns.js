import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';

export const useReturns = () => {
  const queryClient = useQueryClient();

  const returnsQuery = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const { data } = await client.get('/returns');
      return data;
    },
  });

  const addReturnMutation = useMutation({
    mutationFn: async (newReturn) => {
      const { data } = await client.post('/returns', newReturn);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    },
  });

  const updateReturnMutation = useMutation({
    mutationFn: async ({ id, ...updatedFields }) => {
      const { data } = await client.put(`/returns/${id}`, updatedFields);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    },
  });

  const deleteReturnMutation = useMutation({
    mutationFn: async (id) => {
      await client.delete(`/returns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    },
  });

  return {
    returns: returnsQuery.data || [],
    isLoading: returnsQuery.isLoading,
    isError: returnsQuery.isError,
    addReturn: addReturnMutation.mutateAsync,
    updateReturn: updateReturnMutation.mutateAsync,
    deleteReturn: deleteReturnMutation.mutateAsync,
  };
};
