import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestLineDto } from '../dto/line/request-line.dto.ts';
import type { ResponseLineDto } from '../dto/line/response-line.dto.ts';

class LineService {
    async create(lineCreate: RequestLineDto): Promise<ResponseLineDto> {
        try {
            const response: AxiosResponse<ResponseLineDto> = await backApi.post(
                'lines',
                lineCreate
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear la línea');
        }
    }

    async update(
        id: string,
        lineUpdate: RequestLineDto
    ): Promise<ResponseLineDto> {
        try {
            const response: AxiosResponse<ResponseLineDto> =
                await backApi.patch(`lines/${id}`, lineUpdate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar la línea');
        }
    }

    async get(): Promise<ResponseLineDto[]> {
        try {
            const response: AxiosResponse<ResponseLineDto[]> =
                await backApi.get('lines');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener las líneas');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await backApi.delete(`lines/${id}`);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar la línea');
        }
    }

    async getById(id: string): Promise<ResponseLineDto> {
        try {
            const response: AxiosResponse<ResponseLineDto> =
                await backApi.get(`lines/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener la línea');
        }
    }

    async getActive(): Promise<ResponseLineDto[]> {
        try {
            const response: AxiosResponse<ResponseLineDto[]> =
                await backApi.get('lines?active=true');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener las líneas activas');
        }
    }

    async softDelete(id: number): Promise<ResponseLineDto> {
        try {
            const response: AxiosResponse<ResponseLineDto> =
                await backApi.delete(`lines/${id}/soft`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al desactivar la línea');
        }
    }

    async restore(id: number): Promise<ResponseLineDto> {
        try {
            const response: AxiosResponse<ResponseLineDto> =
                await backApi.patch(`lines/${id}/restore`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al restaurar la línea');
        }
    }
}

export const lineService = new LineService();
