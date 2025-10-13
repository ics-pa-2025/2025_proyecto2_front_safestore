import type { AxiosResponse } from 'axios';
import { authApi } from '../api/authApi.ts';

class RolesService {
    async get(): Promise<any[]> {
        try {
            const response: AxiosResponse<any[]> = await authApi.get('roles');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener los productos');
        }
    }
}

export const rolesService = new RolesService();
