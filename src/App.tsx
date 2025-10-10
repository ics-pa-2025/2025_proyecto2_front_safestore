import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';
import { Register } from './components/pages/Register/register';
import MainLayout from './layouts/MainLayout';
import { Login } from './components/pages/login/login';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
