import { FormEvent } from 'react';

interface MessageInputProps {
    newMessage: string;
    onMessageChange: (message: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export const MessageInput = ({ newMessage, onMessageChange, onSubmit }: MessageInputProps) => {
    return (
        <div className="p-6">
            <form className="flex w-full items-center space-x-2" onSubmit={onSubmit}>
                <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => onMessageChange(e.target.value)}
                />
                <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
                    type="submit"
                    disabled={!newMessage.trim()}
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
                </button>
            </form>
        </div>
    );
};
