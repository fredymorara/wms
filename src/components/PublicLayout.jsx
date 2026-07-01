import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/kabu-logo-Beveled-shadow.png';

const PublicLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-[#800000] selection:text-white">
            {/* Header / Navbar */}
            <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-4">
                            <img src={logo} alt="Kabarak University" className="h-12" />
                            <span className="hidden md:block text-[#800000] font-bold text-xl tracking-tight">KABU Student Welfare</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-zinc-600 hover:text-[#800000] font-medium transition-colors">
                            Log In
                        </Link>
                        <Link to="/signup">
                            <Button type="primary" className="bg-[#b5e487] text-[#800000] border-none font-semibold shadow-sm hover:opacity-90 rounded-full px-6 h-10">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t-4 border-[#b5e487] py-12 px-6 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Kabarak University Logo" className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <span className="font-semibold text-zinc-400">Student Welfare System</span>
                    </div>
                    <div className="text-zinc-400 text-sm">
                        © {new Date().getFullYear()} Kabarak University Team Project. All rights reserved.
                    </div>
                    <div className="flex gap-4 text-zinc-400">
                        <Link to="/login" className="hover:text-[#800000] transition-colors">Admin Portal</Link>
                        <span>&middot;</span>
                        <a href="#" className="hover:text-[#800000] transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
