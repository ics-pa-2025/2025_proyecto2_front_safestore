'use client';

import React, { useEffect, useState } from 'react';
import type { ResponseProductDto } from '../../../dto/product/response-product.dto.ts';
import { productService } from '../../../services/product.service.ts';
import { ProductForm } from './product-form.tsx';
import Table, { type TableColumn } from '../../common/Table.tsx';

export function Product() {
    const [productos, setProducts] = useState<ResponseProductDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] =
        useState<ResponseProductDto | null>(null);

    // Definir las columnas de la tabla
    const columns: TableColumn<ResponseProductDto>[] = [
        {
            key: 'name',
            header: 'Nombre',
            align: 'left'
        },
        {
            key: 'brandId',
            header: 'Categoría (ID)',
            align: 'left'
        },
        {
            key: 'lineId',
            header: 'Línea (ID)',
            align: 'left'
        },
        {
            key: 'price',
            header: 'Precio',
            align: 'right',
            render: (product) => `$${product.price.toFixed(2)}`
        },
        {
            key: 'stock',
            header: 'Stock',
            align: 'right'
        }
    ];

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

                <Table
                    data={productos}
                    columns={columns}
                    emptyMessage="No hay productos disponibles"
                    getItemId={(product) => product.id}
                />
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
