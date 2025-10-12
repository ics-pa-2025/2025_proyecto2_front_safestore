import { authService } from '../services/auth.service.ts';
import { 
    Home, 
    BarChart3, 
    Package, 
    User, 
    LogOut 
} from 'lucide-react';

export default function Sidebar() {
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };
    
    return (
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 z-40 flex flex-col">
            <nav className="flex-1 p-4 space-y-2">
                <div className="space-y-1">
                    <a 
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-primary-500 rounded-lg hover:bg-white hover:text-primary-600 hover:shadow-sm transition-all duration-200" 
                        href="/home"
                    >
                        <Home className="w-5 h-5 mr-3 text-primary-600" />
                        Home
                    </a>
                    <a 
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-primary-500 rounded-lg hover:bg-white hover:text-primary-600 hover:shadow-sm transition-all duration-200" 
                        href="/dashboard"
                    >
                        <BarChart3 className="w-5 h-5 mr-3 text-primary-600" />
                        Dashboard
                    </a>
                    <a 
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-primary-500 rounded-lg hover:bg-white hover:text-primary-600 hover:shadow-sm transition-all duration-200" 
                        href="/products"
                    >
                        <Package className="w-5 h-5 mr-3 text-primary-600" />
                        Products
                    </a>
                    <a 
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-primary-500 rounded-lg hover:bg-white hover:text-primary-600 hover:shadow-sm transition-all duration-200" 
                        href="/profile"
                    >
                        <User className="w-5 h-5 mr-3 text-primary-600" />
                        Profile
                    </a>
                </div>
            </nav>
            
            {/* Logout button always at bottom */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    type="button"
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-white hover:text-red-700 hover:shadow-sm transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
