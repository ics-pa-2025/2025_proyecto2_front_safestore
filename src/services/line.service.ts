import type { AxiosResponse } from 'axios';
import { backApi } from '../api/backApi.ts';
import type { RequestLineDto } from '../dto/line/request-line.dto.ts';
import type { ResponseLineDto } from '../dto/line/response-line.dto.ts';

class LineService {
    async create(lineCreate: RequestLineDto): Promise<RequestLineDto> {
        try {
            const response: AxiosResponse<ResponseLineDto> = await backApi.post(
                'lines',
                lineCreate
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el perfil');
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
            throw new Error('Error al actualizar el perfil');
        }
    }

    async get(): Promise<ResponseLineDto[]> {
        try {
            const response: AxiosResponse<ResponseLineDto[]> =
                await backApi.get('lines');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await backApi.delete(`lines/${id}`);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar el perfil');
        }
    }
}

export const lineService = new LineService();
