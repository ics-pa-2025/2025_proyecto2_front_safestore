import type { AxiosResponse } from 'axios';
import { authApi } from '../api/authApi.ts';
import type { ResponseUserDto } from '../dto/user/response-user.dto.ts';

class UserService {
    async get(): Promise<ResponseUserDto[]> {
        try {
            const response: AxiosResponse<ResponseUserDto[]> =
                await authApi.get('user');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al obtener los productos');
        }
    }
}

export const userService = new UserService();
