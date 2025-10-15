import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface TableColumn<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    onEdit?: (id: number | string) => void;
    onDelete?: (id: number | string) => void;
    loading?: boolean;
    emptyMessage?: string;
    showActions?: boolean;
    getItemId: (item: T) => number | string;
}

export function Table<T>({
    data,
    columns,
    onEdit,
    onDelete,
    loading = false,
    emptyMessage = 'No hay datos disponibles',
    showActions = true,
    getItemId
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500"></div>
                    <p className="mt-4 text-slate-600 font-medium">Cargando datos...</p>
                </div>
            </div>
        );
    }

    const getAlignmentClass = (align?: string) => {
        switch (align) {
            case 'center':
                return 'text-center';
            case 'right':
                return 'text-right';
            default:
                return 'text-left';
        }
    };

    const renderCellContent = (item: T, column: TableColumn<T>) => {
        if (column.render) {
            return column.render(item);
        }
        
        const value = (item as any)[column.key];
        return value !== null && value !== undefined ? String(value) : '-';
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="min-w-full bg-white border-0 rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-6 py-4 text-sm font-medium text-slate-600 ${getAlignmentClass(column.align)} ${column.className || ''} first:rounded-tl-xl last:rounded-tr-xl`}
                            >
                                {column.header}
                            </th>
                        ))}
                        {showActions && (onEdit || onDelete) && (
                            <th className="px-6 py-4 text-center text-sm font-medium text-slate-600 last:rounded-tr-xl">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (showActions ? 1 : 0)}
                                className="px-6 py-12 text-center text-slate-500 bg-gray-50/30"
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2m0 4v2" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium">{emptyMessage}</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => {
                            const itemId = getItemId(item);
                            return (
                                <tr
                                    key={itemId}
                                    className="hover:bg-slate-50/50 transition-colors duration-200 group"
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 text-sm text-slate-700 ${getAlignmentClass(column.align)} ${column.className || ''}`}
                                        >
                                            {renderCellContent(item, column)}
                                        </td>
                                    ))}
                                    {showActions && (onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(itemId)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all duration-200 shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(itemId)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:scale-105 transition-all duration-200 shadow-sm"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
