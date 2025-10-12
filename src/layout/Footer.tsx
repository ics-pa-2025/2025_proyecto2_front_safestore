export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 z-30">
            <div className="px-6 py-4">
                <p className="text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} SafeStore. All rights reserved.
                </p>
            </div>
        </footer>
    );
}