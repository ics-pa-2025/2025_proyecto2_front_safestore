'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { RequestProductDto } from '../../../dto/product/request-product.dto.ts';
import type { ResponseBrandDto } from '../../../dto/brands/response-brand.dto.ts';
import type { ResponseLineDto } from '../../../dto/line/response-line.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { brandsService } from '../../../services/brands.service.ts';
import { lineService } from '../../../services/line.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';

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
            <div className={formStyles.loadingContainer}>
                <div className={formStyles.loadingContent}>
                    <div className={formStyles.loadingSpinner}></div>
                    <p className={formStyles.loadingText}>Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={formStyles.pageContainer}>
                <div className={formStyles.header}>
                    <h1 className={formStyles.title}>
                        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
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
                            form="product-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form id="product-form" onSubmit={handleSubmit} className={formStyles.form}>
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
                                    placeholder="Nombre del producto"
                                    className={formStyles.input}
                                />
                                {errors.name && (
                                    <p className={formStyles.errorMessage}>{errors.name}</p>
                                )}
                            </div>

                            {/* Marca */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="brandId" className={formStyles.label}>
                                    Marca <span className={formStyles.required}>*</span>
                                </label>
                                <select
                                    id="brandId"
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    className={formStyles.select}
                                >
                                    <option value={0}>Seleccionar marca</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && (
                                    <p className={formStyles.errorMessage}>{errors.brandId}</p>
                                )}
                            </div>

                            {/* Precio */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="price" className={formStyles.label}>
                                    Precio <span className={formStyles.required}>*</span>
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
                                    className={formStyles.input}
                                />
                                {errors.price && (
                                    <p className={formStyles.errorMessage}>{errors.price}</p>
                                )}
                            </div>

                            {/* Línea */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="lineId" className={formStyles.label}>
                                    Línea <span className={formStyles.required}>*</span>
                                </label>
                                <select
                                    id="lineId"
                                    name="lineId"
                                    value={formData.lineId}
                                    onChange={handleChange}
                                    className={formStyles.select}
                                >
                                    <option value={0}>Seleccionar línea</option>
                                    {lines.map((line) => (
                                        <option key={line.id} value={line.id}>
                                            {line.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.lineId && (
                                    <p className={formStyles.errorMessage}>{errors.lineId}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="stock" className={formStyles.label}>
                                    Stock <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0"
                                    className={formStyles.input}
                                />
                                {errors.stock && (
                                    <p className={formStyles.errorMessage}>{errors.stock}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className={formStyles.fullWidthField}>
                                <label htmlFor="description" className={formStyles.label}>
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descripción opcional"
                                    rows={3}
                                    className={formStyles.textarea}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
