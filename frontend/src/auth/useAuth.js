import { useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL;

export function useAuth() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Session expired');
            const data = await res.json();
            setUser(data.user);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        user,
        isAuthenticated: !!user,
        role: user?.role,
        loading,
        refresh,
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };
}
