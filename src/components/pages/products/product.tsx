'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResponseProductDto } from '../../../dto/product/response-product.dto.ts';
import { productService } from '../../../services/product.service.ts';
import Table, { type TableColumn } from '../../common/Table.tsx';
import { verificarStockProductos } from '../../../helpers/verificarStock.helper.ts';
import { getImageUrl } from '../../../utils/imageUtils.ts';

export function Product() {
    const navigate = useNavigate();
    const [productos, setProducts] = useState<ResponseProductDto[]>([]);

    // Definir las columnas de la tabla
    const columns: TableColumn<ResponseProductDto>[] = [
        {
            key: 'imageUrl',
            header: 'Image',
            align: 'center',
            render: (product) => product.imageUrl ? (
                <img 
                    src={getImageUrl(product.imageUrl)} 
                    alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ) : (
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    📷
                </div>
            )
        },
        {
            key: 'name',
            header: 'Name',
            align: 'left'
        },
        {
            key: 'brandId',
            header: 'Brand (ID)',
            align: 'left'
        },
        {
            key: 'lineId',
            header: 'Line (ID)',
            align: 'left'
        },
        {
            key: 'price',
            header: 'Price',
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
            
            // Verificar stock después de cargar los productos
            await verificarStockProductos(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const handleEdit = (id: number | string) => {
        navigate(`/product-form?id=${id}`);
    };

    const handleAddProduct = () => {
        navigate('/product-form');
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.delete(Number(id));
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div >
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                    <button
                        onClick={handleAddProduct}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add Product
                    </button>
                </div>

                <div className="flex-1">
                    <Table
                        data={productos}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No products available"
                        getItemId={(product) => product.id}
                    />
                </div>
            </div>
        </div>
    );
}
