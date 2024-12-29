

import { File, FileText, Image, Video, X } from 'lucide-react';
import { Card, CardContent, Button } from "@/components/ui";
import { Eye } from "lucide-react";

const FilePreview = ({
    fileUrl,
    fileType,
    onPreview,
    onRemove
}: {
    fileUrl: string;
    fileType: string;
    onPreview: () => void;
    onRemove: () => void;
}) => {
    const getFileIcon = () => {
        if (fileType?.startsWith('image')) return <Image className="w-8 h-8" />;
        if (fileType?.startsWith('video')) return <Video className="w-8 h-8" />;
        if (fileType === 'application/pdf') return <FileText className="w-8 h-8" />;
        return <File className="w-8 h-8" />;
    };

    const getPreviewContent = () => {
        if (fileType?.startsWith('image')) {
            return (
                <div className="relative group">
                    <img
                        src={fileUrl}
                        alt="Preview"
                        className="w-full h-32 object-center object-cover rounded-md transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onPreview}
                            className="text-white hover:text-white/90"
                        >
                            Click to view
                        </Button>
                    </div>
                </div>
            );
        }

        if (fileType?.startsWith('video')) {
            return (
                <div className="relative group">
                    <video className="w-full h-32 object-cover rounded-md">
                        <source src={fileUrl} type={fileType} />
                    </video>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onPreview}
                            className="text-white hover:text-white/90"
                        >
                            Play video
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-32 bg-secondary/20 rounded-md p-4 group-hover:bg-secondary/30 transition-colors">
                {getFileIcon()}
                <span className="mt-2 text-sm text-muted-foreground truncate max-w-[120px]">
                    {fileUrl.split('/').pop() || 'File'}
                </span>
            </div>
        );
    };

    return (
        <Card className="w-full group">
            <CardContent className="p-3">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive/90 hover:bg-destructive text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={onRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    {getPreviewContent()}
                    {!fileType?.startsWith('image') && !fileType?.startsWith('video') && (
                        <Button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow hover:bg-secondary/90 h-9 w-full mt-2"
                            onClick={onPreview}
                        >
                            <Eye />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export { FilePreview };