import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useAuthAlert } from "../hooks/useAuthAlert";

interface ProtectedRouteProps {
    children: React.JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();
    const { showUnauthorizedAlert } = useAuthAlert();

    useEffect(() => {
        if (!isAuthenticated) {
            showUnauthorizedAlert();
        }
    }, [isAuthenticated, showUnauthorizedAlert]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;