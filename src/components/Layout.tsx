import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="min-h-screen bg-white w-full">
            <header className="w-full border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <Link to="/" className="text-2xl font-serif font-bold text-gray-900 hover:text-gray-700">
                        Essays
                    </Link>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8 w-full">
                <Outlet />
            </main>
        </div>
    );
} 