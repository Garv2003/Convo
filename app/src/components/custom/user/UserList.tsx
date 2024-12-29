import { SearchBar, UserItem } from '@/components/custom';
import { useUsers, useUserStatus } from '@/hooks';
import { useState } from 'react';

export const UserList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { users, isLoading } = useUsers();

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
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center min-h-[80vh] py-8 space-y-4">
                                <div className="relative size-12">
                                    <div className="absolute inset-0 rounded-full border-4 border-muted-foreground/20"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-l-transparent animate-spin"></div>
                                </div>
                                <p className="text-sm text-muted-foreground">Loading users...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className='h-full flex flex-col items-center justify-center min-h-[80vh] py-8'>
                                <p className="text-sm text-muted-foreground text-center">No users found</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <UserItem
                                    key={user.$id}
                                    user={user}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
