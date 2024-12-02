import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { logoutAction } from '@/appwrite/actions';

export const useLogout = () => {
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            await logoutAction();
            navigate('/login');
            toast.success('Logout successful!', {
                description: "You are now logged out."
            });
        } catch (error) {
            toast.error('Failed to logout', {
                description: "Please try again"
            });
        }
    };

    return { logoutUser };
};
