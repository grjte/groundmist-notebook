import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
    return (
        <div className="min-h-screen bg-white w-full">
            <Header />
            <main className="container mx-auto px-4 py-8 w-full">
                <Outlet />
            </main>
        </div>
    );
} 