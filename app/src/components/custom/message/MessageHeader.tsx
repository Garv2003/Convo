import { MessageHeaderProps } from "@/types";

export const MessageHeader = ({ user, isTyping }: MessageHeaderProps) => {
    return (
        <div className="space-y-1.5 p-6 flex flex-row items-center border-b">
            <div className="flex items-center space-x-4">
                <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10">
                    <span className="text-lg font-semibold w-full h-full flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {isTyping ? (
                            <span className="flex items-center gap-1">
                                <span>typing</span>
                                <span className="flex space-x-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                </span>
                            </span>
                        ) : user.email}
                    </p>
                </div>
                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.status === 'online'
                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                    : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20'
                    }`}>
                    {user.status === 'online' ? 'Online' : 'Offline'}
                </span>
            </div>
        </div>
    );
};
