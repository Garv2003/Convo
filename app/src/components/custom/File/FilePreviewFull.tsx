import { X, Download, FileText, Image, FileAudio, File } from 'lucide-react';
import { Button, CardContent, Card } from '@/components/ui';
import { FilePreviewFullProps } from '@/types';

const FilePreviewFull = ({ file, onClose, onDownload, open }: FilePreviewFullProps) => {
    const getFileIcon = () => {
        switch (true) {
            case file.type.startsWith('image/'):
                return <Image className="w-6 h-6" />;
            case file.type.includes('pdf'):
                return <FileText className="w-6 h-6" />;
            case file.type.includes('audio/'):
                return <FileAudio className="w-6 h-6" />;
            default:
                return <File className="w-6 h-6" />;
        }
    };

    const renderPreview = () => {
        switch (true) {
            case file.type.startsWith('image/'):
                return (
                    <div className="relative w-full h-full">
                        <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                );
            case file.type.includes('pdf'):
                return (
                    <iframe
                        src={file.url}
                        className="w-full h-full"
                        title={file.name}
                    />
                );
            case file.type.includes('audio/'):
                return (
                    <audio controls className="w-full mt-4">
                        <source src={file.url} type={file.type} />
                        Your browser does not support the audio element.
                    </audio>
                );
            default:
                return (
                    <div className="flex items-center justify-center p-8">
                        {getFileIcon()}
                        <span className="ml-2">{file.name}</span>
                    </div>
                );
        }
    };

    if (!open) {
        return null;
    }

    return (
        <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full h-[90vh] max-w-7xl mx-auto">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2 h-full">
                    {getFileIcon()}
                    <div className="h-full">
                        <h3 className="font-medium">{file.name}</h3>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {onDownload && <Button
                        variant="outline"
                        size="icon"
                        onClick={onDownload}
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </Button>}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onClose}
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <CardContent className="p-4 h-[90%]">
                {renderPreview()}
            </CardContent>
        </Card>
    );
};

export { FilePreviewFull };