'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandsService } from '../../../services/brands.service';
import Card from '../../common/Card';
import type { ResponseBrandDto } from '../../../dto/brands/response-brand.dto';

export function Brands() {
    const navigate = useNavigate();
    const [brands, setBrands] = useState<ResponseBrandDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            setLoading(true);
            const data = await brandsService.get();
            setBrands(data);
        } catch (error) {
            console.error('Error cargando marcas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/brands-form?id=${id}`);
    };

    const handleDelete = async (id: number) => {
        if (
            window.confirm('¿Estás seguro de que quieres eliminar esta marca?')
        ) {
            try {
                await brandsService.delete(id);
                await loadBrands(); // Reload brands after deletion
            } catch (error) {
                console.error('Error eliminando marca:', error);
            }
        }
    };

    const handleAddBrand = () => {
        navigate('/brands-form');
    };

    if (loading) {
        return <div className="text-center py-8">Cargando marcas...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Marcas</h1>
                <button
                    onClick={handleAddBrand}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Agregar Marca
                </button>
            </div>

            {brands.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No hay marcas registradas.
                    </p>
                    <button
                        onClick={handleAddBrand}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Crear Primera Marca
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {brands.map((brand) => (
                        <Card
                            key={brand.id}
                            id={brand.id}
                            title={brand.name}
                            description={brand.description}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
