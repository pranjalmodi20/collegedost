import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-orange"></div></div>;
    }

    if (user && user.role === 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default AdminRoute;
