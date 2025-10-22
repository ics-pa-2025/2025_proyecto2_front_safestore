'use client';

import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {productService} from '../../../services/product.service.ts';
import {sellService} from '../../../services/sell.service.ts';
import {formStyles} from '../../common/FormStyles.tsx';
import {EntitySelector, useEntitySelector} from '../../common/EntitySelector.tsx';
import type {ResponseProductDto} from "../../../dto/product/response-product.dto.ts";
import type {SellDetailDto} from "../../../dto/sell/sell-detail.dto.ts";
import {RequestSellDto} from "../../../dto/sell/request-sell.dto.ts";
import type { ResponseCustomerDto } from '../../../dto/customer/response-customer.dto.ts';
import { customerService } from '../../../services/customer.service.ts';

interface SellItem {
    product: ResponseProductDto;
    cantidad: number;
    tempId: string; // ID temporal para identificar cada detalle único
}

export function SellForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sellId = searchParams.get('id');
    const isEditing = Boolean(sellId);

    const [products, setProducts] = useState<ResponseProductDto[]>([]);
    const [customers, setCustomers] = useState<ResponseCustomerDto[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [cantidad, setCantidad] = useState<number>(1);
    const [sellItems, setSellItems] = useState<SellItem[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { reloadData } = useEntitySelector();

    useEffect(() => {
        loadProducts();
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await customerService.get();
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    // Function to reload customers after creating a new one
    const handleReloadCustomers = async () => {
        await reloadData(() => customerService.get(), setCustomers);
    };

    const loadProducts = async () => {
        try {
            const data = await productService.get();
            setProducts(data.filter(p => p.isActive && p.stock > 0));
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    // Function to reload products after creating a new one
    const handleReloadProducts = async () => {
        await reloadData(() => productService.get().then(data => data.filter(p => p.isActive && p.stock > 0)), setProducts);
    };

    const handleAddItem = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedProductId || selectedProductId === 0) {
            newErrors.product = 'Must select a product';
        }

        if (cantidad <= 0) {
            newErrors.cantidad = 'La cantidad debe ser mayor a 0';
        }

        const selectedProduct = products.find(p => p.id === selectedProductId);

        if (selectedProduct && cantidad > selectedProduct.stock) {
            newErrors.cantidad = `Insufficient stock. Available: ${selectedProduct.stock}`;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (selectedProduct) {
            // Check if product already exists
            const existingItemIndex = sellItems.findIndex(item => item.product.id === selectedProductId);

            if (existingItemIndex !== -1) {
                // Si existe, sumar la cantidad
                const updatedItems = [...sellItems];
                const newCantidad = updatedItems[existingItemIndex].cantidad + cantidad;

                // Check that it doesn't exceed stock
                if (newCantidad > selectedProduct.stock) {
                    setErrors({cantidad: `Insufficient stock. Available: ${selectedProduct.stock}`});
                    return;
                }

                updatedItems[existingItemIndex].cantidad = newCantidad;
                setSellItems(updatedItems);
            } else {
                // If it doesn't exist, add it as new
                setSellItems([...sellItems, {
                    product: selectedProduct,
                    cantidad: cantidad,
                    tempId: `${selectedProduct.id}-${Date.now()}`
                }]);
            }

            setSelectedProductId(0);
            setCantidad(1);
            setErrors({});
        }
    };

    const handleRemoveItem = (productId: number) => {
        setSellItems(sellItems.filter(item => item.product.id !== productId));
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        const product = products.find(p => p.id === productId);

        if (newQuantity <= 0) {
            return;
        }

        if (product && newQuantity > product.stock) {
            alert(`Insufficient stock. Available: ${product.stock}`);
            return;
        }

        setSellItems(sellItems.map(item =>
                item.product.id === productId
                        ? {...item, cantidad: newQuantity}
                        : item
        ));
    };

    const calculateTotal = (): number => {
        return sellItems.reduce((total, item) => {
            return total + (item.product.price * item.cantidad);
        }, 0);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (sellItems.length === 0) {
            newErrors.items = 'Must add at least one product to the sale';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const sellDetails: SellDetailDto[] = sellItems.map(item => ({
                cantidad: item.cantidad,
                idProduct: item.product.id
            }));

            // Get customer ID - if a customer is selected, use their id, otherwise use empty string
            const customerId = selectedCustomerId > 0 
                ? customers.find(c => c.id === selectedCustomerId)?.id?.toString() || ''
                : '';

            const requestSellDto = new RequestSellDto(
                    customerId,
                    sellDetails
            );

            await sellService.create(requestSellDto);
            navigate('/sell');
        } catch (error) {
            console.error('Error saving sale:', error);
            alert('Error saving sale. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate('/sell');
    };

    return (
            <div>
                <div className={formStyles.pageContainer}>
                    <div className={formStyles.header}>
                        <h1 className={formStyles.title}>
                            {isEditing ? 'Edit Sale' : 'New Sale'}
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
                                    form="sell-form"
                                    className={formStyles.submitButton}
                                    disabled={sellItems.length === 0}
                            >
                                {isEditing ? 'Update' : 'Create Sale'}
                            </button>
                        </div>
                    </div>

                    <div className={formStyles.formContainer}>
                        <form id="sell-form" onSubmit={handleSubmit} className={formStyles.form}>
                            <div className={formStyles.fieldGrid}>
                                {/* Customer Selector */}
                                <div className={formStyles.fullWidthField}>
                                    <EntitySelector
                                        options={customers}
                                        value={selectedCustomerId}
                                        onChange={(value: number) => {
                                            setSelectedCustomerId(value);
                                            setErrors({});
                                        }}
                                        entityName="customer"
                                        entityNamePlural="customers"
                                        createRoute="/customer-form"
                                        label="Customer (Optional)"
                                        required={false}
                                        error={errors.customer}
                                        onReload={handleReloadCustomers}
                                        formatOptionText={(customer: ResponseCustomerDto) => 
                                            `${customer.name} ${customer.lastName} - ${customer.id}`
                                        }
                                        showDetailCard={true}
                                        detailCardContent={(customer: ResponseCustomerDto) => (
                                            <div className="text-sm text-blue-800">
                                                <div className="font-medium">{customer.name} {customer.lastName}</div>
                                                <div className="mt-1">
                                                    <div>ID: {customer.id}</div>
                                                    {customer.email && <div>Email: {customer.email}</div>}
                                                    {customer.phone && <div>Phone: {customer.phone}</div>}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section to add products */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Product</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <EntitySelector
                                            options={products}
                                            value={selectedProductId}
                                            onChange={(value: number) => {
                                                setSelectedProductId(value);
                                                setErrors({});
                                            }}
                                            entityName="product"
                                            entityNamePlural="products"
                                            createRoute="/product-form"
                                            label="Product"
                                            required
                                            error={errors.product}
                                            onReload={handleReloadProducts}
                                            filterFn={(option: any) => option.isActive && option.stock > 0}
                                            formatOptionText={(product: any) => 
                                                `${product.name} - $${product.price.toFixed(2)} (Stock: ${product.stock})`
                                            }
                                            showDetailCard={true}
                                            detailCardContent={(product: any) => (
                                                <div className="text-sm text-blue-800">
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="flex justify-between mt-1">
                                                        <span>Price: ${product.price.toFixed(2)}</span>
                                                        <span>Available stock: {product.stock}</span>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <label htmlFor="cantidad" className={formStyles.label}>
                                            Quantity <span className={formStyles.required}>*</span>
                                        </label>
                                        <input
                                                type="number"
                                                id="cantidad"
                                                value={cantidad}
                                                onChange={(e) => {
                                                    setCantidad(Number(e.target.value));
                                                    setErrors({});
                                                }}
                                                min="1"
                                                className={formStyles.input}
                                        />
                                        {errors.cantidad && (
                                                <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-1 flex items-end">
                                        <button
                                                type="button"
                                                onClick={handleAddItem}
                                                className="w-full bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                {errors.items && (
                                        <p className="mt-2 text-sm text-red-600">{errors.items}</p>
                                )}
                            </div>

                            {/* Lista de productos agregados */}
                            {sellItems.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Products in Sale</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                {sellItems.map((item) => (
                                                        <tr key={item.product.id}>
                                                            <td className="px-4 py-3 text-sm text-gray-900">{item.product.name}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">${item.product.price.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                <input
                                                                        type="number"
                                                                        value={item.cantidad}
                                                                        onChange={(e) => handleUpdateQuantity(item.product.id, Number(e.target.value))}
                                                                        min="1"
                                                                        max={item.product.stock}
                                                                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                ${(item.product.price * item.cantidad).toFixed(2)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveItem(item.product.id)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan={3}
                                                        className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                        Total:
                                                    </td>
                                                    <td colSpan={2}
                                                        className="px-4 py-3 text-sm font-bold text-gray-900">
                                                        ${calculateTotal().toFixed(2)}
                                                    </td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
    );
}