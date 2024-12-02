import { memo } from 'react';
import { User } from '../types';
import { formatLastSeen } from './utils';

interface UserItemProps {
    user: User;
    onClick: (user: User) => void;
}

const UserItemComponent = ({ user, onClick }: UserItemProps) => (
    <div
        key={user.$id}
        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent cursor-pointer"
        onClick={() => onClick(user)}
    >
        <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                </span>
            </div>
            <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
            />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <span className="text-xs text-muted-foreground">
                    {user.status === 'online' ? 'Online' : formatLastSeen(user.lastSeen)}
                </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
    </div>
);

UserItemComponent.displayName = 'UserItem';

export const UserItem = memo(UserItemComponent);
