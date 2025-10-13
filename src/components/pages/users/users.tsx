'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { ResponseUserDto } from '../../../dto/user/response-user.dto.ts';
import { userService } from '../../../services/user.service.ts';
import { rolesService } from '../../../services/role.service.ts';
import { UserForm } from './user-form.tsx';

export function Users() {
    const [users, setUsers] = useState<ResponseUserDto[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<ResponseUserDto | null>(null);

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

    const handleEdit = (id: string) => {
        const user = users.find((u) => u.id === id);
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

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await userService.delete(id);
                loadUsers();
            } catch (error) {
                console.error('Error eliminando usuario:', error);
            }
        }
    };

    return (
            <div className="register-container">
                <div className="register-card">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold mb-6">Users</h1>
                        <button
                                onClick={handleAddUser}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            + Add User
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length === 0 ? (
                                    <tr>
                                        <td
                                                colSpan={6}
                                                className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No hay usuarios disponibles
                                        </td>
                                    </tr>
                            ) : (
                                    users.map((user) => (
                                            <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50 border-b"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {user.fullname}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {handleGetRoleName(user.rolesId)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                                                    {user.isActive
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                                                    {user.phone}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                            onClick={() =>
                                                                    handleEdit(user.id)
                                                            }
                                                            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 mr-2"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                            onClick={() =>
                                                                    handleDelete(user.id)
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
                <UserForm
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                        userToEdit={userToEdit}
                />
            </div>
    );
}