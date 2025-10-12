import { authService } from '../services/auth.service.ts';

export default function Nav() {
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };
    return (
        <nav className="nav">
            <div className="nav-links">
                <a className="nav-link" href="/home">Home</a>
                <a className="nav-link" href="/dashboard">Dashboard</a>
                <a className="nav-link" href="/products">Products</a>
                <a className="nav-link" href="/profile">Profile</a>
            </div>
            <div>
                <button
                    onClick={handleLogout}
                    type="button"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
