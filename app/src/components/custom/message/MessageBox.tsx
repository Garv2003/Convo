import {
    GetAllMessages, deleteMessage, submitMessage, updateMessage, deleteFile
    //  setTypingStatus
} from '@/appwrite/actions';
import {
    client, COLLECTION_ID_MESSAGES, DATABASE_ID,
    // COLLECTION_ID_TYPING 
} from '@/appwrite/config';
import type {
    Message, AppwriteRealtimeResponse, FileData, User
    // TypingStatusDocument
} from '@/types';
import { MessageHeader, MessageList, MessageInput, DeleteDialog, EditDialog } from '@/components/custom';
import { useState, FormEvent, useRef, useEffect } from 'react';
import { selectedUserStore } from "@/store/selectedUserStore";
import { userStore } from '@/store/userStore';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const MessageBox = () => {
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [showMessageEditDialog, setShowMessageEditDialog] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
    const [loadingEditMessage, setLoadingEditMessage] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    // const [isTyping, setIsTyping] = useState(false);

    const [fileLoading, setFileLoading] = useState(false);
    const [fileInfo, setFileInfo] = useState<FileData | null>(null);
    const [fileInfoForEdit, setFileInfoForEdit] = useState<FileData | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    // const typingTimeoutRef = useRef<NodeJS.Timeout>();
    // const lastTypingUpdate = useRef<number>(0);

    const { user: currentUser } = userStore();
    const { selectedUser } = selectedUserStore();

    useEffect(() => {
        fetchedMessages();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            (response: AppwriteRealtimeResponse<Message>) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const { senderId, receiverId, $id, content, createdAt, fileId, fileName, fileType, fileUrl, fileMineType, messageType } = response.payload;

                    if ((senderId === selectedUser?.$id && receiverId === currentUser?.$id) ||
                        (senderId === currentUser?.$id && receiverId === selectedUser?.$id)) {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                $id,
                                content,
                                senderId,
                                receiverId,
                                createdAt,
                                fileId,
                                fileName,
                                fileType,
                                fileUrl,
                                fileMineType,
                                messageType
                            }
                        ]);
                    }
                }
                if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                    refetchMessages();
                }
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

    // useEffect(() => {
    //     if (!selectedUser || !currentUser) return;
    //     const unsubscribe = client.subscribe<AppwriteRealtimeResponse<TypingStatusDocument>>(
    //         [`databases.${DATABASE_ID}.collections.${COLLECTION_ID_TYPING}.documents`],
    //         (response) => {
    //             if (response.events.includes('databases.*.collections.*.documents.*.create') ||
    //                 response.events.includes('databases.*.collections.*.documents.*.update')) {
    //                 const typingData = response.payload as unknown as TypingStatusDocument;
    //                 if (typingData.receiverId === currentUser.$id &&
    //                     typingData.senderId === selectedUser.$id) {
    //                     setIsTyping(typingData.isTyping);
    //                 }
    //             }
    //         }
    //     );
    //     return () => {
    //         unsubscribe();
    //     };
    // }, [selectedUser, currentUser]);

    const refetchMessages = async () => {
        const messages = await GetAllMessages(selectedUser);
        setMessages(messages);
    }

    const fetchedMessages = async () => {
        if (!selectedUser) {
            setIsLoadingMessages(false);
            setMessages([]);
            return;
        }

        try {
            const messages = await GetAllMessages(selectedUser);
            setMessages(messages);
        } catch {
            setMessages([]);
        }
        finally {
            setIsLoadingMessages(false);
        }
    }

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;
        try {
            if (messageToDelete.fileId) await deleteFile(messageToDelete.fileId);
            await deleteMessage(messageToDelete.$id);
            refetchMessages();
            toast.success('Message deleted successfully');
        } catch {
            toast.error('Failed to delete message', {
                description: "Please try again"
            });
        } finally {
            setMessageToDelete(null);
        }
    };

    const handleCopyMessage = (content: string) => {
        if (!content) return;
        navigator.clipboard.writeText(content)
            .then(() => toast.success('Message copied to clipboard'))
            .catch(() => toast.error('Failed to copy message'));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !fileInfo) || !selectedUser) return;
        try {
            setNewMessage('');
            hideEmojiPicker();
            setFileInfo(null);
            await submitMessage({
                selectedUser,
                currentUser: currentUser as User,
                content: newMessage.trim() as string | null,
                fileId: fileInfoForEdit?.$id as string | null,
                fileName: fileInfoForEdit?.name as string | null,
                fileType: fileInfoForEdit?.type as string | null,
                fileUrl: fileInfoForEdit?.url as string | null,
                fileMineType: fileInfoForEdit?.mimeType as string | null,
                messageType: fileInfoForEdit ? 'file' : 'text'
            });
            setFileInfoForEdit(null);
        } catch {
            toast.error('Failed to send message', {
                description: "Please try again"
            });
        }
    };

    const hideEditDialog = () => {
        setShowMessageEditDialog(false);
        setMessageToEdit(null);
    };

    const handleEditMessageClick = (e: React.MouseEvent, message: Message) => {
        e.preventDefault();
        setMessageToEdit(message);
        setShowMessageEditDialog(true);
    };

    const handleEditMessage = async (content: string) => {
        if (!messageToEdit) return;
        try {
            setLoadingEditMessage(true);
            await updateMessage(messageToEdit.$id, content);
            hideEditDialog();
            refetchMessages();
        } catch {
            toast.error('Failed to update message', {
                description: "Please try again"
            });
        }
        finally {
            setLoadingEditMessage(false);
        }
    };

    // const handleTyping = async () => {
    //     if (!selectedUser || !currentUser) return;
    //     const now = Date.now();
    //     if (now - lastTypingUpdate.current < 3000) {
    //         return;
    //     }
    //     lastTypingUpdate.current = now;
    //     try {
    //         await setTypingStatus(currentUser.$id, selectedUser.$id, true);
    //     } catch (error) {
    //         toast.error('Failed to send typing status', {
    //             description: "Please try again"
    //         });
    //     }
    //     if (typingTimeoutRef.current) {
    //         clearTimeout(typingTimeoutRef.current);
    //     }
    //     typingTimeoutRef.current = setTimeout(async () => {
    //         try {
    //             await setTypingStatus(currentUser.$id, selectedUser.$id, false);
    //         } catch (error) {
    //             toast.error('Failed to clear typing status', {
    //                 description: "Please try again"
    //             });
    //         }
    //     }, 3000);
    // };

    const handleMessageChange = (message: string) => {
        setNewMessage(message);
        // handleTyping();
    };

    const showEmojiPickerHandler = () => {
        setShowEmojiPicker(true);
    }
    const hideEmojiPicker = () => {
        setShowEmojiPicker(false);
    }

    const handleFileChange = (fileData: FileData | null) => {
        if (!fileData) {
            setFileInfo(null);
            return;
        }
        setFileInfo(fileData);
        setFileInfoForEdit(fileData);
    }

    if (isLoadingMessages) {
        return (
            <div className='w-full flex flex-col m-2'>
                <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col">
                    <MessageHeader user={selectedUser!} />
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
                    <MessageHeader user={selectedUser!}
                    // isTyping={isTyping} 
                    />
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="flex flex-col items-center space-y-6 max-w-md text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">Start a Conversation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Send your first message to {selectedUser!.name} to start the conversation
                                </p>
                            </div>
                        </div>
                    </div>
                    <MessageInput
                        newMessage={newMessage}
                        onMessageChange={handleMessageChange}
                        onSubmit={handleSubmit}
                        onEmojiButtonClick={showEmojiPickerHandler}
                        onEmojiClose={hideEmojiPicker}
                        showEmojiPicker={showEmojiPicker}
                        fileInfo={fileInfo}
                        onFileChange={handleFileChange}
                        fileLoading={fileLoading}
                        setFileLoading={setFileLoading}
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
                        <MessageHeader user={selectedUser}
                        // isTyping={isTyping} 
                        />
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
                    onMessageChange={handleMessageChange}
                    onSubmit={handleSubmit}
                    onEmojiButtonClick={showEmojiPickerHandler}
                    onEmojiClose={hideEmojiPicker}
                    showEmojiPicker={showEmojiPicker}
                    fileInfo={fileInfo}
                    onFileChange={handleFileChange}
                    fileLoading={fileLoading}
                    setFileLoading={setFileLoading}
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