import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';
import MainLayout from './layouts/MainLayout';
import { Register } from './pages/register';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/register" element={<Register/>} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
