import { Link } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { BookOpen, Zap, Search } from 'lucide-react';

export const Navbar = () => {
    const location = useLocation();
    const navLinks = [
        { to: "/", label: "หน้าหลัก" },
        { to: "/about", label: "เกี่ยวกับเรา" },
    ];

    return (
        <nav
            aria-label="main navigation"
            className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50"
        >
            <div className="mx-auto max-w-5xl w-full px-4 h-full flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    Traffic<span className="text-blue-700">LawAI</span>
                </Link>

                <ul className="flex space-x-1" role="list">
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                aria-current={location.pathname === to ? "page" : undefined}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-700
                                    ${location.pathname === to
                                        ? "text-blue-700 underline underline-offset-4"
                                        : "text-gray-600"
                                    }`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <ul className="flex space-x-3" role="list">
                    <li>
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/register"
                            className="px-4 py-2 border border-gray-300 hover:border-blue-700 hover:text-blue-700 text-sm font-medium rounded-md transition-colors"
                        >
                            สมัครสมาชิก
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};