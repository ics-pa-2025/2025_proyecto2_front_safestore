export default function Footer() {
    return (
        <footer
            style={{
                padding: '1rem',
                borderTop: '1px solid #eee',
                marginTop: '2rem',
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    textAlign: 'center',
                }}
            >
                <small>© {new Date().getFullYear()} SafeStore</small>
            </div>
        </footer>
    );
}
