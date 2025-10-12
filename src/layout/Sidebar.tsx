import { authService } from '../services/auth.service.ts';
import { BarChart3, Home, LogOut, Package, Tag, User } from 'lucide-react';
import { sidebarStyles } from './classes.tsx';

export default function Sidebar() {
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    return (
        <aside className={sidebarStyles.containerClass}>
            <nav className={sidebarStyles.navClass}>
                <div className={sidebarStyles.linksClass}>
                    <a className={sidebarStyles.linkClass} href="/home">
                        <Home className={sidebarStyles.iconClass} />
                        Home
                    </a>
                    <a className={sidebarStyles.linkClass} href="/dashboard">
                        <BarChart3 className={sidebarStyles.iconClass} />
                        Dashboard
                    </a>
                    <a className={sidebarStyles.linkClass} href="/products">
                        <Package className={sidebarStyles.iconClass} />
                        Products
                    </a>
                    <a className={sidebarStyles.linkClass} href="/brands">
                        <Tag className={sidebarStyles.iconClass} />
                        Brands
                    </a>
                    <a className={sidebarStyles.linkClass} href="/profile">
                        <User className={sidebarStyles.iconClass} />
                        Profile
                    </a>
                </div>
            </nav>

            {/* Logout button always at bottom */}
            <div className={sidebarStyles.logoutContainerClass}>
                <button
                    onClick={handleLogout}
                    type="button"
                    className={sidebarStyles.logoutBtnClass}
                >
                    <LogOut className={sidebarStyles.iconClass} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
