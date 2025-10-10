export async function getHello(): Promise<{ message: string }> {
    const base = import.meta.env.VITE_API_URL;
    const res = await fetch(`${base}/`, {
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
