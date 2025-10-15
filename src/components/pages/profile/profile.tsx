'use client';

import { useState } from 'react';
import { profileService } from '../../../services/profile.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';

export function Profile() {
    const user = profileService.getUser();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: user.fullname,
        phone: user.phone,
        address: user.address,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await profileService.update(user.id, formData);
            alert('Cambios guardados correctamente.');
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error al guardar los cambios. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullname: user.fullname,
            phone: user.phone,
            address: user.address,
        });
    };

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        Mi Perfil
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
                            form="profile-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form id="profile-form" onSubmit={handleSubmit} className={formStyles.form}>
                        <div className={formStyles.fieldGrid}>
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
                                    placeholder="Tu nombre completo"
                                    className={formStyles.input}
                                    required
                                />
                            </div>

                            {/* Correo Electrónico */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="email" className={formStyles.label}>
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    className={formStyles.disabledInput}
                                    disabled
                                />
                            </div>

                            {/* Teléfono */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="phone" className={formStyles.label}>
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Tu número de teléfono"
                                    className={formStyles.input}
                                />
                            </div>

                            {/* Dirección de Envío */}
                            <div className={formStyles.fullWidthField}>
                                <label htmlFor="address" className={formStyles.label}>
                                    Dirección de Envío
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Tu dirección completa"
                                    className={formStyles.input}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
