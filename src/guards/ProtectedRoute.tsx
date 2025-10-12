import React from 'react';
import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";

interface ProtectedRouteProps {
    children: React.JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;