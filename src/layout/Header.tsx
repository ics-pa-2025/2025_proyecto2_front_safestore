import { Shield } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <Shield className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">SafeStore</h1>
                        <h1 className="text-lg font-semibold text-gray-900 sm:hidden">SS</h1>
                    </div>
                </div>
            </div>
        </header>
    );
}
