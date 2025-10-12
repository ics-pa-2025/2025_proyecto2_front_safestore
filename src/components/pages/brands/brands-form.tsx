'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { brandsService } from '../../../services/brands.service';
import { RequestBrandDto } from '../../../dto/brands/request-brand.dto';

export function BrandsForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const brandId = searchParams.get('id');
    const isEditing = Boolean(brandId);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && brandId) {
            loadBrand(brandId);
        }
    }, [isEditing, brandId]);

    const loadBrand = async (id: string) => {
        try {
            setLoading(true);
            const brands = await brandsService.get();
            const brand = brands.find((b) => b.id === parseInt(id));
            if (brand) {
                setFormData({
                    name: brand.name,
                    description: brand.description || '',
                    logo: brand.logo || '',
                    isActive: brand.isActive,
                });
            }
        } catch (err) {
            setError('Error al cargar la marca');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const brandDto = new RequestBrandDto(
                formData.name,
                formData.description,
                formData.logo,
                formData.isActive
            );

            if (isEditing && brandId) {
                await brandsService.update(brandId, brandDto);
            } else {
                await brandsService.create(brandDto);
            }

            navigate('/brands');
        } catch (err) {
            setError(
                isEditing
                    ? 'Error al actualizar la marca'
                    : 'Error al crear la marca'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/brands');
    };

    if (loading && isEditing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEditing ? 'Editar Marca' : 'Crear Nueva Marca'}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Nombre *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingresa el nombre de la marca"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            placeholder="Descripción opcional de la marca"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="logo"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            URL del Logo
                        </label>
                        <input
                            type="url"
                            id="logo"
                            name="logo"
                            value={formData.logo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/logo.png"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="isActive"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Marca activa
                        </label>
                    </div>

                    <div className="flex space-x-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading
                                ? 'Guardando...'
                                : isEditing
                                  ? 'Actualizar'
                                  : 'Crear'}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
