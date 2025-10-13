import type { AxiosResponse } from 'axios';
import axios from 'axios';
import {
    getFromLocalStorage,
    removeFromLocalStorage,
    saveToLocalStorage,
} from '../helpers/localStorage.helper';
import type { ApiErrorDto } from '../dto/api-error.dto.ts';
import type { AuthResponse } from '../dto/auth/auth-response.dto.ts';
import { getAuthApiUrl } from './environment';

const authApi = axios.create({
    baseURL: getAuthApiUrl() + '/auth',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token from localStorage on start (if exists)
const initialToken = localStorage.getItem('token');
if (initialToken) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Auth API error:', error);
        return Promise.reject(error);
    }
);

class AuthService {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await authApi.post(
                '/login',
                { email, password }
            );
            const data = response.data;

            const token = data.accessToken || data.token;
            if (token) this.setToken(token);
            if (data.user) saveToLocalStorage('user', data.user);

            return data;
        } catch (error) {
            this.handleError(error, 'Login failed');
        }
    }

    async register(
        email: string,
        password: string,
        fullname: string
    ): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await authApi.post(
                '/register',
                {
                    email,
                    password,
                    fullname,
                }
            );
            const data = response.data;

            const token = data.accessToken || data.token;
            if (token) this.setToken(token);
            if (data.user) saveToLocalStorage('user', data.user);

            return data;
        } catch (error) {
            this.handleError(error, 'Register failed');
        }
    }

    logout() {
        removeFromLocalStorage('token');
        removeFromLocalStorage('user');
        delete authApi.defaults.headers.common['Authorization'];
    }

    setToken(token: string) {
        saveToLocalStorage('token', token);
        authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    getToken(): string | null {
        return getFromLocalStorage<string>('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private handleError(error: unknown, defaultMessage: string): never {
        if (axios.isAxiosError(error)) {
            if (error.response?.data) {
                const apiError: ApiErrorDto = error.response.data;
                const message = Array.isArray(apiError.message)
                    ? apiError.message.join(', ')
                    : apiError.message || defaultMessage;
                throw new Error(message);
            }
            if (error.code === 'ECONNREFUSED') {
                throw new Error(
                    'Cannot connect to server. Verify backend is running.'
                );
            }
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Try again.');
            }
        }
        throw new Error(defaultMessage);
    }
}

export const authService = new AuthService();
