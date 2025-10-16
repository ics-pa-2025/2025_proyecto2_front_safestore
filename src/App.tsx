import {BrowserRouter as Router,} from 'react-router-dom';
import './App.css';
import './services/api.ts';
import {AppRoutes} from "../routes/AppRoutes.tsx";

function App() {
    return (
            <Router>
                <AppRoutes/>
            </Router>
    );
}

export default App;
