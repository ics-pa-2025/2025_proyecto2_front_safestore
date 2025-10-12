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
                
                <main className="flex-1 ml-64 pt-16 pb-20 min-h-screen">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default MainLayout;
