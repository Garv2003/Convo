import { UserNav, UserList, MessageBox } from '@/components/custom';
import { useUserManagement } from '@/hooks/useUserManagement';
import '@/styles/scrollbar.css';

export const Home = () => {
    const { selectedUser, handleUserSelect } = useUserManagement();
    return (
        <div className='w-full flex flex-row'>
            <UserNav />
            <UserList onUserSelect={handleUserSelect} selectedUser={selectedUser} />
            <MessageBox selectedUser={selectedUser} />
        </div>
    );
};