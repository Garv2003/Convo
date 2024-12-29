import { UserNav, UserList, MessageBox, SideMessageView } from '@/components/custom';
import { selectedUserStore } from '@/store/selectedUserStore';
import '@/styles/scrollbar.css';

export const Home = () => {
    const { selectedUser } = selectedUserStore();

    return (
        <div className='w-full flex flex-row'>
            <UserNav />
            <UserList />
            {selectedUser ? <MessageBox /> : <SideMessageView />}
        </div>
    );
};