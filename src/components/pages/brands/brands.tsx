'use client';

import { brandsService } from '../../../services/brands.service.ts';

export function Brands() {
    const brands = brandsService.get();
    console.log(brands);

    return (
        <div>
            <h1>Brands</h1>
        </div>
    );
}
