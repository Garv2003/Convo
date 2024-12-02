import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DATABASE_ID, COLLECTION_ID_USERS, client } from '@/appwrite/config';
import { User } from '@/types';
import { fetchAllUsers } from '@/appwrite/actions';

export const useUsers = (selectedUser: User | null, onUserSelect: (user: User) => void) => {
    const { data: users = [], isLoading, refetch: refetchUsers } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return await fetchAllUsers(selectedUser, onUserSelect);
        },
        refetchInterval: 10000,
    });

    useEffect(() => {
        const unsubscribe = client.subscribe(
            ['account', `databases.${DATABASE_ID}.collections.${COLLECTION_ID_USERS}.documents`],
            async () => {
                await refetchUsers();
            }
        );
        return () => unsubscribe();
    }, [refetchUsers]);

    return { users, refetchUsers, isLoading };
};
