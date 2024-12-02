import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { account, DATABASE_ID, COLLECTION_ID_USERS, databases, Query } from '@/appwrite/config';
import { useQuery } from '@tanstack/react-query';
import { Models } from 'appwrite';

const updateUserStatus = async () => {
    try {
        const currentUser = await account.get();
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_USERS,
            [
                Query.equal('email', currentUser.email),
            ]
        );
        if (response.documents[0].status === 'offline') {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                response.documents[0].$id,
                {
                    status: 'online',
                    lastSeen: new Date().toISOString(),
                    lastPing: new Date().toISOString(),
                }
            );
        }
    } catch (error) {
        console.error('Error updating user status:', error);
    }
};

export function Layout() {
    const navigate = useNavigate();

    const { data: user, isLoading } = useQuery<Models.User<Models.Preferences>>({
        queryKey: ['user'],
        queryFn: async () => {
            await updateUserStatus();
            return await account.get();
        },
        retry: false,
    });

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 min-h-screen items-center justify-center">
                <img src="/loader.svg" alt="Logo" className="animate-spin size-[60px]" />
                <span className="ml-2 text-2xl font-bold">Loading...</span>
            </div>
        );
    }

    return user ? <Outlet /> : null;
}