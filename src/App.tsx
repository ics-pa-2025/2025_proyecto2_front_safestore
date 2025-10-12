import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Register } from './components/pages/Register/register';
import MainLayout from './layout/MainLayout.tsx';
import { Login } from './components/pages/login/login';
import ProtectedRoute from './guards/ProtectedRoute.tsx';
import { Dashboard } from './components/pages/dashboard/dashboard.tsx';
import { Profile } from './components/pages/profile/profile.tsx';
import { Product } from './components/pages/products/product.tsx';
import { Home } from './components/pages/home/home.tsx';
// Importar para debugging automático
import './services/api.ts';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<Home />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Product />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;