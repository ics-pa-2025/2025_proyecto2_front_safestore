'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { RequestProductDto } from '../../../dto/product/request-product.dto.ts';
import type { ResponseBrandDto } from '../../../dto/brands/response-brand.dto.ts';
import type { ResponseLineDto } from '../../../dto/line/response-line.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { brandsService } from '../../../services/brands.service.ts';
import { lineService } from '../../../services/line.service.ts';

export function ProductForm() {
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

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            brandId: 0,
            lineId: 0,
        });
        setErrors({});
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
                    <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-slate-200 border-t-blue-500"></div>
                    <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-slate-600 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="product-form"
                            disabled={loading}
                            className="bg-blue-600 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre del producto"
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Marca */}
                            <div>
                                <label htmlFor="brandId" className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                    Marca <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="brandId"
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={0}>Seleccionar marca</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.brandId}</p>
                                )}
                            </div>

                            {/* Precio */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
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
                                    placeholder="0.00"
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.price}</p>
                                )}
                            </div>

                            {/* Línea */}
                            <div>
                                <label htmlFor="lineId" className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                    Línea <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="lineId"
                                    name="lineId"
                                    value={formData.lineId}
                                    onChange={handleChange}
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={0}>Seleccionar línea</option>
                                    {lines.map((line) => (
                                        <option key={line.id} value={line.id}>
                                            {line.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.lineId && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.lineId}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0"
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descripción opcional"
                                    rows={3}
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
