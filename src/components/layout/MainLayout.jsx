import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: '#ffffff' }}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
