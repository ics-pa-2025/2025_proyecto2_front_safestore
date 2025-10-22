import { getApiUrl } from '../services/environment';

function getBackApiUrl(): string {
    const fromWindow = (window as any).__ENV?.VITE_API_URL;
    const fromBuild = (import.meta as any).env?.VITE_API_URL;

    const coreUrl = getApiUrl();
    const authFallback = coreUrl.replace(':3000', ':3001');

    return fromWindow || fromBuild || authFallback;
}

export function getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    // Si ya es una URL completa, devolverla tal como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const baseUrl = getBackApiUrl();
    return `${baseUrl}${imageUrl}`;
}