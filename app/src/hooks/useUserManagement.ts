import { selectedUserStore } from "@/store/selectedUserStore";
import { User } from '@/types';

export const useUserManagement = () => {
    const { selectedUser, setSelectedUser } = selectedUserStore();

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
