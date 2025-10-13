'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { RequestProductDto } from '../../../dto/product/request-product.dto.ts';
import type { ResponseProductDto } from '../../../dto/product/response-product.dto.ts';
import type { ResponseBrandDto } from '../../../dto/brands/response-brand.dto.ts';
import type { ResponseLineDto } from '../../../dto/line/response-line.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { brandsService } from '../../../services/brands.service.ts';
import { lineService } from '../../../services/line.service.ts';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: ResponseProductDto | null;
}

export function ProductForm({
    isOpen,
    onClose,
    onSuccess,
    productToEdit,
}: ProductFormProps) {
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
        if (isOpen) {
            loadBrands();
            loadLines();

            if (productToEdit) {
                setFormData({
                    name: productToEdit.name,
                    description: productToEdit.description || '',
                    price: productToEdit.price,
                    stock: productToEdit.stock,
                    brandId: productToEdit.brandId,
                    lineId: productToEdit.lineId,
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, productToEdit]);

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
            if (productToEdit) {
                await productService.update(
                    productToEdit.id.toString(),
                    formData
                );
            } else {
                await productService.create(formData);
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error guardando producto:', error);
            alert(
                'Error al guardar el producto. Por favor intente nuevamente.'
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
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
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
                        {/* Nombre */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                }`}
                                placeholder="Ingrese el nombre del producto"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingrese una descripción (opcional)"
                            />
                        </div>

                        {/* Marca y Línea */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="brandId"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Marca{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="brandId"
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.brandId
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    <option value={0}>
                                        Seleccione una marca
                                    </option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.brandId}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="lineId"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Línea{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="lineId"
                                    name="lineId"
                                    value={formData.lineId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.lineId
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    <option value={0}>
                                        Seleccione una línea
                                    </option>
                                    {lines.map((line) => (
                                        <option key={line.id} value={line.id}>
                                            {line.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.lineId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.lineId}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Precio y Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Precio{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.price
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="stock"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Stock{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.stock
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                />
                                {errors.stock && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.stock}
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
                                : productToEdit
                                  ? 'Actualizar'
                                  : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
