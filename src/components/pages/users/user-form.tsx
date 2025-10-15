'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ResponseUserDto } from '../../../dto/user/response-user.dto.ts';
import type { UpdateUserDto } from '../../../dto/user/update-user.dto.ts';
import { userService } from '../../../services/user.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';

interface UserFormData {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
    roleId?: string;
}

export function UserForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const isEditing = Boolean(userId);
    
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        password: '',
        fullname: '',
        phone: '',
        address: '',
        roleId: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditing && userId) {
            loadUser(userId);
        }
    }, [isEditing, userId]);

    const loadUser = async (id: string) => {
        try {
            setLoading(true);
            const users = await userService.get();
            const user = users.find((u) => u.id === id);
            if (user) {
                setFormData({
                    email: user.email,
                    password: '',
                    fullname: user.fullname || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    roleId: user.rolesId?.[0] || '',
                });
            }
        } catch (error) {
            console.error('Error cargando usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            fullname: '',
            phone: '',
            address: '',
            roleId: '',
        });
        setErrors({});
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!isEditing && !formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!isEditing && formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.fullname.trim()) {
            newErrors.fullname = 'El nombre completo es requerido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
            e: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
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
            if (isEditing && userId) {
                const updateData: UpdateUserDto = {
                    fullname: formData.fullname,
                    phone: formData.phone,
                    address: formData.address,
                };
                await userService.update(userId, updateData);
            } else {
                await userService.create(
                    formData.email,
                    formData.password,
                    formData.fullname,
                    formData.phone,
                    formData.address
                );
            }
            navigate('/users');
        } catch (error) {
            console.error('Error guardando usuario:', error);
            
            // Manejar diferentes tipos de errores
            let errorMessage = 'Error al guardar el usuario. Por favor intente nuevamente.';
            
            if (error instanceof Error) {
                // Si el error contiene información específica sobre email duplicado, etc.
                if (error.message.includes('email')) {
                    errorMessage = 'Ya existe un usuario con este email.';
                } else if (error.message.includes('phone')) {
                    errorMessage = 'Ya existe un usuario con este teléfono.';
                }
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    if (loading && isEditing) {
        return (
            <div className={formStyles.loadingContainer}>
                <div className={formStyles.loadingContent}>
                    <div className={formStyles.loadingSpinner}></div>
                    <p className={formStyles.loadingText}>Cargando usuario...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                            form="user-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form id="user-form" onSubmit={handleSubmit} className={formStyles.form}>
                        <div className={formStyles.fieldGrid}>
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
                                    disabled={isEditing}
                                    className={isEditing ? formStyles.disabledInput : formStyles.input}
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && (
                                    <p className={formStyles.errorMessage}>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Nombre Completo */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="fullname" className={formStyles.label}>
                                    Nombre Completo <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Ingrese el nombre completo"
                                />
                                {errors.fullname && (
                                    <p className={formStyles.errorMessage}>
                                        {errors.fullname}
                                    </p>
                                )}
                            </div>

                            {/* Password - Solo para nuevo usuario */}
                            {!isEditing && (
                                <div className={formStyles.fieldWrapper}>
                                    <label htmlFor="password" className={formStyles.label}>
                                        Contraseña <span className={formStyles.required}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={formStyles.input}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    {errors.password && (
                                        <p className={formStyles.errorMessage}>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            )}

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
                                    placeholder="+54 351 123 4567"
                                />
                                {errors.phone && (
                                    <p className={formStyles.errorMessage}>
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Dirección */}
                            <div className={formStyles.fullWidthField}>
                                <label htmlFor="address" className={formStyles.label}>
                                    Dirección <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={formStyles.input}
                                    placeholder="Calle, número, ciudad"
                                />
                                {errors.address && (
                                    <p className={formStyles.errorMessage}>
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}