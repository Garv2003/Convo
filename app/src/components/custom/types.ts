export interface Message {
    $id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}

export interface User {
    $id: string;
    userId: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastSeen: string;
}
