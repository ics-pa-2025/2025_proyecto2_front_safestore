'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { RequestSupplierDto } from '../../../dto/supplier/request-supplier.dto.ts';
import { supplierService } from '../../../services/supplier.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';

interface SupplierFormData {
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
}

export function SupplierForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const supplierId = searchParams.get('id');
    const isEditing = Boolean(supplierId);
    
    // Detectar si viene de un selector
    const isFromSelector = localStorage.getItem('returnFromEntityCreation') === 'true';
    const returnPath = localStorage.getItem('returnPath');
    
    const [formData, setFormData] = useState<SupplierFormData>({
        name: '',
        email: '',
        phone: '',
        isActive: true,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditing && supplierId) {
            loadSupplier(supplierId);
        }
    }, [isEditing, supplierId]);

    const loadSupplier = async (id: string) => {
        try {
            setLoading(true);
            const suppliers = await supplierService.get();
            const supplier = suppliers.find((s) => s.id === parseInt(id));
            if (supplier) {
                setFormData({
                    name: supplier.name,
                    email: supplier.email,
                    phone: supplier.phone,
                    isActive: supplier.isActive,
                });
            }
        } catch (error) {
            console.error('Error loading supplier:', error);
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
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is not valid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (formData.phone.length < 8) {
            newErrors.phone = 'Phone must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
            const supplierData: RequestSupplierDto = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                isActive: formData.isActive,
            };

            if (isEditing && supplierId) {
                await supplierService.update(supplierId, supplierData);
            } else {
                await supplierService.create(supplierData);
            }
            
            if (isFromSelector && returnPath) {
                // If coming from a selector, return to original form
                navigate(returnPath);
            } else {
                // Normal navigation
                navigate('/suppliers');
            }
        } catch (error) {
            console.error('Error saving supplier:', error);
            
            let errorMessage = 'Error saving supplier. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('email')) {
                    errorMessage = 'A supplier with this email already exists.';
                } else if (error.message.includes('name')) {
                    errorMessage = 'A supplier with this name already exists.';
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
            navigate('/suppliers');
        }
    };

    if (loading && isEditing) {
        return (
            <div className={formStyles.loadingContainer}>
                <div className={formStyles.loadingContent}>
                    <div className={formStyles.loadingSpinner}></div>
                    <p className={formStyles.loadingText}>Loading supplier...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        {isEditing ? 'Edit Supplier' : 'New Supplier'}
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
                            form="supplier-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form
                        id="supplier-form"
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
                                    placeholder="Enter supplier name"
                                />
                                {errors.name && (
                                    <p className={formStyles.errorMessage}>{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="email" className={formStyles.label}>
                                    Email <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Enter supplier email"
                                />
                                {errors.email && (
                                    <p className={formStyles.errorMessage}>{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="phone" className={formStyles.label}>
                                    Phone <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Enter supplier phone"
                                />
                                {errors.phone && (
                                    <p className={formStyles.errorMessage}>{errors.phone}</p>
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}