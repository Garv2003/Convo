import { FormEvent } from "react";

export type User = {
    $id: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastSeen: string;
    isTyping?: boolean;
}

export interface Message {
    $id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
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

export type UserListProps = {
    onUserSelect: (user: User) => void;
    selectedUser: User | null;
}

export type MessageBoxProps = {
    selectedUser: User | null;
}

export type MessageHeaderProps = {
    user: User;
    isTyping?: boolean;
}

export type UserItemProps = {
    user: User;
    onClick: (user: User) => void;
}

export type MessageItemProps = {
    message: Message;
    isCurrentUser: boolean;
    onCopy: (content: string) => void;
    onDelete: (message: Message) => void;
    onEdit?: (event: React.MouseEvent<HTMLDivElement>, message: Message) => void;
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
}