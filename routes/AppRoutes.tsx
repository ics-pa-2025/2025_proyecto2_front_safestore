// routes/AppRoutes.tsx
import {Navigate, Route, Routes} from 'react-router-dom';
import {Register} from "../src/components/pages/Register/register.tsx";
import MainLayout from '../src/layout/MainLayout';
import {Login} from '../src/components/pages/login/login';
import ProtectedRoute from '../src/guards/ProtectedRoute';
import {Dashboard} from '../src/components/pages/dashboard/dashboard';
import {Profile} from '../src/components/pages/profile/profile';
import {Product} from '../src/components/pages/products/product';
import {Brands} from '../src/components/pages/brands/brands';
import {BrandsForm} from '../src/components/pages/brands/brands-form';
import {Users} from '../src/components/pages/users/users';
import {UserForm} from '../src/components/pages/users/user-form';
import {ProductForm} from '../src/components/pages/products/product-form';
import {Suppliers} from '../src/components/pages/suppliers/suppliers';
import {SupplierForm} from '../src/components/pages/suppliers/supplier-form';
import {Sell} from '../src/components/pages/sell/sell';
import {SellForm} from '../src/components/pages/sell/sell-form';
import {Lines} from '../src/components/pages/lines/lines';
import {LineForm} from '../src/components/pages/lines/line-form';

export const AppRoutes = () => {
    return (
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                {/* Rutas protegidas */}
                <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout/>
                            </ProtectedRoute>
                        }
                >
                    <Route index element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>

                    {/* Products */}
                    <Route path="products" element={<Product/>}/>
                    <Route path="product-form" element={<ProductForm/>}/>

                    {/* Brands */}
                    <Route path="brands" element={<Brands/>}/>
                    <Route path="brands-form" element={<BrandsForm/>}/>

                    {/* Suppliers */}
                    <Route path="suppliers" element={<Suppliers/>}/>
                    <Route path="supplier-form" element={<SupplierForm/>}/>

                    {/* Users */}
                    <Route path="users" element={<Users/>}/>
                    <Route path="user-form" element={<UserForm/>}/>

                    {/* Sell */}
                    <Route path="sell" element={<Sell/>}/>
                    <Route path="sell-form" element={<SellForm/>}/>

                    {/* Lines */}
                    <Route path="lines" element={<Lines/>}/>
                    <Route path="line-form" element={<LineForm/>}/>

                    {/* Profile */}
                    <Route path="profile" element={<Profile/>}/>
                </Route>

                {/* Ruta catch-all */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
    );
};