'use client';

import React, { useEffect, useState } from 'react';
import type { ResponseUserDto } from '../../../dto/user/response-user.dto.ts';
import { userService } from '../../../services/user.service.ts';
import { rolesService } from '../../../services/role.service.ts';
import { UserForm } from './user-form.tsx';
import Table, { type TableColumn } from '../../common/Table.tsx';

export function Users() {
    const [users, setUsers] = useState<ResponseUserDto[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<ResponseUserDto | null>(null);

    // Definir las columnas de la tabla
    const columns: TableColumn<ResponseUserDto>[] = [
        {
            key: 'fullname',
            header: 'Name',
            align: 'left'
        },
        {
            key: 'email',
            header: 'Email',
            align: 'left'
        },
        {
            key: 'rolesId',
            header: 'Role',
            align: 'left',
            render: (user) => handleGetRoleName(user.rolesId)
        },
        {
            key: 'isActive',
            header: 'Status',
            align: 'right',
            render: (user) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'phone',
            header: 'Phone',
            align: 'right'
        }
    ];

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.get();
            setUsers(data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    };

    const loadRoles = async () => {
        try {
            const data = await rolesService.get();
            setRoles(data);
        } catch (error) {
            console.error('Error cargando roles:', error);
        }
    };

    const handleGetRoleName = (roleId: string[] | undefined) => {
        const role = roles.find((r) => r.id === roleId?.[0]);
        return role ? role.name : 'User';
    };

    const handleEdit = (id: number | string) => {
        const user = users.find((u) => u.id === String(id));
        if (user) {
            setUserToEdit(user);
            setIsModalOpen(true);
        }
    };

    const handleAddUser = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserToEdit(null);
    };

    const handleSuccess = () => {
        loadUsers();
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await userService.delete(String(id));
                loadUsers();
            } catch (error) {
                console.error('Error eliminando usuario:', error);
            }
        }
    };

    return (
        <div>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        + Add User
                    </button>
                </div>

                <div className="flex-1">
                    <Table
                        data={users}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No hay usuarios disponibles"
                        getItemId={(user) => user.id}
                    />
                </div>
            </div>

            {/* Modal */}
            <UserForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                userToEdit={userToEdit}
            />
        </div>
    );
}