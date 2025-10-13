'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { ResponseUserDto } from '../../../dto/user/response-user.dto.ts';
import { userService } from '../../../services/user.service.ts';

export function Users() {
    const [users, setUsers] = useState<ResponseUserDto[]>([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [productToEdit, setProductToEdit] =
    //     useState<ResponseProductDto | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.get();
            setUsers(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const handleEdit = (id: string) => {
        console.log(id);
        // const product = productos.find((p) => p.id === id);
        // if (product) {
        //     setProductToEdit(product);
        //     setIsModalOpen(true);
        // }
    };

    const handleAddUser = () => {
        // setProductToEdit(null);
        // setIsModalOpen(true);
    };

    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    //     setProductToEdit(null);
    // };

    // const handleSuccess = () => {
    //     loadProducts();
    // };

    const handleDelete = async (id: string) => {
        console.log(id);
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                // await productService.delete(id);
                loadUsers();
            } catch (error) {
                console.error('Error eliminando producto:', error);
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
                                    Accions
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
                                        No hay productos disponibles
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
                                            {user.rolesId}
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
            {/*<ProductForm*/}
            {/*    isOpen={isModalOpen}*/}
            {/*    onClose={handleCloseModal}*/}
            {/*    onSuccess={handleSuccess}*/}
            {/*    productToEdit={productToEdit}*/}
            {/*/>*/}
        </div>
    );
}
