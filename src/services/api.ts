import { getApiUrl } from './environment';

export async function getHello(): Promise<{ message: string }> {
    const apiUrl = getApiUrl();
    console.log('Using API URL:', apiUrl);
    const res = await fetch(`${apiUrl}/`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
    });

    if (!res.ok) {
        throw new Error('HTTP ' + res.status);
    }

    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
        return res.json();
    }

    const text = await res.text();
    return { message: text };
}

// Función de debugging que se ejecuta automáticamente para verificar conectividad
export async function debugBackendConnection(): Promise<void> {
    try {
        console.log('🔍 [DEBUG] Testing backend connection...');
        const result = await getHello();
        console.log('✅ [DEBUG] Backend connection successful:', result);
    } catch (error) {
        console.error('❌ [DEBUG] Backend connection failed:', error);
    }
}

// Auto-ejecutar debugging en desarrollo
if (typeof window !== 'undefined') {
    // Ejecutar después de que la página cargue
    setTimeout(() => {
        debugBackendConnection();
    }, 1000);
}