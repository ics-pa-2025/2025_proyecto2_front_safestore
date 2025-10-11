// src/components/layout/MainLayout.tsx
import React from "react";
import "./layout.css";

import { Outlet } from "react-router-dom";
import Header from './Header.tsx';
import Sidebar from './Sidebar.tsx';
import Footer from './Footer.tsx';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50/30">
            <Header />

            <div className="flex">
                <Sidebar />
                
                <main className="flex-1 ml-64 pt-16 pb-4 min-h-screen flex flex-col">
                    <div className="flex-grow p-6">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
