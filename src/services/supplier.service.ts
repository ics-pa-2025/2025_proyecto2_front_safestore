import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestSupplierDto } from '../dto/supplier/request-supplier.dto.ts';
import type { ResponseSupplierDto } from '../dto/supplier/response-supplier.dto.ts';

class SupplierService {
    async create(
        supplierCreate: RequestSupplierDto
    ): Promise<ResponseSupplierDto> {
        try {
            const response: AxiosResponse<ResponseSupplierDto> =
                await backApi.post('suppliers', supplierCreate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el proveedor');
        }
    }

    async update(
        id: string,
        supplierUpdate: RequestSupplierDto
    ): Promise<ResponseSupplierDto> {
        try {
            const response: AxiosResponse<ResponseSupplierDto> =
                await backApi.patch(`suppliers/${id}`, supplierUpdate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el proveedor');
        }
    }

    async get(): Promise<ResponseSupplierDto[]> {
        try {
            const response: AxiosResponse<ResponseSupplierDto[]> =
                await backApi.get('suppliers');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener los proveedores');
        }
    }

    async getById(id: string): Promise<ResponseSupplierDto> {
        try {
            const response: AxiosResponse<ResponseSupplierDto> =
                await backApi.get(`suppliers/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener el proveedor');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await backApi.delete(`suppliers/${id}`);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar el proveedor');
        }
    }

    async getActive(): Promise<ResponseSupplierDto[]> {
        try {
            const response: AxiosResponse<ResponseSupplierDto[]> =
                await backApi.get('suppliers?active=true');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener los proveedores activos');
        }
    }

    async softDelete(id: number): Promise<ResponseSupplierDto> {
        try {
            const response: AxiosResponse<ResponseSupplierDto> =
                await backApi.delete(`suppliers/${id}/soft`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al desactivar el proveedor');
        }
    }

    async restore(id: number): Promise<ResponseSupplierDto> {
        try {
            const response: AxiosResponse<ResponseSupplierDto> =
                await backApi.patch(`suppliers/${id}/restore`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al restaurar el proveedor');
        }
    }
}

export const supplierService = new SupplierService();