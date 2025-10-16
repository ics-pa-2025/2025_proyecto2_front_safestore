'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResponseLineDto } from '../../../dto/line/response-line.dto.ts';
import { lineService } from '../../../services/line.service.ts';
import Table, { type TableColumn } from '../../common/Table.tsx';

export function Lines() {
    const navigate = useNavigate();
    const [lines, setLines] = useState<ResponseLineDto[]>([]);

    // Definir las columnas de la tabla
    const columns: TableColumn<ResponseLineDto>[] = [
        {
            key: 'name',
            header: 'Nombre',
            align: 'left'
        },
        {
            key: 'description',
            header: 'Descripción',
            align: 'left',
            render: (line) => line.description || '-'
        },
        {
            key: 'isActive',
            header: 'Estado',
            align: 'center',
            render: (line) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    line.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {line.isActive ? 'Activo' : 'Inactivo'}
                </span>
            )
        }
    ];

    useEffect(() => {
        loadLines();
    }, []);

    const loadLines = async () => {
        try {
            const data = await lineService.get();
            setLines(data);
        } catch (error) {
            console.error('Error cargando líneas:', error);
        }
    };

    const handleEdit = (id: number | string) => {
        navigate(`/line-form?id=${id}`);
    };

    const handleAddLine = () => {
        navigate('/line-form');
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('¿Estás seguro de eliminar esta línea?')) {
            try {
                await lineService.delete(Number(id));
                loadLines();
            } catch (error) {
                console.error('Error eliminando línea:', error);
            }
        }
    };

    return (
        <div>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Lines</h1>
                    <button
                        onClick={handleAddLine}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        + Add Line
                    </button>
                </div>

                <div className="flex-1">
                    <Table
                        data={lines}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No hay líneas disponibles"
                        getItemId={(line) => line.id}
                    />
                </div>
            </div>
        </div>
    );
}