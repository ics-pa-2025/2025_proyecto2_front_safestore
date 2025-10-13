'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { ResponseUserDto } from '../../../dto/user/response-user.dto.ts';
import type { UpdateUserDto } from '../../../dto/user/update-user.dto.ts';
import { userService } from '../../../services/user.service.ts';
import { rolesService } from '../../../services/role.service.ts';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userToEdit?: ResponseUserDto | null;
}

interface UserFormData {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
    roleId?: string;
}

export function UserForm({
                             isOpen,
                             onClose,
                             onSuccess,
                             userToEdit,
                         }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        password: '',
        fullname: '',
        phone: '',
        address: '',
        roleId: '',
    });

    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            loadRoles();

            if (userToEdit) {
                setFormData({
                    email: userToEdit.email,
                    password: '',
                    fullname: userToEdit.fullname || '',
                    phone: userToEdit.phone || '',
                    address: userToEdit.address || '',
                    roleId: userToEdit.rolesId?.[0] || '',
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, userToEdit]);

    const loadRoles = async () => {
        try {
            const data = await rolesService.get();
            setRoles(data);
        } catch (error) {
            console.error('Error cargando roles:', error);
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

        if (!userToEdit && !formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!userToEdit && formData.password.length < 6) {
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
            if (userToEdit) {
                const updateData: UpdateUserDto = {
                    fullname: formData.fullname,
                    phone: formData.phone,
                    address: formData.address,
                };
                await userService.update(userToEdit.id, updateData);
            } else {
                await userService.create(
                        formData.email,
                        formData.password,
                        formData.fullname,
                        formData.phone,
                        formData.address
                );
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error guardando usuario:', error);
            alert(
                    'Error al guardar el usuario. Por favor intente nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={loading}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!!userToEdit}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.email
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                        } ${userToEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="correo@ejemplo.com"
                                />
                                {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                )}
                            </div>

                            {/* Password - Solo para nuevo usuario */}
                            {!userToEdit && (
                                    <div>
                                        <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Contraseña <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                        errors.password
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                }`}
                                                placeholder="Mínimo 6 caracteres"
                                        />
                                        {errors.password && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.password}
                                                </p>
                                        )}
                                    </div>
                            )}

                            {/* Nombre Completo */}
                            <div>
                                <label
                                        htmlFor="fullname"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nombre Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                        type="text"
                                        id="fullname"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.fullname
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                        }`}
                                        placeholder="Ingrese el nombre completo"
                                />
                                {errors.fullname && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fullname}
                                        </p>
                                )}
                            </div>

                            {/* Teléfono y Dirección */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Teléfono <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.phone
                                                            ? 'border-red-500'
                                                            : 'border-gray-300'
                                            }`}
                                            placeholder="+54 351 123 4567"
                                    />
                                    {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.phone}
                                            </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Dirección <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.address
                                                            ? 'border-red-500'
                                                            : 'border-gray-300'
                                            }`}
                                            placeholder="Calle, número, ciudad"
                                    />
                                    {errors.address && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.address}
                                            </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                            <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    disabled={loading}
                            >
                                {loading
                                        ? 'Guardando...'
                                        : userToEdit
                                                ? 'Actualizar'
                                                : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
}