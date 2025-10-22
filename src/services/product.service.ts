import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestProductDto } from '../dto/product/request-product.dto.ts';
import type { ResponseProductDto } from '../dto/product/response-product.dto.ts';

class ProductService {
    async create(
        productCreate: RequestProductDto,
        image?: File
    ): Promise<ResponseProductDto> {
        try {
            const formData = new FormData();
            formData.append('name', productCreate.name);
            formData.append('price', productCreate.price.toString());
            formData.append('stock', productCreate.stock.toString());
            formData.append('brandId', productCreate.brandId.toString());
            formData.append('lineId', productCreate.lineId.toString());
            
            if (productCreate.description) {
                formData.append('description', productCreate.description);
            }
            
            if (productCreate.suppliers && productCreate.suppliers.length > 0) {
                productCreate.suppliers.forEach((supplierId) => {
                    formData.append('suppliers[]', supplierId.toString());
                });
            }
            
            if (image) {
                formData.append('image', image);
            }

            const response: AxiosResponse<ResponseProductDto> =
                await backApi.post('products', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el producto');
        }
    }

    async update(
        id: string,
        productUpdate: RequestProductDto,
        image?: File
    ): Promise<ResponseProductDto> {
        try {
            const formData = new FormData();
            formData.append('name', productUpdate.name);
            formData.append('price', productUpdate.price.toString());
            formData.append('stock', productUpdate.stock.toString());
            formData.append('brandId', productUpdate.brandId.toString());
            formData.append('lineId', productUpdate.lineId.toString());
            
            if (productUpdate.description) {
                formData.append('description', productUpdate.description);
            }
            
            if (productUpdate.suppliers && productUpdate.suppliers.length > 0) {
                productUpdate.suppliers.forEach((supplierId) => {
                    formData.append('suppliers[]', supplierId.toString());
                });
            }
            
            if (image) {
                formData.append('image', image);
            }

            const response: AxiosResponse<ResponseProductDto> =
                await backApi.patch(`products/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
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
