import { UserList } from '@/components/custom/UserList';
import { MessageBox } from '@/components/custom/MessageBox';
import { UserNav } from '@/components/custom/UserNav';
import '@/styles/scrollbar.css';
import { useUserManagement } from '@/hooks/useUserManagement';

export const Home = () => {
    const { selectedUser, handleUserSelect, logoutUser } = useUserManagement();
    return (
        <div className='w-full flex flex-row'>
            <UserNav onLogout={logoutUser} />
            <UserList onUserSelect={handleUserSelect} selectedUser={selectedUser} />
            <MessageBox selectedUser={selectedUser} />
        </div>
    );
};