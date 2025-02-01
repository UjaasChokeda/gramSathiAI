import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categories = [...new Set(products.map((product) => product.category))];

    const filteredProducts = products.filter(
        (product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? product.category === selectedCategory : true)
    );

    return (
        <div className="min-h-screen bg-neutral-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            selectedCategory === null
                                ? 'bg-pink-600 text-white'
                                : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                selectedCategory === category
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-pink-500 text-gray-100 placeholder-gray-500"
                    />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-neutral-800 rounded-xl overflow-hidden transition-transform duration-200 hover:transform hover:scale-105"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-100 mb-2">
                                    {product.productName}
                                </h3>
                                <p className="text-pink-400 text-xl font-bold mb-4">
                                    ₹{product.price}
                                </p>
                                <Link
                                    to={`/market/products/${product.id}`}
                                    className="block"
                                >
                                    <button className="w-full bg-neutral-700 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                theme="dark"
                toastClassName="bg-neutral-800 text-gray-100"
            />
        </div>
    );
};

export default ProductList;