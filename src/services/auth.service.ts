import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {ApiErrorDto} from "../dto/api-error.dto.ts";
import type {AuthResponse} from "../dto/auth/auth-response.dto.ts";

const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL + "/auth",
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
            const payload = {email, password};
            const response: AxiosResponse<AuthResponse> = await authApi.post('/login', payload);

            const data = response.data || {};
            // Accept both accessToken or token fields
            const token = data.accessToken || data.token;
            if (token) {
                this.setToken(token);
            }

            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data) {
                    const apiError: ApiErrorDto = error.response.data;
                    throw new Error(apiError.message || 'Login failed');
                }
                if (error.code === 'ECONNREFUSED') {
                    throw new Error('Cannot connect to server. Verify backend is running.');
                }
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Request timed out. Try again.');
                }
            }
            throw new Error('Unexpected error during login');
        }
    }

    async register(email: string, password: string): Promise<AuthResponse> {
        try {
            const payload = {email, password};
            const response: AxiosResponse<AuthResponse> = await authApi.post('/register', payload);

            const data = response.data || {};
            // Accept both accessToken or token fields
            const token = data.accessToken || data.token;
            if (token) {
                this.setToken(token);
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
                    throw new Error('Cannot connect to server. Verify backend is running.');
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
export default authService;