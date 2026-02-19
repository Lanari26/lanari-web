import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const SHOW_MS = 1500;
const EXIT_MS = 400;

export default function LoadingScreen({ onDone }) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => setExiting(true), SHOW_MS);
        const doneTimer = setTimeout(() => onDone(), SHOW_MS + EXIT_MS);
        return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
    }, [onDone]);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
                backgroundColor: '#0a0e1a',
                opacity: exiting ? 0 : 1,
                transition: `opacity ${EXIT_MS}ms ease`,
                pointerEvents: exiting ? 'none' : 'all',
            }}
        >
            <div
                className="relative flex items-center justify-center w-20 h-20"
                style={{ animation: 'breathe 1.8s ease-in-out infinite' }}
            >
                {/* Spinning ring */}
                <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                        border: '3px solid rgba(255,255,255,0.08)',
                        borderTopColor: '#60a5fa',
                        borderRightColor: '#a78bfa',
                    }}
                />
                {/* Logo in center */}
                <img
                    src={logo}
                    alt="Lanari"
                    className="w-11 h-11 rounded-xl object-cover shadow-lg shadow-purple-500/20"
                />
            </div>
        </div>
    );
}
