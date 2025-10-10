import { useEffect, useState } from 'react';
import { getHello } from '../services/api';
import Header from '../components/layout/Header';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';

export default function MainLayout({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [hello, setHello] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await getHello();
                if (!cancelled) setHello(data.message);
            } catch (e) {
                if (!cancelled) setError('Error al conectar con backend');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div id="root">
            <Header />
            <Nav />
            <main>
                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {hello && <p>{hello}</p>}
                {children}
            </main>
            <Footer />
        </div>
    );
}
