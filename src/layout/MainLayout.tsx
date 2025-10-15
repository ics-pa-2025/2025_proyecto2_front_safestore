// src/components/layout/MainLayout.tsx
import React from "react";
import "./layout.css";

import { Outlet } from "react-router-dom";
import Header from './Header.tsx';
import Sidebar from './Sidebar.tsx';
import Footer from './Footer.tsx';
import { mainLayoutStyles } from './styles.tsx';

const MainLayout: React.FC = () => {
    return (
        <div className={mainLayoutStyles.containerClass}>
            <Header />

            <div className={mainLayoutStyles.flexClass}>
                <Sidebar />
                
                <main className={mainLayoutStyles.mainClass}>
                    <div className={mainLayoutStyles.contentClass}>
                        <Outlet />
                    </div>
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default MainLayout;
