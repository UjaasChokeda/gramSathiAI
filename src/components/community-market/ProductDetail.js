import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function getProductById(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products.find(product => product.id === parseInt(id));
}

function ProductDetail() {
    const { productId } = useParams();
    const product = getProductById(productId);

    const [showContactForm, setShowContactForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="container mt-3"
            style={{
                maxWidth: '800px',
                margin: 'auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
            {product ? (
                <div>
                    <img src={product.image}
                        alt={product.productName}
                        style={{
                            maxWidth: '60%',
                            height: 'auto',
                            marginBottom: '20px'
                        }} />
                    <h1 style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}>
                        {product.productName}
                    </h1>
                    <p style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        marginBottom: '10px'
                    }}>
                        {product.description}
                    </p>
                    <p style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        marginBottom: '10px'
                    }}>
                        Price: ₹{product.price}
                    </p>
                    <p style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        marginBottom: '10px'
                    }}>
                        Seller: {product.sellerName}
                    </p>
                    <p style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        marginBottom: '10px'
                    }}>
                        Contact Details: {product.contactDetails}
                    </p>

                    {/* Dynamic map showing the seller's location */}
                    {product.location && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>Seller Location:</h3>
                            <iframe
                                width="100%"
                                height="300"
                                frameBorder="0"
                                style={{ border: '0' }}
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${product.location.longitude - 0.01},${product.location.latitude - 0.01},${product.location.longitude + 0.01},${product.location.latitude + 0.01}&layer=mapnik&marker=${product.location.latitude},${product.location.longitude}`}
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    {!showContactForm && (
                        <button className="btn btn-primary"
                            onClick={() => setShowContactForm(true)}>
                            Contact Seller
                        </button>
                    )}
                    {showContactForm && (
                        <div>
                            <h2 style={{
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '10px'
                            }}>
                                Contact Seller
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input type="text"
                                           className="form-control"
                                           id="name"
                                           name="name" 
                                           value={formData.name}
                                           onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">
                                        Email:
                                    </label>
                                    <input type="email"
                                           className="form-control" 
                                           id="email"
                                           name="email" 
                                           value={formData.email}
                                           onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">
                                        Message:
                                    </label>
                                    <textarea className="form-control"
                                              id="message" 
                                              name="message"
                                              value={formData.message}
                                              onChange={handleChange}>
                                    </textarea>
                                </div>
                                <button type="submit" 
                                        className="btn btn-primary mt-3">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
}

export default ProductDetail;