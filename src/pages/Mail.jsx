import React from 'react';

export default function Mail() {
    return (
        <div className="min-h-screen py-24 px-6 flex items-center justify-center">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 text-red-500">
                        ✉️
                    </div>
                    <h1 className="text-2xl font-bold text-white">Lanari Mail</h1>
                    <p className="text-gray-400">Secure corporate email login</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white" placeholder="you@lanari.rw" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input type="password" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white" placeholder="••••••••" />
                    </div>
                    <button className="w-full py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}
