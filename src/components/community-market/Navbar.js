import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link 
                            to="/" 
                            className="text-pink-400 hover:text-pink-300 text-xl font-bold"
                        >
                            Marketplace
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link 
                            to="/" 
                            className="text-gray-300 hover:text-pink-400 px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                            Products
                        </Link>
                        <Link 
                            to="/addProduct" 
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Sell your Product
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link
                        to="/"
                        className="block text-gray-300 hover:text-pink-400 px-3 py-2 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                    >
                        Products
                    </Link>
                    <Link
                        to="/addProduct"
                        className="block bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                    >
                        Sell your Product
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;