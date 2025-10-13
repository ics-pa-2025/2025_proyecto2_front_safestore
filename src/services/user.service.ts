import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestProductDto } from '../dto/product/request-product.dto.ts';
import type { ResponseProductDto } from '../dto/product/response-product.dto.ts';

class ProductService {
    async create(
        productCreate: RequestProductDto
    ): Promise<ResponseProductDto> {
        try {
            const response: AxiosResponse<ResponseProductDto> =
                await backApi.post('products', productCreate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el producto');
        }
    }

    async update(
        id: string,
        productUpdate: RequestProductDto
    ): Promise<ResponseProductDto> {
        try {
            const response: AxiosResponse<ResponseProductDto> =
                await backApi.patch(`products/${id}`, productUpdate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el producto');
        }
    }

    async get(): Promise<ResponseProductDto[]> {
        try {
            const response: AxiosResponse<ResponseProductDto[]> =
                await backApi.get('products');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener los productos');
        }
    }

    async getById(id: string): Promise<ResponseProductDto> {
        try {
            const response: AxiosResponse<ResponseProductDto> =
                await backApi.get(`products/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener el producto');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await backApi.delete(`products/${id}`);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar el producto');
        }
    }
}

export const productService = new ProductService();
