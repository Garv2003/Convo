import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function Layout() {
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 min-h-screen items-center justify-center">
                <img src="loader.svg" alt="Logo" className="animate-spin size-[60px]" />
                <span className="ml-2 text-2xl font-bold">Loading...</span>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : null;
 return user ? <Outlet /> : null;
}