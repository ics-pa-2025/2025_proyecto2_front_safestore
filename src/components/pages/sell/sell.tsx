'use client';

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Table from '../../common/Table.tsx';
import type {ResponseSellDto} from "../../../dto/sell/response-sell.dto.ts";
import {sellService} from "../../../services/sell.service.ts";
import {columnSell} from "./column-sell.tsx";

export function Sell() {
    const navigate = useNavigate();
    const [sell, setSell] = useState<ResponseSellDto[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await sellService.get();
            setSell(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const handleAddProduct = () => {
        navigate('/sell-form');
    };

    return (
            <div>
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
                        <button
                                onClick={handleAddProduct}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add Sale
                        </button>
                    </div>
                    <div className="flex-1">
                        <Table
                                data={sell}
                                columns={columnSell}
                                emptyMessage="No products available"
                                getItemId={(product) => product.id}
                        />
                    </div>
                </div>
            </div>
    );
}
