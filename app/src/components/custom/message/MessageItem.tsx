import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";
import type { MessageItemProps } from "@/types";
import { Pencil } from "lucide-react";
import { useState } from "react";

export const MessageItem = ({ message, isCurrentUser, onCopy, onDelete, onEdit }: MessageItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const handleEditClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsOpen(false);
        onEdit?.(event, message);
    };

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <div
                        onContextMenu={handleContextMenu}
                        className={`flex flex-col max-w-[75%] gap-1 rounded-2xl px-4 py-2 text-sm cursor-context-menu
                            ${isCurrentUser
                                ? 'bg-primary text-primary-foreground rounded-tr-none hover:bg-primary/90'
                                : 'bg-muted rounded-tl-none hover:bg-muted/90'
                            }`}
                    >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <span
                            className={`text-[10px] ${isCurrentUser
                                    ? 'text-primary-foreground/80'
                                    : 'text-muted-foreground'
                                }`}
                        >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onCopy(message.content)}>
                        <span className="flex items-center">
                            <svg
                                className="mr-2 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            Copy Message
                        </span>
                    </DropdownMenuItem>
                    {isCurrentUser && (
                        <>
                            <DropdownMenuItem onClick={handleEditClick}>
                                <span className="flex items-center">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Message
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => onDelete(message)}
                            >
                                <span className="flex items-center">
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                    Delete Message
                                </span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
