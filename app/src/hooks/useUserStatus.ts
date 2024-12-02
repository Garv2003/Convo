import { updateUsersStatus } from '@/appwrite/actions';
import { useEffect } from 'react';

export const useUserStatus = () => {
    useEffect(() => {
        updateUsersStatus();
        const intervalId = setInterval(updateUsersStatus, 60000);
        return () => clearInterval(intervalId);
    }, []);
};
