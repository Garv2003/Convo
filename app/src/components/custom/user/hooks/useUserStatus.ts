import { useEffect } from 'react';
import { DATABASE_ID, databases, COLLECTION_ID_USERS } from '@/appwrite/config';
import { Query } from 'appwrite';
import { User } from '../../types';

export const useUserStatus = () => {
    useEffect(() => {
        const updateUsersStatus = async () => {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                [Query.orderDesc('lastSeen')]
            );
            const updatedUsers = response.documents.map(doc => ({
                $id: doc.$id,
                name: doc.name,
                email: doc.email,
                status: doc.status,
                lastSeen: doc.lastSeen
            } as User));
            const fiveMinutesAgo = new Date().getTime() - 300000;

            const updates = updatedUsers
                .filter(user => new Date(user.lastSeen).getTime() < fiveMinutesAgo)
                .map(user =>
                    databases.updateDocument(
                        DATABASE_ID,
                        COLLECTION_ID_USERS,
                        user.$id,
                        { status: 'offline' as const }
                    )
                );

            await Promise.all(updates);
        };

        updateUsersStatus();
        const intervalId = setInterval(updateUsersStatus, 60000);
        return () => clearInterval(intervalId);
    }, []);
};
