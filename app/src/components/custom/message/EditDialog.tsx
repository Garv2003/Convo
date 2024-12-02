import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
    Textarea
} from "@/components/ui";
import type { EditDialogProps } from "@/types";

export const EditDialog = ({ isOpen, onClose, onConfirm, defaultContent, loading }: EditDialogProps) => {
    const [content, setContent] = useState(defaultContent);

    useEffect(() => {
        setContent(defaultContent);
    }, [defaultContent]);

    const handleConfirm = () => {
        onConfirm(content);
        onClose();
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Message</AlertDialogTitle>
                </AlertDialogHeader>
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Type your message here..."
                />
                <AlertDialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};