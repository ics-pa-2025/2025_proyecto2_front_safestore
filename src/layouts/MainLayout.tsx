import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';

export default function MainLayout({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = localStorage.getItem("user")
    const isRegistered = !!user


    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
            } catch (e) {
                if (!cancelled) setError('Error loading user data');
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

            {isRegistered && <Nav />}

            <main>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {children}
            </main>

            <Footer />
        </div>
    );
}
