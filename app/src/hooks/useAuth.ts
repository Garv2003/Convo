import { useQuery } from '@tanstack/react-query';
import { account, type Models } from '@/appwrite/config';
import { updateUserStatus } from '@/appwrite/actions';
import { userStore } from '@/store/userStore';

export const useAuth = () => {
    const { setUser } = userStore();

    const { data: user, isLoading, error } = useQuery<Models.User<Models.Preferences>>({
        queryKey: ['user'],
        queryFn: async () => {
            await updateUserStatus();
            const currentUser = await account.get();
            setUser({
                $id: currentUser.$id,
                name: currentUser.name,
                email: currentUser.email,
                status: 'online',
                lastSeen: new Date().toISOString()
            });
            return currentUser;
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
