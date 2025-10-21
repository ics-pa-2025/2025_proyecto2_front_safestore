'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResponseCustomerDto } from '../../../dto/customer/response-customer.dto.ts';
import { customerService } from '../../../services/customer.service.ts';
import Table, { type TableColumn } from '../../common/Table.tsx';

export function Customers() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<ResponseCustomerDto[]>([]);

    // Definir las columnas de la tabla
    const columns: TableColumn<ResponseCustomerDto>[] = [
        {
            key: 'name',
            header: 'Name',
            align: 'left'
        },
        {
            key: 'lastName',
            header: 'Last Name',
            align: 'left'
        },
        {
            key: 'email',
            header: 'Email',
            align: 'left'
        },
        {
            key: 'phone',
            header: 'Phone',
            align: 'left'
        },
        {
            key: 'documento',
            header: 'Document',
            align: 'center'
        },
        {
            key: 'address',
            header: 'Address',
            align: 'left'
        }
    ];

    useEffect(() => {
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

    const handleEdit = (id: number | string) => {
        navigate(`/customer-form?id=${id}`);
    };

    const handleAddCustomer = () => {
        navigate('/customer-form');
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerService.delete(Number(id));
                loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    return (
        <div>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
                    <button
                        onClick={handleAddCustomer}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        + Add Customer
                    </button>
                </div>

                <div className="flex-1">
                    <Table
                        data={customers}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No customers available"
                        getItemId={(customer) => customer.id}
                    />
                </div>
            </div>
        </div>
    );
}