import type {User} from "./user.dto.ts";

export interface AuthResponse {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    user?: User;
}