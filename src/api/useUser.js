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

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await client.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await client.post('/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.imageUrl;
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
  };
};
