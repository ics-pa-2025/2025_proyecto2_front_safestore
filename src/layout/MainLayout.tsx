// src/components/layout/MainLayout.tsx
import React from "react";
import "./layout.css";

import { Outlet } from "react-router-dom";
import Header from './Header.tsx';
import Sidebar from './Sidebar.tsx';
import Footer from './Footer.tsx';

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <Sidebar />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
