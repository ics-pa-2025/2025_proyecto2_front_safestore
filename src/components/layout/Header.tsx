export default function Header() {
    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <h1 style={{ margin: 0 }}>SafeStore</h1>
                <div>{/* placeholder for user controls */}</div>
            </div>
        </header>
    );
}
