import { account, DATABASE_ID, COLLECTION_ID_USERS, COLLECTION_ID_MESSAGES, databases, ID, Query, COLLECTION_ID_TYPING } from '@/appwrite/config';
import type { User } from '@/types';

export const updateUserStatus = async () => {
    try {
        const currentUser = await account.get();
        const response = await databases.getDocument(
            DATABASE_ID,
            COLLECTION_ID_USERS,
            currentUser.$id
        );
        if (response.status === 'offline') {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                currentUser.$id,
                {
                    status: 'online',
                    lastSeen: new Date().toISOString(),
                }
            );
        }
    } catch (error) {
        console.error('Error updating user status:', error);
    }
};

export const changeOfflineStatus = async () => {
    try {
        const currentUser = await account.get();
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID_USERS,
            currentUser.$id,
            {
                status: 'offline',
                lastSeen: new Date().toISOString(),
            }
        );
    } catch (error) {
        throw error;
    }
};

export const loginAction = async (email: string, password: string) => {
    try {
        await account.createEmailPasswordSession(email, password);
        const currentUser = await account.get();
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID_USERS,
            currentUser.$id,
            {
                status: 'online',
                lastSeen: new Date().toISOString(),
            }
        );
    }
    catch (error) {
        throw error;
    }
}

export const logoutAction = async () => {
    try {
        await changeOfflineStatus();
        await account.deleteSession('current');
    }
    catch (error) {
        throw error;
    }
}

export const registerAction = async (email: string, password: string, name: string) => {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_USERS,
            user.$id,
            {
                name,
                email,
                status: 'offline',
                lastSeen: new Date().toISOString(),
            }
        );
        return user;
    }
    catch (error) {
        throw error;
    }
}

export const fetchAllUsers = async (selectedUser: User | null, onUserSelect: (user: User) => void) => {
    try {
        const currentUser = await account.get();
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_USERS,
            [Query.orderDesc('lastSeen'), Query.notEqual('$id', currentUser.$id)]
        );

        // change status of selected user
        if (selectedUser) {
            const currentUser = response.documents.find(doc => doc.$id === selectedUser.$id);
            if (currentUser) {
                onUserSelect({
                    $id: currentUser.$id,
                    name: currentUser.name,
                    email: currentUser.email,
                    status: currentUser.status,
                    lastSeen: currentUser.lastSeen
                });
            }
        }

        return response.documents.map(doc => ({
            $id: doc.$id,
            name: doc.name,
            email: doc.email,
            status: doc.status,
            lastSeen: doc.lastSeen
        })) as User[];
    }
    catch (error) {
        throw error;
    }
}

export const updateUsersStatus = async () => {
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_USERS,
        [Query.orderDesc('lastSeen')]
    );
    const updatedUsers = response.documents.map(doc => ({
        $id: doc.$id,
        name: doc.name,
        email: doc.email,
        status: doc.status,
        lastSeen: doc.lastSeen
    } as User));
    const fiveMinutesAgo = new Date().getTime() - 300000;

    const updates = updatedUsers
        .filter(user => new Date(user.lastSeen).getTime() < fiveMinutesAgo)
        .map(user =>
            databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                user.$id,
                { status: 'offline' as const }
            )
        );

    await Promise.all(updates);
};

export const GetAllMessages = async (selectedUser: User) => {
    try {
        const currentUser = await account.get();
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderAsc('createdAt'),
                Query.equal('senderId', currentUser.$id),
                Query.equal('receiverId', selectedUser.$id),
            ]
        );

        // Fetch messages in the other direction (received messages)
        const responseReceived = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderAsc('createdAt'),
                Query.equal('senderId', selectedUser.$id),
                Query.equal('receiverId', currentUser.$id),
            ]
        );

        // Combine and sort messages by createdAt
        const allMessages = [...response.documents, ...responseReceived.documents]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return allMessages as any[];
    }
    catch (error) {
        throw error;
    }
}

export const deleteMessage = async (messageId: string) => {
    try {
        await updateUserStatus();
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            messageId
        );
    }
    catch (error) {
        throw error;
    }
}

export const submitMessage = async (content: string, selectedUser: User) => {
    try {
        const currentUser = await account.get();
        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            {
                content: content,
                senderId: currentUser.$id,
                receiverId: selectedUser.$id,
                createdAt: new Date().toISOString(),
            }
        );
        await updateUserStatus();
    }
    catch (error) {
        throw error;
    }
}

export const updateMessage = async (messageId: string, content: string) => {
    try {
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            messageId,
            { content }
        );
        await updateUserStatus();
    }
    catch (error) {
        throw error;
    }
}

export const setTypingStatus = async (senderId: string, receiverId: string, isTyping: boolean): Promise<void> => {
    try {
        const typingDocId = `t${senderId.slice(-15)}${receiverId.slice(-15)}`;
        const typingData = {
            senderId,
            receiverId,
            isTyping,
            createdAt: new Date().toISOString(),
        };

        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_TYPING,
                typingDocId,
                typingData
            );
        } catch (error: any) {
            if (error?.code === 404) {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID_TYPING,
                    typingDocId,
                    typingData
                );
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error setting typing status:', error);
        throw error;
    }
};

export const deleteTypingStatus = async (typingId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID_TYPING,
            typingId
        );
    } catch (error) {
        console.error('Error deleting typing status:', error);
    }
};

export const getTypingStatus = async (senderId: string, receiverId: string): Promise<boolean> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_TYPING,
            [
                Query.equal('senderId', senderId),
                Query.equal('receiverId', receiverId),
                Query.orderDesc('createdAt'),
                Query.limit(1)
            ]
        );
        return response.documents.length > 0 ? response.documents[0].isTyping : false;
    } catch (error) {
        console.error('Error getting typing status:', error);
        return false;
    }
};