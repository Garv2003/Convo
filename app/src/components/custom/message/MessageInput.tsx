import { uploadFile, getFileUrl, deleteFile } from "@/appwrite/actions";
import { SmilePlus, Paperclip, LoaderCircle } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { FilePreview } from "@/components/custom";
import type { MessageInputProps } from "@/types";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";

export const MessageInput = ({ newMessage, onMessageChange, onEmojiButtonClick, showEmojiPicker, onSubmit, onEmojiClose, fileInfo, onFileChange, fileLoading, setFileLoading }: MessageInputProps) => {
    const emojiRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current?.contains(event.target as Node)) {
                return;
            }
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                onEmojiClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInput = async () => {
        if (fileInputRef.current && fileInputRef.current.files) {
            const file = fileInputRef.current.files[0];
            if (file) {
                setFileLoading(true);
                const uploadedFileUrl = await uploadFile(file);
                const viewFileUrl = await getFileUrl(uploadedFileUrl.$id);
                onFileChange({
                    $id: uploadedFileUrl.$id,
                    mimeType: uploadedFileUrl.mimeType,
                    name: uploadedFileUrl.name,
                    type: file.type,
                    url: viewFileUrl.href
                });
                setFileLoading(false);
            }
        }
    };

    const handlePreviewClick = () => {
        if (fileInfo?.url) {
            window.open(fileInfo?.url, '_blank');
        }
    };

    const handleRemoveFile = async () => {
        await deleteFile(fileInfo!.$id);
        onFileChange(null);
        onMessageChange(newMessage);
    };

    return (
        <div className="p-6 relative flex flex-col items-center gap-2">
            {fileInfo && (
                <FilePreview
                    fileUrl={fileInfo.url}
                    fileType={fileInfo.type}
                    onPreview={handlePreviewClick}
                    onRemove={handleRemoveFile}
                />
            )}
            <div className="flex w-full items-center space-x-2">
                {showEmojiPicker && (
                    <div className={`absolute bottom-20 left-2 right-0 w-fit hidden md:block transition-opacity duration-300 transform ${showEmojiPicker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                        ref={emojiRef}
                    >
                        <EmojiPicker
                            onEmojiClick={(emoji) => {
                                onMessageChange(`${newMessage}${emoji.emoji}`);
                            }}
                            theme={Theme.DARK}

                        />
                    </div>
                )}
                <Button
                    className="hidden md:flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
                    style={{ margin: 0 }}
                    onClick={() => {
                        if (showEmojiPicker) {
                            onEmojiClose();
                        } else {
                            onEmojiButtonClick();
                        }
                    }}
                    ref={inputRef}
                >
                    <SmilePlus />
                </Button>
                <Button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
                    onClick={handleFileInputClick}
                    disabled={fileLoading}
                >
                    {fileLoading ? <LoaderCircle className="animate-spin" /> : <Paperclip />}
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} />
                <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => onMessageChange(e.target.value)}
                />
                <Button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
                    type="submit"
                    disabled={(!newMessage.trim() && !fileInfo) || fileLoading}
                    onClick={onSubmit}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-send"
                    >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                    </svg>
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
    );
};
