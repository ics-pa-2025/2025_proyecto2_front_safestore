import axios from 'axios';
import { getApiUrl } from '../services/environment.ts';
import { getFromLocalStorage } from '../helpers/localStorage.helper.ts';

function getBackApiUrl(): string {
    const fromWindow = (window as any).__ENV?.VITE_API_URL;
    const fromBuild = (import.meta as any).env?.VITE_API_URL;

    const coreUrl = getApiUrl();
    const authFallback = coreUrl.replace(':3000', ':3001');

    return fromWindow || fromBuild || authFallback;
}

export const backApi = axios.create({
    baseURL: getBackApiUrl(),
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

const token = getFromLocalStorage<string>('token');
if (token) {
    backApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Manejo global de errores
backApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Auth API error:', error);
        return Promise.reject(error);
    }
);
