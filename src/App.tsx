import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';
import { Register } from './components/pages/Register/register';
import MainLayout from './layouts/MainLayout';
import { Login } from './components/pages/login/login';
import ProtectedRoute from './guards/ProtectedRoute.tsx';
import { Home } from './components/pages/home/home.tsx';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
