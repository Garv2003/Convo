import { Client, Account, Databases, ID, Query, Models, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const COLLECTION_ID_MESSAGES = import.meta.env.VITE_COLLECTION_ID_MESSAGES;
const COLLECTION_ID_USERS = import.meta.env.VITE_COLLECTION_ID_USERS;
const COLLECTION_ID_TYPING = import.meta.env.VITE_COLLECTION_ID_TYPING;
const STORAGE_BUCKET_ID = import.meta.env.VITE_STORAGE_BUCKET_ID;

export { client, account, databases, storage, ID, DATABASE_ID, COLLECTION_ID_MESSAGES, COLLECTION_ID_USERS, Query, COLLECTION_ID_TYPING, STORAGE_BUCKET_ID };
export type { Models };
