import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await client.get('/products');
      return data;
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await client.post('/products', newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...updatedFields }) => {
      const { data } = await client.put(`/products/${id}`, updatedFields);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      await client.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.imageUrl;
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    addProduct: addProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
  };
};
