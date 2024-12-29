import { DATABASE_ID, COLLECTION_ID_USERS, client } from '@/appwrite/config';
import { selectedUserStore } from '@/store/selectedUserStore';
import { fetchAllUsers } from '@/appwrite/actions';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useUsers = () => {
    const { setSelectedUser, selectedUser } = selectedUserStore();
    const { data: users = [], isLoading, refetch: refetchUsers } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetchAllUsers(selectedUser, setSelectedUser),
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
