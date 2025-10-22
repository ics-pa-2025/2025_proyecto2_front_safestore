import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import type { ImageUploadProps, ImageUploadRef } from './types';
import { ImageUploadService } from './ImageUploadService';
import { getImageUrl } from '../../../utils/imageUtils';

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
    ({ value, onChange, disabled = false, accept = 'image/*', maxSize, className = '' }, ref) => {
        const [previewUrl, setPreviewUrl] = useState<string | null>(value ? getImageUrl(value) : null);
        const [error, setError] = useState<string | null>(null);
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            reset: () => {
                setSelectedFile(null);
                setPreviewUrl(value ? getImageUrl(value) : null);
                setError(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            getFile: () => selectedFile,
        }));

        const handleFileSelect = useCallback((file: File) => {
            const validationError = ImageUploadService.validateFile(file, maxSize);
            
            if (validationError) {
                setError(validationError);
                return;
            }

            setError(null);
            setSelectedFile(file);
            
            // Create preview
            if (previewUrl && previewUrl.startsWith('blob:')) {
                ImageUploadService.revokePreviewUrl(previewUrl);
            }
            
            const newPreviewUrl = ImageUploadService.createPreviewUrl(file);
            setPreviewUrl(newPreviewUrl);
            onChange(newPreviewUrl);
        }, [maxSize, onChange, previewUrl]);

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                handleFileSelect(file);
            }
        };

        const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file && !disabled) {
                handleFileSelect(file);
            }
        };

        const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
        };

        const handleRemove = () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                ImageUploadService.revokePreviewUrl(previewUrl);
            }
            setPreviewUrl(null);
            setSelectedFile(null);
            setError(null);
            onChange(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        const handleClick = () => {
            if (!disabled && fileInputRef.current) {
                fileInputRef.current.click();
            }
        };

        return (
            <div className={`image-upload ${className}`}>
                <div
                    className={`upload-area ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleClick}
                    style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        backgroundColor: disabled ? '#f8fafc' : '#ffffff',
                        borderColor: error ? '#ef4444' : '#cbd5e1',
                        minHeight: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled}
                        style={{ display: 'none' }}
                    />

                    {previewUrl ? (
                        <div style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '150px',
                                    objectFit: 'contain',
                                    borderRadius: '4px',
                                }}
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }}>
                                📷
                            </div>
                            <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                                {disabled ? 'Image upload disabled' : 'Click to upload or drag and drop'}
                            </p>
                            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                                PNG, JPG, GIF, WebP up to {maxSize ? `${maxSize / (1024 * 1024)}MB` : '5MB'}
                            </p>
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
                        {error}
                    </div>
                )}
            </div>
        );
    }
);

ImageUpload.displayName = 'ImageUpload';