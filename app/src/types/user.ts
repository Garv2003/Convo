export interface User {
    $id: string;
    userId: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastSeen: string;
}
