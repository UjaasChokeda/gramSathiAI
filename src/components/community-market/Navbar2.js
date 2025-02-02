import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar2 = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo/Brand */}
                    <div>
                        <Link 
                            to="/" 
                            className="text-gray-800 hover:text-blue-500 text-lg font-semibold"
                        >
                            Marketplace
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link 
                            to="/" 
                            className="text-gray-600 hover:text-blue-500 px-3 py-2"
                        >
                            Products
                        </Link>
                        <Link 
                            to="/addProduct" 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Sell Product
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-500 hover:text-gray-700"
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
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t`}>
                <div className="px-4 py-2 space-y-2">
                    <Link
                        to="/"
                        className="block text-gray-600 hover:text-blue-500 py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Products
                    </Link>
                    <Link
                        to="/addProduct"
                        className="block bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                        onClick={() => setIsOpen(false)}
                    >
                        Sell Product
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar2;