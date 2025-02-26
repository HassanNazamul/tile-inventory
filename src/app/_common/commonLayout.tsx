/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode } from 'react';
import Header from './header';
// import Sidebar from './sidebar';
import Footer from './footer';


interface CommonLayoutProps {
    children: ReactNode;
    pageName: string;
}

function CommonLayout({ children, pageName }: CommonLayoutProps) {
    return (
        <>
            <Header />

            {/* <Sidebar /> */}

            {/* <main id="main" className="main">
                <div className="pagetitle">
                    <h1>{pageName}</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">Home</a>
                            </li>
                            <li className="breadcrumb-item active">{pageName}</li>
                        </ol>
                    </nav>
                </div> */}

            {children}

            {/* </main> */}

            <Footer />
        </>

    )
}

export default CommonLayout