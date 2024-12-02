import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Query } from 'appwrite';
import { DATABASE_ID, COLLECTION_ID_USERS, account, databases } from '@/appwrite/config';

export interface User {
    $id: string;
    userId: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastSeen: string;
}

export const useUserManagement = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    const logoutUser = async () => {
        try {
            const loginSession = await account.get();
            const currentUser = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                [Query.equal('email', loginSession.email)]
            );
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                currentUser.documents[0].$id,
                {
                    status: 'offline',
                    lastSeen: new Date().toISOString(),
                    lastPing: new Date().toISOString(),
                }
            );
            await account.deleteSession('current');
            navigate('/login');
            toast.success('Logout successful!');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed!');
        }
    };

    return {
        selectedUser,
        handleUserSelect,
        logoutUser
    };
};
