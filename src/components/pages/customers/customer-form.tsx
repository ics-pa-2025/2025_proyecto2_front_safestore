'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { customerService } from '../../../services/customer.service.ts';
import type { RequestCustomerDto } from '../../../dto/customer/request-customer.dto.ts';
import { formStyles } from '../../common/FormStyles.tsx';

interface CustomerFormData {
    name: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    documento: string;
}

export function CustomerForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const customerId = searchParams.get('id');
    const isEditing = Boolean(customerId);
    
    const [formData, setFormData] = useState<CustomerFormData>({
        name: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        documento: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditing && customerId) {
            loadCustomer(customerId);
        }
    }, [isEditing, customerId]);

    const loadCustomer = async (id: string) => {
        try {
            setLoading(true);
            const customers = await customerService.get();
            const customer = customers.find((c) => c.id === parseInt(id));
            if (customer) {
                setFormData({
                    name: customer.name,
                    lastName: customer.lastName,
                    email: customer.email,
                    address: customer.address,
                    phone: customer.phone,
                    documento: customer.documento.toString(),
                });
            }
        } catch (error) {
            console.error('Error loading customer:', error);
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

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is not valid';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (formData.address.length < 5) {
            newErrors.address = 'Address must be at least 5 characters';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (formData.phone.length < 8) {
            newErrors.phone = 'Phone must be at least 8 characters';
        }

        if (!formData.documento.trim()) {
            newErrors.documento = 'Document is required';
        } else if (!/^\d{8}$/.test(formData.documento)) {
            newErrors.documento = 'Document must have exactly 8 digits';
        } else {
            const doc = parseInt(formData.documento);
            if (doc < 10000000 || doc > 99999999) {
                newErrors.documento = 'Document must be between 10000000 and 99999999';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
            const customerData: RequestCustomerDto = {
                name: formData.name.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                phone: formData.phone.trim(),
                documento: parseInt(formData.documento),
            };

            if (isEditing && customerId) {
                await customerService.update(customerId, customerData);
            } else {
                await customerService.create(customerData);
            }
            navigate('/customers');
        } catch (error) {
            console.error('Error saving customer:', error);
            
            let errorMessage = 'Error saving customer. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('email')) {
                    errorMessage = 'A customer with this email already exists.';
                } else if (error.message.includes('documento')) {
                    errorMessage = 'A customer with this document already exists.';
                }
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/customers');
    };

    if (loading && isEditing) {
        return (
            <div className={formStyles.loadingContainer}>
                <div className={formStyles.loadingContent}>
                    <div className={formStyles.loadingSpinner}></div>
                    <p className={formStyles.loadingText}>Loading customer...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        {isEditing ? 'Edit Customer' : 'New Customer'}
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
                            form="customer-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form
                        id="customer-form"
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
                                    placeholder="Enter customer name"
                                />
                                {errors.name && (
                                    <p className={formStyles.errorMessage}>{errors.name}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="lastName" className={formStyles.label}>
                                    Last Name <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Enter customer last name"
                                />
                                {errors.lastName && (
                                    <p className={formStyles.errorMessage}>{errors.lastName}</p>
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
                                    placeholder="Enter customer email"
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
                                    placeholder="Enter customer phone"
                                />
                                {errors.phone && (
                                    <p className={formStyles.errorMessage}>{errors.phone}</p>
                                )}
                            </div>

                            {/* Document */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="documento" className={formStyles.label}>
                                    Document <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="documento"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Enter customer document (8 digits)"
                                    maxLength={8}
                                />
                                {errors.documento && (
                                    <p className={formStyles.errorMessage}>{errors.documento}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className={`${formStyles.fieldWrapper} ${formStyles.fullWidthField}`}>
                                <label htmlFor="address" className={formStyles.label}>
                                    Address <span className={formStyles.required}>*</span>
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={formStyles.textarea}
                                    placeholder="Enter customer address"
                                    rows={3}
                                />
                                {errors.address && (
                                    <p className={formStyles.errorMessage}>{errors.address}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}