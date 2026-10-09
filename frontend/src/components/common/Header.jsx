import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { PRODUCTS } from '../../data/products';

export default function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    });

    const link = ({ isActive }) =>
        `text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`;

    return (
        <nav
            className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(21, 24, 33, 0.9)', borderBottom: '1px solid rgba(75, 85, 99, 0.4)' }}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
                <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                    <img src={logo} alt="Lanari" className="w-10 h-10 rounded-xl" />
                    <span className="text-lg font-bold tracking-tight text-white">Lanari</span>
                </Link>

                <div className="hidden lg:flex items-center gap-7">
                    {PRODUCTS.map((p) => (
                        <NavLink key={p.slug} to={p.path} className={link}>{p.name}</NavLink>
                    ))}
                    <NavLink to="/about" className={link}>About</NavLink>
                    <NavLink to="/contact" className={link}>Contact</NavLink>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-full border border-gray-600 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">Dashboard</button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-full border border-gray-600 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">Sign in</button>
                    )}
                    <button
                        className="lg:hidden p-2 text-gray-300"
                        aria-label="Menu"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>
            </div>

            {open && (
                <div className="lg:hidden max-w-6xl mx-auto pt-4 flex flex-col gap-4">
                    {PRODUCTS.map((p) => (
                        <NavLink key={p.slug} to={p.path} className={link} onClick={() => setOpen(false)}>{p.name}</NavLink>
                    ))}
                    <NavLink to="/about" className={link} onClick={() => setOpen(false)}>About</NavLink>
                    <NavLink to="/contact" className={link} onClick={() => setOpen(false)}>Contact</NavLink>
                </div>
            )}
        </nav>
    );
}
