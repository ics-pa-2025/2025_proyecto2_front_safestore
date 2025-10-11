// src/components/layout/MainLayout.tsx
import React from "react";
import "./layout.css";

import { Outlet } from "react-router-dom";
import Header from './Header.tsx';
import Nav from './Nav.tsx';
import Footer from './Footer.tsx';

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <Nav />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
