import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';
import './App.css';
import { Register } from './components/pages/Register/register';
import MainLayout from './layout/MainLayout.tsx';
import { Login } from './components/pages/login/login';
import ProtectedRoute from './guards/ProtectedRoute.tsx';
import { Dashboard } from './components/pages/dashboard/dashboard.tsx';
import { Profile } from './components/pages/profile/profile.tsx';
import { Product } from './components/pages/products/product.tsx';
// Importar para debugging automático
import './services/api.ts';
import { Brands } from './components/pages/brands/brands.tsx';
import { BrandsForm } from './components/pages/brands/brands-form.tsx';
import { Users } from './components/pages/users/users.tsx';
import { ProductFormPage } from './components/pages/products/product-form-page.tsx';

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
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Product />} />
                    <Route path="products-form" element={<ProductFormPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="brands" element={<Brands />} />
                    <Route path="brands-form" element={<BrandsForm />} />
                    <Route path="users" element={<Users />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
