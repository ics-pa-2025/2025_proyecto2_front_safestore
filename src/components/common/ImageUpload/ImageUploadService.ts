export class ImageUploadService {
    private static readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    static validateFile(file: File, maxSize: number = this.DEFAULT_MAX_SIZE): string | null {
        if (!this.ALLOWED_TYPES.includes(file.type)) {
            return 'Only image files (JPEG, PNG, GIF, WebP) are allowed';
        }

        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            return `File size must be less than ${maxSizeMB}MB`;
        }

        return null;
    }

    static createPreviewUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    static revokePreviewUrl(url: string): void {
        URL.revokeObjectURL(url);
    }

    static getImageUrl(baseUrl: string, imageUrl: string): string {
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        return `${baseUrl}${imageUrl}`;
    }
}