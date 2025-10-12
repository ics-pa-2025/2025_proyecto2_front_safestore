import type { AxiosResponse } from 'axios';
import { authApi } from '../api/authApi';
import type { ResponseUserDto } from '../dto/user/response-user.dto';
import type { UpdateUserDto } from '../dto/user/update-user.dto';
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../helpers/localStorage.helper';

class ProfileService {
    async update(
        id: string,
        userUpdate: UpdateUserDto
    ): Promise<ResponseUserDto> {
        try {
            const response: AxiosResponse<ResponseUserDto> =
                await authApi.patch(`/${id}`, userUpdate);
            const user = response.data;

            if (user) this.setUser(user);
            return user;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }

    getUser(): ResponseUserDto {
        const user = getFromLocalStorage<ResponseUserDto>('user');
        if (!user) throw new Error('No hay usuario logueado');
        return user;
    }

    setUser(user: ResponseUserDto): void {
        saveToLocalStorage('user', user);
    }
}

export const profileService = new ProfileService();
