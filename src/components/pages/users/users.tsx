'use client';

import React, { useEffect, useState } from 'react';
import type { ResponseProductDto } from '../../../dto/product/response-product.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { Pencil, Trash2 } from 'lucide-react';
import { ProductForm } from './product-form.tsx'; // Importar el modal

export function Product() {
    const [productos, setProducts] = useState<ResponseProductDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] =
        useState<ResponseProductDto | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.get();
            setProducts(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const handleEdit = (id: number) => {
        const product = productos.find((p) => p.id === id);
        if (product) {
            setProductToEdit(product);
            setIsModalOpen(true);
        }
    };

    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProductToEdit(null);
    };

    const handleSuccess = () => {
        loadProducts();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await productService.delete(id);
                loadProducts();
            } catch (error) {
                console.error('Error eliminando producto:', error);
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6">Product</h1>
                    <button
                        onClick={handleAddProduct}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Agregar producto
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                    Categoría (ID)
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                    Línea (ID)
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                                    Precio
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No hay productos disponibles
                                    </td>
                                </tr>
                            ) : (
                                productos.map((producto) => (
                                    <tr
                                        key={producto.id}
                                        className="hover:bg-gray-50 border-b"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {producto.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {producto.brandId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {producto.lineId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-right">
                                            ${producto.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-right">
                                            {producto.stock}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    handleEdit(producto.id)
                                                }
                                                className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 mr-2"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(producto.id)
                                                }
                                                className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <ProductForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                productToEdit={productToEdit}
            />
        </div>
    );
}
