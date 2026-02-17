import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, role, loading } = useAuth();

    if (loading) {
        return <div className="p-6 text-gray-400">Checking session…</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (requireAdmin && role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}
