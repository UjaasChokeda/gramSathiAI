import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList2 = () => {
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-8 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-gray-800 placeholder-gray-400"
                />

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            selectedCategory === null
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                    {product.productName}
                                </h3>
                                <p className="text-blue-500 text-lg font-medium mb-4">
                                    ₹{product.price}
                                </p>
                                <Link
                                    to={`/market2/products2/${product.id}`}
                                    className="block w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                theme="light"
            />
        </div>
    );
};

export default ProductList2;