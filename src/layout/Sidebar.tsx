import { authService } from '../services/auth.service.ts';
import {
    BarChart3,
    Layers,
    LogOut,
    Package,
    Tag,
    Truck,
    User,
    Users,
} from 'lucide-react';
import { sidebarStyles } from './styles.tsx';

export default function Sidebar() {
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    return (
        <aside className={sidebarStyles.containerClass}>
            <nav className={sidebarStyles.navClass}>
                <div className={sidebarStyles.linksClass}>
                    <a className={sidebarStyles.linkClass} href="/dashboard">
                        <BarChart3 className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Dashboard</p>
                    </a>
                    <a className={sidebarStyles.linkClass} href="/users">
                        <Users className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Users</p>
                    </a>
                    <a className={sidebarStyles.linkClass} href="/products">
                        <Package className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Products</p>
                    </a>
                    <a className={sidebarStyles.linkClass} href="/brands">
                        <Tag className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Brands</p>   
                    </a>
                    <a className={sidebarStyles.linkClass} href="/lines">
                        <Layers className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Lines</p>   
                    </a>
                    <a className={sidebarStyles.linkClass} href="/suppliers">
                        <Truck className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Suppliers</p>   
                    </a>
                    <a className={sidebarStyles.linkClass} href="/profile">
                        <User className={sidebarStyles.iconClass} />
                        <p className={sidebarStyles.iconClass}>Profile</p>
                    </a>
                </div>
            </nav>

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
