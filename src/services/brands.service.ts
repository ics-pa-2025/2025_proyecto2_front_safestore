import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestBrandDto } from '../dto/brands/request-brand.dto.ts';
import type { ResponseBrandDto } from '../dto/brands/response-brand.dto.ts';

class BrandsService {
    async create(brandCreate: RequestBrandDto): Promise<ResponseBrandDto> {
        try {
            const response: AxiosResponse<ResponseBrandDto> =
                await backApi.post('brands', brandCreate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el perfil');
        }
    }

    async update(
        id: string,
        brandUpdate: RequestBrandDto
    ): Promise<ResponseBrandDto> {
        try {
            const response: AxiosResponse<ResponseBrandDto> =
                await backApi.patch(`brands/${id}`, brandUpdate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }

    async get(): Promise<ResponseBrandDto[]> {
        try {
            const response: AxiosResponse<ResponseBrandDto[]> =
                await backApi.get('brands');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }
}

export const brandsService = new BrandsService();
