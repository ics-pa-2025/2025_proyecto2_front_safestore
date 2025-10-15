'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResponseProductDto } from '../../../dto/product/response-product.dto.ts';
import { productService } from '../../../services/product.service.ts';
import Table, { type TableColumn } from '../../common/Table.tsx';

export function Product() {
    const navigate = useNavigate();
    const [productos, setProducts] = useState<ResponseProductDto[]>([]);

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

    const handleEdit = (id: number | string) => {
        navigate(`/products-form?id=${id}`);
    };

    const handleAddProduct = () => {
        navigate('/products-form');
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await productService.delete(Number(id));
                loadProducts();
            } catch (error) {
                console.error('Error eliminando producto:', error);
            }
        }
    };

    return (
        <div className="h-full w-full">
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                    <button
                        onClick={handleAddProduct}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Agregar producto
                    </button>
                </div>

                <div className="flex-1">
                    <Table
                        data={productos}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No hay productos disponibles"
                        getItemId={(product) => product.id}
                    />
                </div>
            </div>
        </div>
    );
}
