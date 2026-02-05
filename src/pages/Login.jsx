import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-24 px-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to access your Lanari account</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Sign in with Google
                    </button>
                    <button className="w-full py-3 px-4 rounded-xl bg-[#000000] text-white font-bold flex items-center justify-center gap-3 border border-gray-700 hover:bg-gray-900 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.072 17.653c.18 1.144-.067 2.378-1.282 2.378-1.125 0-1.789-1.265-1.789-2.247 0-1.205.77-2.31 1.762-2.31 1.01 0 1.558 1.012 1.31 2.18zm-2.822-6.524c.092.766-.11 1.597-.935 1.597-.753 0-1.201-.849-1.201-1.503 0-.802.518-1.55 1.187-1.55.679 0 1.047.676.95 1.456zm10.597 1.57h-1.636c-.328 0-.62-.187-.723-.464l-.99-2.66h.01c-1.328 3.535-2.652 7.07-3.955 10.54h-2.126l-1.393-3.08-2.607 3.08H5.32l3.96-4.678-2.888-8.128h2.08l1.79 5.04c.144.407.288.815.432 1.222 1.03-2.668 2.06-5.337 3.09-8.006.183-.473.366-.946.549-1.42s-.066-1.166-.887-1.166H10.14c-1.848 0-3.197 2.124-3.197 4.192 0 1.125.43 2.148.966 3.12 1.405 2.545 4.596 3.251 7.085 2.162.774-.34 1.536-.78 1.848-1.553.385-.957.534-1.95.147-2.895-.44-1.077-1.385-1.776-2.525-1.942-1.36-.197-2.733.243-3.232 1.343-.728 1.611.134 3.791 1.76 4.384.723.264 1.472.235 2.109-.17.397-.253.684-.627.85-1.025.13-.31.023-.393-.243-.306-.927.306-2.03.111-2.433-.762-.486-1.053-.16-2.65 1.05-2.65.617 0 1.077.587 1.042 1.222-.047.882-.716 1.428-1.547 1.355-.66-.057-.978-.667-1.02-1.23-.053-.733.35-1.52.92-1.96 1.258-.968 3.327-.2 3.65 1.282.25 1.157-.323 2.37-1.183 2.875-1.748 1.027-3.957-.464-4.22-2.39-.14-1.02.437-1.97 1.286-2.288 1.475-.552 3.16.593 2.89 2.13-.19.957-.98 1.637-1.928 1.42-.647-.148-.79-.9-.454-1.312.28-.344.81-.303.96.11.08.225.02.493-.196.596-.28.132-.518-.17-.463-.418.067-.297.433-.42.63-.162.135.176.012.443-.194.49-.33.076-.49-.408-.22-.644.426-.372 1.267-.091 1.25.534-.015.541-.54 1.043-1.096 1.024-1.09-.036-1.637-1.38-1.002-2.296s2.008-1.25 2.768-.426c1.192 1.29.356 3.42-1.127 3.99-2.074.796-4.27 0-4.887-2.077-.333-1.12.015-2.158.74-2.873 1.54-1.52 4.14-1.196 5.166.67.545.99.308 2.34-.378 3.14-.948 1.106-2.64 1.37-3.792.518-1.528-1.13-1.358-3.568.214-4.522 2.112-1.28 4.883.21 4.965 2.716.035 1.077-.6 2.053-1.464 2.536-1.71 1.097-3.92-.09-4.14-2.096-.106-.976.438-1.875 1.24-2.186 1.348-.52 2.86.51 2.658 1.933-.186.915-.98 1.523-1.85 1.32-.486-.113-.7-.577-.55-.957.17-.432.748-.61 1.073-.314.417.38.16 1.09-.395 1.09-.766.002-1.014-1.066-.35-1.536.883-.625 2.148.06 2.13 1.126-.016.966-.887 1.706-1.795 1.562-1.42-.224-2.1.378-2.1 1.637v.03z" /></svg>
                        Sign in with Apple
                    </button>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <div className="h-px bg-gray-700 flex-1"></div>
                        OR
                        <div className="h-px bg-gray-700 flex-1"></div>
                    </div>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="name@company.com" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot?</a>
                        </div>
                        <input type="password" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="••••••••" />
                    </div>
                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-1">
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400">
                    Don't have an account? <a href="#" className="text-white font-bold hover:underline">Sign Up</a>
                </div>
            </div>
        </div>
    );
}
