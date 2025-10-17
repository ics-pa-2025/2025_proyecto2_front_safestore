import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestCustomerDto } from '../dto/customer/request-customer.dto.ts';
import type { ResponseCustomerDto } from '../dto/customer/response-customer.dto.ts';

class CustomerService {
    async create(
        customerCreate: RequestCustomerDto
    ): Promise<ResponseCustomerDto> {
        try {
            const response: AxiosResponse<ResponseCustomerDto> =
                await backApi.post('customer', customerCreate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el cliente');
        }
    }

    async update(
        id: string,
        customerUpdate: RequestCustomerDto
    ): Promise<ResponseCustomerDto> {
        try {
            const response: AxiosResponse<ResponseCustomerDto> =
                await backApi.patch(`customer/${id}`, customerUpdate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el cliente');
        }
    }

    async get(): Promise<ResponseCustomerDto[]> {
        try {
            const response: AxiosResponse<ResponseCustomerDto[]> =
                await backApi.get('customer');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener los clientes');
        }
    }

    async getById(id: string): Promise<ResponseCustomerDto> {
        try {
            const response: AxiosResponse<ResponseCustomerDto> =
                await backApi.get(`customer/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener el cliente');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await backApi.delete(`customer/${id}`);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar el cliente');
        }
    }
}

export const customerService = new CustomerService();