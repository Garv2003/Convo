import type { MessageListProps } from "@/types";
import { MessageItem } from "@/components/custom";

export const MessageList = ({
    messages,
    selectedUser,
    onCopyMessage,
    onDeleteMessage,
    messagesEndRef,
    currentUser,
    onEditMessage
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
                            onEdit={(event, message) => onEditMessage?.(event, message)}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
