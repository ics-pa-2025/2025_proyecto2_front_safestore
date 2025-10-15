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
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                        <h1 className="text-xl font-semibold text-slate-800">
                            {isEditing ? 'Editar Marca' : 'Crear Nueva Marca'}
                        </h1>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Nombre e Estado */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    placeholder="Nombre de la marca"
                                />
                            </div>
                            
                            <div className="flex items-end">
                                <div className="flex items-center h-10">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="ml-2 block text-sm text-slate-700 font-medium">
                                        Marca activa
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                                placeholder="Descripción opcional de la marca"
                            />
                        </div>

                        {/* URL del Logo */}
                        <div>
                            <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-1">
                                URL del Logo
                            </label>
                            <input
                                type="url"
                                id="logo"
                                name="logo"
                                value={formData.logo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                placeholder="https://ejemplo.com/logo.png"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
