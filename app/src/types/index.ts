import { FormEvent } from "react";

export type User = {
    $id: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastSeen: string;
    isTyping?: boolean;
}

export type UserState = {
    user: User | null;
    setUser: (user: User) => void;
}

export type selectedUserState = {
    selectedUser: User | null;
    setSelectedUser: (user: User) => void;
}

export interface Message {
    $id: string;
    content?: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
    fileId?: string;
    fileMineType?: string;
    messageType?: string;
}

export interface TypingStatus {
    $id: string;
    senderId: string;
    receiverId: string;
    isTyping: boolean;
    createdAt: string;
}

export interface AppwriteRealtimeResponse<T> {
    events: string[];
    channels: string[];
    timestamp: number;
    payload: T;
}

export interface TypingStatusDocument {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    senderId: string;
    receiverId: string;
    isTyping: boolean;
    createdAt: string;
}

export interface TypingStatusResponse {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $databaseId: string;
    $collectionId: string;
    senderId: string;
    receiverId: string;
    isTyping: boolean;
}

export type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
}

export type MessageHeaderProps = {
    user: User;
    isTyping?: boolean;
}

export type UserItemProps = {
    user: User;
}

export type MessageListProps = {
    messages: Message[];
    selectedUser: User;
    onCopyMessage: (content: string) => void;
    onDeleteMessage: (message: Message) => void;
    onEditMessage?: (event: React.MouseEvent<HTMLDivElement>, message: Message) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    currentUser: User;
}

export type DeleteDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export type EditDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (content: string) => void;
    defaultContent: string;
    loading: boolean;
}

export type MessageInputProps = {
    newMessage: string;
    onMessageChange: (message: string) => void;
    onSubmit: (e: FormEvent) => void;
    onEmojiButtonClick: () => void;
    onEmojiClose: () => void;
    showEmojiPicker: boolean;
    fileInfo: FileData | null;
    onFileChange: (fileData: FileData | null) => void;
    fileLoading: boolean;
    setFileLoading: (value: boolean) => void;
}

export type FileData = {
    $id: string;
    mimeType: string;
    name: string;
    type: string;
    url: string;
};

export type MessageItemProps = {
    message: Message;
    isCurrentUser: boolean;
    onCopy: (content: string) => void;
    onDelete: (message: Message) => void;
    onEdit?: (event: React.MouseEvent<HTMLDivElement>, message: Message) => void;
}