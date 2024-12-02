import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DATABASE_ID, databases, COLLECTION_ID_USERS, account, client } from '@/appwrite/config';
import { Query } from 'appwrite';
import { User } from '../../types';

export const useUsers = (selectedUser: User | null, onUserSelect: (user: User) => void) => {
    const { data: users = [], refetch: refetchUsers } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const currentUser = await account.get();
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                [Query.orderDesc('lastSeen'), Query.notEqual('$id', currentUser.$id)]
            );

            // change status of selected user
            if (selectedUser) {
                const currentUser = response.documents.find(doc => doc.$id === selectedUser.$id);
                if (currentUser) {
                    onUserSelect({
                        $id: currentUser.$id,
                        name: currentUser.name,
                        email: currentUser.email,
                        status: currentUser.status,
                        lastSeen: currentUser.lastSeen
                    });
                }
            }
            
            return response.documents.map(doc => ({
                $id: doc.$id,
                name: doc.name,
                email: doc.email,
                status: doc.status,
                lastSeen: doc.lastSeen
            })) as User[];
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

    return { users, refetchUsers };
};
