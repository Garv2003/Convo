import { useState, FormEvent, useRef, useEffect } from 'react';
import { MessageHeader, MessageList, MessageInput, DeleteDialog } from '@/components/custom';
import { client, COLLECTION_ID_MESSAGES, DATABASE_ID, account } from '@/appwrite/config';
import type { Message, User, MessageBoxProps, } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EditDialog } from './EditDialog';
import { GetAllMessages, deleteMessage, submitMessage, updateMessage } from '@/appwrite/actions';
import { MessageSquare } from 'lucide-react';

export const MessageBox = ({ selectedUser }: MessageBoxProps) => {
    const [newMessage, setNewMessage] = useState('');
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
        queryKey: ['messages', selectedUser?.$id],
        queryFn: async () => {
            if (!selectedUser) return [];
            return GetAllMessages(selectedUser);
        },
        enabled: !!selectedUser
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await account.get();
                setCurrentUser({
                    $id: currentUser.$id,
                    name: currentUser.name,
                    email: currentUser.email,
                    status: 'online',
                    lastSeen: new Date().toISOString()
                } as User);
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

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            await deleteMessage(messageToDelete.$id);
            await refetchMessages();
            toast.success('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message', {
                description: "Please try again"
            });
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
            setNewMessage('');
            await submitMessage(newMessage.trim(), selectedUser);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message', {
                description: "Please try again"
            });
        }
    };

    const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
    const [showMessageEditDialog, setShowMessageEditDialog] = useState(false);
    const [loadingEditMessage, setLoadingEditMessage] = useState(false);

    const hideEditDialog = () => {
        setShowMessageEditDialog(false);
        setMessageToEdit(null);
    };

    const handleEditMessageClick = (e: React.MouseEvent, message: Message) => {
        e.preventDefault();
        setMessageToEdit(message);
        setShowMessageEditDialog(true);
    };

    // Add this function to handle message updates
    const handleEditMessage = async (content: string) => {
        if (!messageToEdit) return;
        try {
            setLoadingEditMessage(true);
            await updateMessage(messageToEdit.$id, content);
            hideEditDialog();
            setLoadingEditMessage(false);
            refetchMessages();
        } catch (error) {
            setLoadingEditMessage(false);
            toast.error('Failed to update message', {
                description: "Please try again"
            });
        }
    };

    if (!selectedUser) {
        return (
            <div className='w-full flex flex-col m-2'>
                <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">No Conversation Selected</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                        Choose a user from the sidebar to start a new conversation or continue an existing one
                    </p>
                </div>
            </div>
        );
    }

    if (isLoadingMessages) {
        return (
            <div className='w-full flex flex-col m-2'>
                <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col">
                    <MessageHeader user={selectedUser} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative size-12">
                                <div className="absolute inset-0 rounded-full border-4 border-muted-foreground/20"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-primary border-l-transparent animate-spin"></div>
                            </div>
                            <p className="text-sm text-muted-foreground">Loading messages...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className='w-full flex flex-col m-2'>
                <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col">
                    <MessageHeader user={selectedUser} />
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="flex flex-col items-center space-y-6 max-w-md text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">Start a Conversation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Send your first message to {selectedUser.name} to start the conversation
                                </p>
                            </div>
                        </div>
                    </div>
                    <MessageInput
                        newMessage={newMessage}
                        onMessageChange={setNewMessage}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col m-2'>
            <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col">
                {selectedUser && (
                    <>
                        <MessageHeader user={selectedUser} />
                        <MessageList
                            messages={messages}
                            selectedUser={selectedUser}
                            onCopyMessage={handleCopyMessage}
                            onDeleteMessage={setMessageToDelete}
                            messagesEndRef={messagesEndRef}
                            currentUser={currentUser!}
                            onEditMessage={handleEditMessageClick}
                        />
                    </>
                )}
                <MessageInput
                    newMessage={newMessage}
                    onMessageChange={setNewMessage}
                    onSubmit={handleSubmit}
                />
                <EditDialog
                    isOpen={showMessageEditDialog}
                    onClose={hideEditDialog}
                    onConfirm={handleEditMessage}
                    loading={loadingEditMessage}
                    defaultContent={messageToEdit?.content || ''}
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