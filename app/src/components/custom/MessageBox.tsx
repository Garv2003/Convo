import { useState, FormEvent, useRef, useEffect } from 'react';
import { client, COLLECTION_ID_MESSAGES, DATABASE_ID, account, databases, ID, COLLECTION_ID_USERS } from '@/appwrite/config';
import { useQuery } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { toast } from 'sonner';
import { Message, User } from './types';
import { MessageHeader } from './message/MessageHeader';
import { MessageList } from './message/MessageList';
import { MessageInput } from './message/MessageInput';
import { DeleteDialog } from './message/DeleteDialog';

interface MessageBoxProps {
    selectedUser: User | null;
}

export const MessageBox = ({ selectedUser }: MessageBoxProps) => {
    const [newMessage, setNewMessage] = useState('');
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: messages = [], refetch: refetchMessages } = useQuery({
        queryKey: ['messages', selectedUser?.$id],
        queryFn: async () => {
            if (!selectedUser) return [];

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
        },
        enabled: !!selectedUser
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await account.get();
                setCurrentUser(currentUser);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentUser();
    }, []);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    refetchMessages();
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [refetchMessages]);

    const updateUserStatus = async () => {
        try {
            const currentUser = await account.get();
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                [Query.equal('email', currentUser.email)]
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

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            await updateUserStatus();
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID_MESSAGES,
                messageToDelete.$id
            );
            await refetchMessages();
            toast.success('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        } finally {
            setMessageToDelete(null);
        }
    };

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content)
            .then(() => toast.success('Message copied to clipboard'))
            .catch(() => toast.error('Failed to copy message'));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const currentUser = await account.get();
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_MESSAGES,
                ID.unique(),
                {
                    content: newMessage,
                    senderId: currentUser.$id,
                    receiverId: selectedUser.$id,
                    createdAt: new Date().toISOString(),
                }
            );
            setNewMessage('');
            await updateUserStatus();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!selectedUser) {
        return (
            <div className='w-full flex flex-col m-2'>
                <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex items-center justify-center">
                    <p className="text-muted-foreground">Select a user to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col m-2'>
            <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col">
                <MessageHeader user={selectedUser} />

                <MessageList
                    messages={messages}
                    selectedUser={selectedUser}
                    onCopyMessage={handleCopyMessage}
                    onDeleteMessage={setMessageToDelete}
                    messagesEndRef={messagesEndRef}
                    currentUser={currentUser}
                />

                <MessageInput
                    newMessage={newMessage}
                    onMessageChange={setNewMessage}
                    onSubmit={handleSubmit}
                />

                <DeleteDialog
                    isOpen={!!messageToDelete}
                    onClose={() => setMessageToDelete(null)}
                    onConfirm={handleDeleteMessage}
                />
            </div>
        </div>
    );
};