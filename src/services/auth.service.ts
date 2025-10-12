import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { ApiErrorDto } from '../dto/api-error.dto.ts';
import type { AuthResponse } from '../dto/auth/auth-response.dto.ts';
import { getApiUrl } from './environment';

// Función para obtener URL del microservicio de auth
function getAuthApiUrl(): string {
    // runtime config (injected as env.js)
    const fromWindow = (window as any).__ENV?.VITE_AUTH_API_URL;
    const fromBuild = (import.meta as any).env?.VITE_AUTH_API_URL;
    // Fallback: usar misma URL que el backend core pero cambiar puerto
    const coreUrl = getApiUrl();
    const authFallback = coreUrl.replace(':3000', ':3001');
    return fromWindow || fromBuild || authFallback;
}

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
            const payload = { email, password };
            const response: AxiosResponse<AuthResponse> = await authApi.post(
                '/login',
                payload
            );

            const data = response.data || {};
            // Accept both accessToken or token fields
            const token = data.accessToken || data.token;
            if (token) {
                this.setToken(token);
            }

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data) {
                    const apiError: ApiErrorDto = error.response.data;
                    throw new Error(apiError.message || 'Login failed');
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
            throw new Error('Unexpected error during login');
        }
    }

    async register(
        email: string,
        password: string,
        fullname: string
    ): Promise<AuthResponse> {
        try {
            const payload = { email, password, fullname };
            const response: AxiosResponse<AuthResponse> = await authApi.post(
                '/register',
                payload
            );

            const data = response.data || {};
            // Accept both accessToken or token fields
            const token = data.accessToken || data.token;
            if (token) {
                this.setToken(token);
            }

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data) {
                    const apiError: ApiErrorDto = error.response.data;
                    // Handle validation error messages array
                    if (Array.isArray(apiError.message)) {
                        throw new Error(apiError.message.join(', '));
                    }
                    throw new Error(apiError.message || 'Register failed');
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
            throw new Error('Unexpected error during register');
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete authApi.defaults.headers.common['Authorization'];
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
        authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
