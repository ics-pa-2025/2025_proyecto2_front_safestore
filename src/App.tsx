import {BrowserRouter as Router, Navigate, Route, Routes,} from 'react-router-dom';
import './App.css';
import {Register} from './components/pages/Register/register';
import MainLayout from './layout/MainLayout.tsx';
import {Login} from './components/pages/login/login';
import ProtectedRoute from './guards/ProtectedRoute.tsx';
import {Dashboard} from './components/pages/dashboard/dashboard.tsx';
import {Profile} from './components/pages/profile/profile.tsx';
import {Product} from './components/pages/products/product.tsx';
// Importar para debugging automático
import './services/api.ts';
import {Brands} from './components/pages/brands/brands.tsx';
import {BrandsForm} from './components/pages/brands/brands-form.tsx';
import {Users} from './components/pages/users/users.tsx';
import {UserForm} from './components/pages/users/user-form.tsx';
import {ProductForm} from './components/pages/products/product-form.tsx';
import {Suppliers} from './components/pages/suppliers/suppliers.tsx';
import {SupplierForm} from './components/pages/suppliers/supplier-form.tsx';
import {Sell} from "./components/pages/sell/sell.tsx";
import {SellForm} from "./components/pages/sell/sell-form.tsx";

function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>

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
                        <Route path="products" element={<Product/>}/>
                        <Route path="product-form" element={<ProductForm/>}/>
                        <Route path="profile" element={<Profile/>}/>
                        <Route path="brands" element={<Brands/>}/>
                        <Route path="brands-form" element={<BrandsForm/>}/>
                        <Route path="suppliers" element={<Suppliers/>}/>
                        <Route path="supplier-form" element={<SupplierForm/>}/>
                        <Route path="users" element={<Users/>}/>
                        <Route path="user-form" element={<UserForm/>}/>
                        <Route path="sell" element={<Sell/>}/>
                        <Route path="sell-form" element={<SellForm/>}/>

                    </Route>

                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </Router>
    );
}

export default App;
