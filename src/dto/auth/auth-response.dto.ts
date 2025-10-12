import type { ResponseUserDto } from '../user/response-user.dto.ts';

export interface AuthResponse {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    user?: ResponseUserDto;
}
