'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { RequestProductDto } from '../../../dto/product/request-product.dto.ts';
import type { ResponseProductDto } from '../../../dto/product/response-product.dto.ts';
import type { ResponseBrandDto } from '../../../dto/brands/response-brand.dto.ts';
import type { ResponseLineDto } from '../../../dto/line/response-line.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { brandsService } from '../../../services/brands.service.ts';
import { lineService } from '../../../services/line.service.ts';

export function ProductFormPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('id');
    const isEditing = Boolean(productId);

    const [formData, setFormData] = useState<RequestProductDto>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        brandId: 0,
        lineId: 0,
    });

    const [brands, setBrands] = useState<ResponseBrandDto[]>([]);
    const [lines, setLines] = useState<ResponseLineDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadBrands();
        loadLines();

        if (isEditing && productId) {
            loadProduct(productId);
        }
    }, [isEditing, productId]);

    const loadProduct = async (id: string) => {
        try {
            setLoading(true);
            const products = await productService.get();
            const product = products.find((p) => p.id === parseInt(id));
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    stock: product.stock,
                    brandId: product.brandId,
                    lineId: product.lineId,
                });
            }
        } catch (error) {
            console.error('Error cargando producto:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBrands = async () => {
        try {
            const data = await brandsService.get();
            setBrands(data);
        } catch (error) {
            console.error('Error cargando marcas:', error);
        }
    };

    const loadLines = async () => {
        try {
            const data = await lineService.get();
            setLines(data);
        } catch (error) {
            console.error('Error cargando líneas:', error);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (formData.price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }

        if (formData.stock < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
        }

        if (!formData.brandId || formData.brandId === 0) {
            newErrors.brandId = 'Debe seleccionar una marca';
        }

        if (!formData.lineId || formData.lineId === 0) {
            newErrors.lineId = 'Debe seleccionar una línea';
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
            [name]:
                name === 'price' ||
                name === 'stock' ||
                name === 'brandId' ||
                name === 'lineId'
                    ? Number(value)
                    : value,
        }));

        // Limpiar error del campo cuando el usuario empieza a escribir
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
            if (isEditing && productId) {
                await productService.update(productId, formData);
            } else {
                await productService.create(formData);
            }
            navigate('/products');
        } catch (error) {
            console.error('Error guardando producto:', error);
            alert(
                'Error al guardar el producto. Por favor intente nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/products');
    };

    if (loading && isEditing) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500"></div>
                    <p className="mt-4 text-slate-600 font-medium">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl border border-slate-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-3 border-b border-slate-100 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCancel}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-lg font-medium text-slate-700">
                            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                        </h1>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                    placeholder="Nombre del producto"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Marca */}
                            <div>
                                <label htmlFor="brandId" className="block text-sm font-medium text-slate-600 mb-1">
                                    Marca <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="brandId"
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.brandId ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <option value={0}>Seleccionar marca</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.brandId}</p>
                                )}
                            </div>

                            {/* Precio */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-600 mb-1">
                                    Precio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.price ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            {/* Descripción */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors"
                                    placeholder="Descripción opcional"
                                />
                            </div>

                            {/* Línea */}
                            <div>
                                <label htmlFor="lineId" className="block text-sm font-medium text-slate-600 mb-1">
                                    Línea <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="lineId"
                                    name="lineId"
                                    value={formData.lineId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.lineId ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <option value={0}>Seleccionar línea</option>
                                    {lines.map((line) => (
                                        <option key={line.id} value={line.id}>
                                            {line.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.lineId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.lineId}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-slate-600 mb-1">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.stock ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                    placeholder="0"
                                />
                                {errors.stock && (
                                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}