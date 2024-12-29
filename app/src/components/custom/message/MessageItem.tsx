import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui";
import {
    Download,
    Eye,
    File,
    FileText,
    Image,
    Video,
} from "lucide-react";
import { useState, useCallback } from "react";
import { MessageItemProps } from "@/types";
import { FilePreviewFull } from "@/components/custom";

export const MessageItem = ({
    message,
    isCurrentUser,
    onCopy,
    onDelete,
    onEdit,
}: MessageItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setIsOpen(true);
    }, []);

    const handlePreviewClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (message.fileUrl) {
                setPreviewOpen(true);
                // window.open(message.fileUrl, "_blank");
            }
        },
        [message.fileUrl]
    );

    const handleDownload = useCallback(
        async () => {
            if (message.fileUrl) {
                try {
                    const response = await fetch(message.fileUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = message.fileName || "download";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error("Download failed:", error);
                }
            }
        },
        [message.fileUrl, message.fileName]
    );

    const getFileIcon = () => {
        if (message.fileType?.startsWith("image")) return <Image className="w-5 h-5" />;
        if (message.fileType?.startsWith("video")) return <Video className="w-5 h-5" />;
        if (message.fileType === "application/pdf") return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const renderFilePreview = () => {
        if (!message.fileUrl) return null;

        if (message.fileType?.startsWith("image")) {
            return (
                <div className="relative group max-w-md" onClick={handlePreviewClick}>
                    <img
                        src={message.fileUrl}
                        alt={message.fileName || "Image"}
                        className="rounded-lg max-h-60 object-cover cursor-pointer max-w-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                </div>
            );
        }

        if (message.fileType?.startsWith("video")) {
            return (
                <div className="relative group max-w-md">
                    <video controls className="rounded-lg max-w-md max-h-60">
                        <source src={message.fileUrl} type={message.fileType} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg max-w-xs group relative">
                {getFileIcon()}
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                        {message.fileName || "File"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {message.fileType?.split("/")[1]?.toUpperCase() || "FILE"}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePreviewClick}
                        className="p-1 rounded-full hover:bg-muted-foreground/10"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-1 rounded-full hover:bg-muted-foreground/10"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <FilePreviewFull
                file={{
                    name: message.fileName as string,
                    url: message.fileUrl as string,
                    type: message.fileType as string,
                }}
                onClose={() => setPreviewOpen(false)}
                open={previewOpen}
                onDownload={handleDownload}
            />
            <div
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                onContextMenu={handleContextMenu}
                onDoubleClick={handleContextMenu}
            >
                <div
                    className={`flex flex-col gap-1 rounded-2xl px-4 py-2 text-sm relative
            ${isCurrentUser
                            ? "bg-primary text-primary-foreground rounded-tr-none hover:bg-primary/90"
                            : "bg-muted rounded-tl-none hover:bg-muted/90"
                        }`}
                >
                    {message.fileUrl && <div className="mb-2">{renderFilePreview()}</div>}
                    {message.content && (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                    <span
                        className={`text-[10px] ${isCurrentUser
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                            }`}
                    >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </div>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuContent
                    align="start"
                    side="right"
                    style={{
                        position: "absolute",
                        left: `${menuPosition.x}px`,
                        top: `${menuPosition.y}px`,
                    }}
                >
                    {message.content && <DropdownMenuItem onClick={() => onCopy(message?.content!)}>
                        Copy Message
                    </DropdownMenuItem>
                    }
                    {isCurrentUser && (
                        <>
                            <DropdownMenuItem onClick={(e) => onEdit?.(e, message)}>
                                Edit Message
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => onDelete(message)}
                            >
                                Delete Message
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
