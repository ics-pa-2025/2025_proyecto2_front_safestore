'use client';

import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {productService} from '../../../services/product.service.ts';
import {sellService} from '../../../services/sell.service.ts';
import {formStyles} from '../../common/FormStyles.tsx';
import type {ResponseProductDto} from "../../../dto/product/response-product.dto.ts";
import type {SellDetailDto} from "../../../dto/sell/sell-detail.dto.ts";
import {RequestSellDto} from "../../../dto/sell/request-sell.dto.ts";

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
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [cantidad, setCantidad] = useState<number>(1);
    const [sellItems, setSellItems] = useState<SellItem[]>([]);
    const [idComprador, setIdComprador] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.get();
            setProducts(data.filter(p => p.isActive && p.stock > 0));
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const handleAddItem = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedProductId || selectedProductId === 0) {
            newErrors.product = 'Debe seleccionar un producto';
        }

        if (cantidad <= 0) {
            newErrors.cantidad = 'La cantidad debe ser mayor a 0';
        }

        const selectedProduct = products.find(p => p.id === selectedProductId);

        if (selectedProduct && cantidad > selectedProduct.stock) {
            newErrors.cantidad = `Stock insuficiente. Disponible: ${selectedProduct.stock}`;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (selectedProduct) {
            // Verificar si el producto ya existe
            const existingItemIndex = sellItems.findIndex(item => item.product.id === selectedProductId);

            if (existingItemIndex !== -1) {
                // Si existe, sumar la cantidad
                const updatedItems = [...sellItems];
                const newCantidad = updatedItems[existingItemIndex].cantidad + cantidad;

                // Verificar que no exceda el stock
                if (newCantidad > selectedProduct.stock) {
                    setErrors({cantidad: `Stock insuficiente. Disponible: ${selectedProduct.stock}`});
                    return;
                }

                updatedItems[existingItemIndex].cantidad = newCantidad;
                setSellItems(updatedItems);
            } else {
                // Si no existe, agregarlo como nuevo
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
            alert(`Stock insuficiente. Disponible: ${product.stock}`);
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
            newErrors.items = 'Debe agregar al menos un producto a la venta';
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

            const requestSellDto = new RequestSellDto(
                    idComprador || '',
                    sellDetails
            );

            await sellService.create(requestSellDto);
            navigate('/sell');
        } catch (error) {
            console.error('Error guardando venta:', error);
            alert('Error al guardar la venta. Por favor intente nuevamente.');
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
                            {isEditing ? 'Editar Venta' : 'Nueva Venta'}
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
                                    form="sell-form"
                                    className={formStyles.submitButton}
                                    disabled={sellItems.length === 0}
                            >
                                {isEditing ? 'Actualizar' : 'Crear Venta'}
                            </button>
                        </div>
                    </div>

                    <div className={formStyles.formContainer}>
                        <form id="sell-form" onSubmit={handleSubmit} className={formStyles.form}>
                            <div className={formStyles.fieldGrid}>
                                {/* ID Comprador (Opcional) */}
                                <div className={formStyles.fullWidthField}>
                                    <label htmlFor="idComprador" className={formStyles.label}>
                                        ID Comprador (Opcional)
                                    </label>
                                    <input
                                            type="text"
                                            id="idComprador"
                                            name="idComprador"
                                            value={idComprador}
                                            onChange={(e) => setIdComprador(e.target.value)}
                                            placeholder="Ingrese el ID del comprador"
                                            className={formStyles.input}
                                    />
                                </div>
                            </div>

                            {/* Sección para agregar productos */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Agregar Producto</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label htmlFor="product" className={formStyles.label}>
                                            Producto <span className={formStyles.required}>*</span>
                                        </label>
                                        <select
                                                id="product"
                                                value={selectedProductId}
                                                onChange={(e) => {
                                                    setSelectedProductId(Number(e.target.value));
                                                    setErrors({});
                                                }}
                                                className={formStyles.input}
                                        >
                                            <option value={0}>Seleccione un producto</option>
                                            {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} -
                                                        ${product.price.toFixed(2)} (Stock: {product.stock})
                                                    </option>
                                            ))}
                                        </select>
                                        {errors.product && (
                                                <p className="mt-1 text-sm text-red-600">{errors.product}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-1">
                                        <label htmlFor="cantidad" className={formStyles.label}>
                                            Cantidad <span className={formStyles.required}>*</span>
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
                                            Agregar
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
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Productos en la
                                            Venta</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio
                                                        Unit.
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
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
                                                                    Eliminar
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