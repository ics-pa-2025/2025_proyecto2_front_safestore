'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { RequestLineDto } from '../../../dto/line/request-line.dto.ts';
import { lineService } from '../../../services/line.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';

interface LineFormData {
    name: string;
    description: string;
    isActive: boolean;
}

export function LineForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lineId = searchParams.get('id');
    const isEditing = Boolean(lineId);
    
    // Detectar si viene de un selector
    const isFromSelector = localStorage.getItem('returnFromEntityCreation') === 'true';
    const returnPath = localStorage.getItem('returnPath');
    
    const [formData, setFormData] = useState<LineFormData>({
        name: '',
        description: '',
        isActive: true,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditing && lineId) {
            loadLine(lineId);
        }
    }, [isEditing, lineId]);

    const loadLine = async (id: string) => {
        try {
            setLoading(true);
            const lines = await lineService.get();
            const line = lines.find((l) => l.id === parseInt(id));
            if (line) {
                setFormData({
                    name: line.name,
                    description: line.description || '',
                    isActive: line.isActive,
                });
            }
        } catch (error) {
            console.error('Error loading line:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name cannot exceed 100 characters';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        setFormData((prev) => ({
            ...prev,
            [name]: finalValue,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const lineData: RequestLineDto = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                isActive: formData.isActive,
            };

            if (isEditing && lineId) {
                await lineService.update(lineId, lineData);
            } else {
                await lineService.create(lineData);
            }
            
            if (isFromSelector && returnPath) {
                // If coming from a selector, return to original form
                navigate(returnPath);
            } else {
                // Normal navigation
                navigate('/lines');
            }
        } catch (error) {
            console.error('Error saving line:', error);
            
            let errorMessage = 'Error saving line. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('name')) {
                    errorMessage = 'A line with this name already exists.';
                }
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (isFromSelector && returnPath) {
            // If coming from a selector, return to original form without creating
            localStorage.removeItem('returnFromEntityCreation');
            localStorage.removeItem('returnPath');
            navigate(returnPath);
        } else {
            // Normal navigation
            navigate('/lines');
        }
    };

    if (loading && isEditing) {
        return (
            <div className={formStyles.loadingContainer}>
                <div className={formStyles.loadingContent}>
                    <div className={formStyles.loadingSpinner}></div>
                    <p className={formStyles.loadingText}>Loading line...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        {isEditing ? 'Edit Line' : 'New Line'}
                    </h1>
                    <div className={formStyles.buttonContainer}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={formStyles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="line-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form
                        id="line-form"
                        onSubmit={handleSubmit}
                        className={formStyles.form}
                    >
                        <div className={formStyles.fieldGrid}>
                            {/* Name */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="name" className={formStyles.label}>
                                    Name <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Enter line name"
                                />
                                {errors.name && (
                                    <p className={formStyles.errorMessage}>{errors.name}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="isActive" className={formStyles.label}>
                                    Status
                                </label>
                                <select
                                    id="isActive"
                                    name="isActive"
                                    value={formData.isActive.toString()}
                                    onChange={(e) => handleChange({
                                        ...e,
                                        target: {
                                            ...e.target,
                                            name: 'isActive',
                                            value: e.target.value === 'true'
                                        }
                                    } as any)}
                                    className={formStyles.select}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className={`${formStyles.fieldWrapper} ${formStyles.fullWidthField}`}>
                                <label htmlFor="description" className={formStyles.label}>
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={formStyles.textarea}
                                    placeholder="Enter optional description"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className={formStyles.errorMessage}>{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}