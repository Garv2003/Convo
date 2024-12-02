import { Message, User } from "../types";
import { MessageItem } from "./Message";

interface MessageListProps {
    messages: Message[];
    selectedUser: User;
    onCopyMessage: (content: string) => void;
    onDeleteMessage: (message: Message) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    currentUser: User;
}

export const MessageList = ({ 
    messages, 
    selectedUser, 
    onCopyMessage, 
    onDeleteMessage,
    messagesEndRef ,
    currentUser
}: MessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-4">
                {messages.map((message) => {
                    return (
                        <MessageItem
                            key={message.$id}
                            message={message}
                            isCurrentUser={
                                message.senderId === currentUser.$id &&
                                message.receiverId === selectedUser.$id
                            }
                            onCopy={onCopyMessage}
                            onDelete={onDeleteMessage}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
