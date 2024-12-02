import { useState } from 'react';
import '@/styles/scrollbar.css';
import { User } from './types';
import { useUsers } from './user/hooks/useUsers';
import { useUserStatus } from './user/hooks/useUserStatus';
import { SearchBar } from './user/SearchBar';
import { UserItem } from './user/UserItem';

interface UserListProps {
    onUserSelect: (user: User) => void;
    selectedUser: User | null;
}

export const UserList = ({ onUserSelect, selectedUser }: UserListProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { users } = useUsers(selectedUser,onUserSelect);
    useUserStatus();    

    const filteredUsers = users.filter(
        user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="ml-2 my-2 w-[500px]">
            <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col">
                <div className="p-5 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Users</h2>
                    </div>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <div className="space-y-2">
                        {filteredUsers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center">No users found</p>
                        ) : (
                            filteredUsers.map((user) => (
                                <UserItem
                                    key={user.$id}
                                    user={user}
                                    onClick={onUserSelect}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
