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
            console.error('Error cargando cliente:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.length < 2) {
            newErrors.name = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es requerida';
        } else if (formData.address.length < 5) {
            newErrors.address = 'La dirección debe tener al menos 5 caracteres';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (formData.phone.length < 8) {
            newErrors.phone = 'El teléfono debe tener al menos 8 caracteres';
        }

        if (!formData.documento.trim()) {
            newErrors.documento = 'El documento es requerido';
        } else if (!/^\d{8}$/.test(formData.documento)) {
            newErrors.documento = 'El documento debe tener exactamente 8 dígitos';
        } else {
            const doc = parseInt(formData.documento);
            if (doc < 10000000 || doc > 99999999) {
                newErrors.documento = 'El documento debe estar entre 10000000 y 99999999';
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
            console.error('Error guardando cliente:', error);
            
            let errorMessage = 'Error al guardar el cliente. Por favor intente nuevamente.';
            
            if (error instanceof Error) {
                if (error.message.includes('email')) {
                    errorMessage = 'Ya existe un cliente con este email.';
                } else if (error.message.includes('documento')) {
                    errorMessage = 'Ya existe un cliente con este documento.';
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
                    <p className={formStyles.loadingText}>Cargando cliente...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h1>
                    <div className={formStyles.buttonContainer}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={formStyles.cancelButton}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="customer-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
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
                            {/* Nombre */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="name" className={formStyles.label}>
                                    Nombre <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Ingrese el nombre del cliente"
                                />
                                {errors.name && (
                                    <p className={formStyles.errorMessage}>{errors.name}</p>
                                )}
                            </div>

                            {/* Apellido */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="lastName" className={formStyles.label}>
                                    Apellido <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Ingrese el apellido del cliente"
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
                                    placeholder="Ingrese el email del cliente"
                                />
                                {errors.email && (
                                    <p className={formStyles.errorMessage}>{errors.email}</p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="phone" className={formStyles.label}>
                                    Teléfono <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Ingrese el teléfono del cliente"
                                />
                                {errors.phone && (
                                    <p className={formStyles.errorMessage}>{errors.phone}</p>
                                )}
                            </div>

                            {/* Documento */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="documento" className={formStyles.label}>
                                    Documento <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="documento"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Ingrese el documento del cliente (8 dígitos)"
                                    maxLength={8}
                                />
                                {errors.documento && (
                                    <p className={formStyles.errorMessage}>{errors.documento}</p>
                                )}
                            </div>

                            {/* Dirección */}
                            <div className={`${formStyles.fieldWrapper} ${formStyles.fullWidthField}`}>
                                <label htmlFor="address" className={formStyles.label}>
                                    Dirección <span className={formStyles.required}>*</span>
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={formStyles.textarea}
                                    placeholder="Ingrese la dirección del cliente"
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