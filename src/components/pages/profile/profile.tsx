'use client';

import { useState } from 'react';
import { profileService } from '../../../services/profile.service.ts';

export function Profile() {
    const user = profileService.getUser();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileService.update(user.id, formData).then(() => {
            alert('Cambios guardados correctamente.');
        });
    };

    return (
        <div className="profile-container container mt-5">
            <div className="profile-header mb-4">
                <h1 className="fw-bold">Mi Perfil</h1>
                <p className="text-muted">
                    Actualiza tu información personal y de contacto
                </p>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h5 className="fw-semibold mb-3">Información Personal</h5>
                    <p className="text-muted small mb-4">
                        Actualiza tu información de contacto y perfil
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="form-control"
                                required={true}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className="form-control"
                                disabled={true}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                Dirección de Envío
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary text-white w-100"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
