import { useQuery } from '@tanstack/react-query';
import { account } from '@/appwrite/config';
import { updateUserStatus } from '@/appwrite/actions';
import { Models } from 'appwrite';

export const useAuth = () => {
    const { data: user, isLoading, error } = useQuery<Models.User<Models.Preferences>>({
        queryKey: ['user'],
        queryFn: async () => {
            await updateUserStatus();
            return await account.get();
        },
        retry: false,
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
    };
};
