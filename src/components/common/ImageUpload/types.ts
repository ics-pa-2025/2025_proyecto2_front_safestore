export interface ImageUploadProps {
    value?: string;
    onChange: (imageUrl: string | null) => void;
    disabled?: boolean;
    accept?: string;
    maxSize?: number;
    className?: string;
}

export interface ImageUploadRef {
    reset: () => void;
    getFile: () => File | null;
}