import type { AxiosResponse } from 'axios';
import { authApi } from '../api/authApi.ts';
import type { ResponseUserDto } from '../dto/user/response-user.dto.ts';
import type {UpdateUserDto} from "../dto/user/update-user.dto.ts";
import type {AuthResponse} from "../dto/auth/auth-response.dto.ts";

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

    async delete(id:string){
        try {
            await authApi.delete(`user/${id}`);
        } catch (error) {
            console.log(error);
            throw new Error('Error al eliminar el usuario');
        }
    }

    async update(
        id: string,
        userUpdate: UpdateUserDto
    ): Promise<ResponseUserDto> {
        try {
            const response: AxiosResponse<ResponseUserDto> =
                await authApi.patch(`user/${id}`, userUpdate);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }


    async create(
        email: string,
        password: string,
        fullname: string,
        phone: string,
        address: string
    ): Promise<ResponseUserDto> {
        try {
            const response: AxiosResponse<AuthResponse> = await authApi.post(
                '/auth/register',
                {
                    email,
                    password,
                    fullname,
                    phone,
                    address
                }
            );
            if (!response.data.user) {
                throw new Error('No se recibió el usuario en la respuesta');
            }
            return response.data.user;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el usuario');
        }
    }

}

export const userService = new UserService();
