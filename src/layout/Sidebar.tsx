import { authService } from '../services/auth.service.ts';

export default function Sidebar() {
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };
    return (
        <nav className="sidebar">
            <div className="sidebar-links">
                <a className="sidebar-link" href="/home">Home</a>
                <a className="sidebar-link" href="/dashboard">Dashboard</a>
                <a className="sidebar-link" href="/products">Products</a>
                <a className="sidebar-link" href="/profile">Profile</a>
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
