'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { RequestProductDto } from '../../../dto/product/request-product.dto.ts';
import type { ResponseBrandDto } from '../../../dto/brands/response-brand.dto.ts';
import type { ResponseLineDto } from '../../../dto/line/response-line.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { brandsService } from '../../../services/brands.service.ts';
import { lineService } from '../../../services/line.service.ts';
import { formStyles } from '../../common/FormStyles.tsx';
import { EntitySelector, useEntitySelector } from '../../common/EntitySelector.tsx';
import { ImageUpload, type ImageUploadRef } from '../../common/ImageUpload';
import type { ResponseSupplierDto } from '../../../dto/supplier/response-supplier.dto.ts';
import { supplierService } from '../../../services/supplier.service.ts';

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
        imageUrl: '',
        suppliers: [],
    });

    const [brands, setBrands] = useState<ResponseBrandDto[]>([]);
    const [lines, setLines] = useState<ResponseLineDto[]>([]);
    const [suppliers, setSuppliers] = useState<ResponseSupplierDto[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { reloadData } = useEntitySelector();
    const imageUploadRef = useRef<ImageUploadRef>(null);

    useEffect(() => {
        loadBrands();
        loadLines();
        loadSuppliers();
        if (isEditing && productId) {
            loadProduct(productId);
        }
    }, [isEditing, productId]);

    const loadSuppliers = async () => {
        try {
            const data = await supplierService.get();
            setSuppliers(data);
        }
        catch (error) {
            console.error('Error loading suppliers:', error);
        }
    };

    // Function to reload suppliers after creating a new one
    const handleReloadSuppliers = async () => {
        await reloadData(supplierService.get, setSuppliers);
    };

    const loadProduct = async (id: string) => {
        try {
            setLoading(true);
            const products = await productService.get();
            const product = products.find((p) => p.id === parseInt(id));
            if (product) {
                const supplierIds = product.suppliers?.map(s => s.id) || [];
                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    stock: product.stock,
                    brandId: product.brandId,
                    lineId: product.lineId,
                    imageUrl: product.imageUrl || '',
                    suppliers: supplierIds,
                });
                setSelectedSuppliers(supplierIds);
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBrands = async () => {
        try {
            const data = await brandsService.get();
            setBrands(data);
        } catch (error) {
            console.error('Error loading brands:', error);
        }
    };

    const loadLines = async () => {
        try {
            const data = await lineService.get();
            setLines(data);
        } catch (error) {
            console.error('Error loading lines:', error);
        }
    };

    // Functions to reload data after creating new entities
    const handleReloadBrands = async () => {
        await reloadData(brandsService.get, setBrands);
    };

    const handleReloadLines = async () => {
        await reloadData(lineService.get, setLines);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (formData.stock < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }

        if (!formData.brandId || formData.brandId === 0) {
            newErrors.brandId = 'Must select a brand';
        }

        if (!formData.lineId || formData.lineId === 0) {
            newErrors.lineId = 'Must select a line';
        }

        if (!selectedSuppliers || selectedSuppliers.length === 0) {
            newErrors.suppliers = 'Must select at least one supplier';
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

        // Clear field error when user starts typing
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
            const imageFile = imageUploadRef.current?.getFile();
            
            // Prepare form data with suppliers
            const productData = {
                ...formData,
                suppliers: selectedSuppliers,
            };
            
            if (isEditing && productId) {
                await productService.update(productId, productData, imageFile || undefined);
            } else {
                await productService.create(productData, imageFile || undefined);
            }
            
            // Verificar si viene de un selector
            const currentIsFromSelector = localStorage.getItem('returnFromEntityCreation') === 'true';
            const currentReturnPath = localStorage.getItem('returnPath');
            
            if (currentIsFromSelector && currentReturnPath) {
                // Si viene de un selector, regresar al formulario original
                localStorage.removeItem('returnFromEntityCreation');
                localStorage.removeItem('returnPath');
                navigate(currentReturnPath);
            } else {
                // Navegación normal
                navigate('/products');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert(
                'Error saving product. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Verificar si viene de un selector
        const currentIsFromSelector = localStorage.getItem('returnFromEntityCreation') === 'true';
        const currentReturnPath = localStorage.getItem('returnPath');
        
        if (currentIsFromSelector && currentReturnPath) {
            // If coming from a selector, return to original form without creating
            localStorage.removeItem('returnFromEntityCreation');
            localStorage.removeItem('returnPath');
            navigate(currentReturnPath);
        } else {
            // Navegación normal
            navigate('/products');
        }
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
                        {isEditing ? 'Edit Product' : 'New Product'}
                    </h1>
                    <div className={formStyles.buttonContainer}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={formStyles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="product-form"
                            disabled={loading}
                            className={formStyles.submitButton}
                        >
                            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>

                <div className={formStyles.formContainer}>
                    <form id="product-form" onSubmit={handleSubmit} className={formStyles.form}>
                        <div className={formStyles.fieldGrid}>
                            {/* Name */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="name" className={formStyles.label}>
                                    Name <span className={formStyles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Product name"
                                    className={formStyles.input}
                                />
                                {errors.name && (
                                    <p className={formStyles.errorMessage}>{errors.name}</p>
                                )}
                            </div>

                            {/* Brand */}
                            <EntitySelector
                                options={brands}
                                value={formData.brandId}
                                onChange={(value: number) => {
                                    setFormData(prev => ({ ...prev, brandId: value }));
                                    if (errors.brandId) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.brandId;
                                            return newErrors;
                                        });
                                    }
                                }}
                                entityName="brand"
                                entityNamePlural="brands"
                                createRoute="/brands-form"
                                label="Brand"
                                required
                                error={errors.brandId}
                                onReload={handleReloadBrands}
                                filterFn={(option: ResponseBrandDto) => option.isActive !== false}
                            />

                            {/* Price */}
                            <div className={formStyles.fieldWrapper}>
                                <label htmlFor="price" className={formStyles.label}>
                                    Price <span className={formStyles.required}>*</span>
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

                            {/* Line */}
                            <EntitySelector
                                options={lines}
                                value={formData.lineId}
                                onChange={(value: number) => {
                                    setFormData(prev => ({ ...prev, lineId: value }));
                                    if (errors.lineId) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.lineId;
                                            return newErrors;
                                        });
                                    }
                                }}
                                entityName="line"
                                entityNamePlural="lines"
                                createRoute="/line-form"
                                label="Line"
                                required
                                error={errors.lineId}
                                onReload={handleReloadLines}
                                filterFn={(option: ResponseLineDto) => option.isActive !== false}
                            />

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

                            {/* Description */}
                            <div className={formStyles.fullWidthField}>
                                <label htmlFor="description" className={formStyles.label}>
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Optional description"
                                    rows={3}
                                    className={formStyles.textarea}
                                />
                            </div>

                            {/* Suppliers Multi-Select */}
                            <div className={formStyles.fullWidthField}>
                                <label className={formStyles.label}>
                                    Suppliers <span className={formStyles.required}>*</span>
                                </label>
                                <div className="space-y-2">
                                    <EntitySelector
                                        options={suppliers}
                                        value={0}
                                        onChange={(value: number) => {
                                            // Add supplier if not already selected
                                            if (value > 0 && !selectedSuppliers.includes(value)) {
                                                const newSuppliers = [...selectedSuppliers, value];
                                                setSelectedSuppliers(newSuppliers);
                                                setFormData(prev => ({ ...prev, suppliers: newSuppliers }));
                                                // Clear error when adding a supplier
                                                if (errors.suppliers) {
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.suppliers;
                                                        return newErrors;
                                                    });
                                                }
                                            }
                                        }}
                                        entityName="supplier"
                                        entityNamePlural="suppliers"
                                        createRoute="/supplier-form"
                                        label=""
                                        required={false}
                                        onReload={handleReloadSuppliers}
                                        filterFn={(option: ResponseSupplierDto) => 
                                            option.isActive && !selectedSuppliers.includes(option.id)
                                        }
                                        formatOptionText={(supplier: ResponseSupplierDto) => 
                                            `${supplier.name} - ${supplier.email}`
                                        }
                                        showDetailCard={true}
                                        detailCardContent={(supplier: ResponseSupplierDto) => (
                                            <div className="text-sm text-blue-800">
                                                <div className="font-medium">{supplier.name}</div>
                                                <div className="mt-1">
                                                    <div>Email: {supplier.email}</div>
                                                    <div>Phone: {supplier.phone}</div>
                                                </div>
                                            </div>
                                        )}
                                    />
                                    
                                    {/* Error message */}
                                    {errors.suppliers && (
                                        <p className={formStyles.errorMessage}>{errors.suppliers}</p>
                                    )}
                                    
                                    {/* Selected Suppliers List */}
                                    {selectedSuppliers.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-sm font-medium text-slate-700">
                                                Selected Suppliers ({selectedSuppliers.length}):
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSuppliers.map((supplierId) => {
                                                    const supplier = suppliers.find(s => s.id === supplierId);
                                                    if (!supplier) return null;
                                                    
                                                    return (
                                                        <div
                                                            key={supplierId}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                        >
                                                            <span>{supplier.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSuppliers = selectedSuppliers.filter(id => id !== supplierId);
                                                                    setSelectedSuppliers(newSuppliers);
                                                                    setFormData(prev => ({ ...prev, suppliers: newSuppliers }));
                                                                }}
                                                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                                                aria-label={`Remove ${supplier.name}`}
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className={formStyles.fullWidthField}>
                                <label className={formStyles.label}>
                                    Product Image
                                </label>
                                <ImageUpload
                                    ref={imageUploadRef}
                                    value={formData.imageUrl}
                                    onChange={(imageUrl) => {
                                        setFormData(prev => ({ ...prev, imageUrl: imageUrl || '' }));
                                    }}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
