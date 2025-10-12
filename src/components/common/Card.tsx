import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface CardProps {
    id: number;
    title: string;
    description?: string;
    image?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    id,
    title,
    description,
    image,
    onEdit,
    onDelete,
    children,
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover rounded mb-3"
                />
            )}

            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            {description && (
                <p className="text-gray-600 text-sm mb-3">{description}</p>
            )}

            {children}

            <div className="flex gap-2 mt-4">
                {onEdit && (
                    <button
                        onClick={() => onEdit(id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Pencil size={16} />
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={() => onDelete(id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Card;
