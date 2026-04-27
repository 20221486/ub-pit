import { useMutation } from '@tanstack/react-query';
import client from './client';
import { useAuthStore } from '../storage/useAuthStore';

export const useAuth = () => {
    const loginSession = useAuthStore(state => state.loginSession);
    const logoutSession = useAuthStore(state => state.logoutSession);

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const { data } = await client.post('/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            loginSession(data);
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const { data } = await client.post('/register', userData);
            return data;
        },
        onSuccess: (data) => {
            loginSession(data);
        }
    });

    return {
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutSession,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
    };
};
