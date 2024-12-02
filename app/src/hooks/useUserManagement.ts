import { useState } from 'react';
import { User } from '@/types';

export const useUserManagement = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleUserSelect = (user: User) => {
        setSelectedUser({
            $id: user.$id,
            name: user.name,
            email: user.email,
            status: user.status,
            lastSeen: user.lastSeen
        });
    };

    return {
        selectedUser,
        handleUserSelect,
    };
};
