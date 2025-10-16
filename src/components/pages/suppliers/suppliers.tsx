'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResponseSupplierDto } from '../../../dto/supplier/response-supplier.dto.ts';
import { supplierService } from '../../../services/supplier.service.ts';
import Table, { type TableColumn } from '../../common/Table.tsx';

export function Suppliers() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState<ResponseSupplierDto[]>([]);

    // Definir las columnas de la tabla
    const columns: TableColumn<ResponseSupplierDto>[] = [
        {
            key: 'name',
            header: 'Nombre',
            align: 'left'
        },
        {
            key: 'email',
            header: 'Email',
            align: 'left'
        },
        {
            key: 'phone',
            header: 'Teléfono',
            align: 'left'
        },
        {
            key: 'isActive',
            header: 'Estado',
            align: 'center',
            render: (supplier) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {supplier.isActive ? 'Activo' : 'Inactivo'}
                </span>
            )
        }
    ];

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const data = await supplierService.get();
            setSuppliers(data);
        } catch (error) {
            console.error('Error cargando proveedores:', error);
        }
    };

    const handleEdit = (id: number | string) => {
        navigate(`/supplier-form?id=${id}`);
    };

    const handleAddSupplier = () => {
        navigate('/supplier-form');
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
            try {
                await supplierService.delete(Number(id));
                loadSuppliers();
            } catch (error) {
                console.error('Error eliminando proveedor:', error);
            }
        }
    };

    return (
        <div>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Suppliers</h1>
                    <button
                        onClick={handleAddSupplier}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        + Add Supplier
                    </button>
                </div>

                <div className="flex-1">
                    <Table
                        data={suppliers}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No hay proveedores disponibles"
                        getItemId={(supplier) => supplier.id}
                    />
                </div>
            </div>
        </div>
    );
}