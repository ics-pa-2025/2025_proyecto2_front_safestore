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
