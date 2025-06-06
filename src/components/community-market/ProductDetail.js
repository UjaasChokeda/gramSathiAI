import React, { useState } from "react";
import { useParams } from "react-router-dom";

function getProductById(id) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  return products.find((product) => product.id === parseInt(id));
}

function ProductDetail() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({ name: "", email: "", message: "" });
    setShowContactForm(false);
  };

  const getDirections = () => {
    setIsGettingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Open directions in Google Maps
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${product.location.latitude},${product.location.longitude}`;
        window.open(directionsUrl, '_blank');
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError("Unable to get your location. Please check your permissions.");
        setIsGettingLocation(false);
      }
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-gray-300 text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.productName}
              className="max-w-lg w-full h-auto rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-pink-400">
              {product.productName}
            </h1>

            <p className="text-gray-300 text-lg">{product.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-700 p-4 rounded-lg">
                <p className="text-pink-400 text-2xl font-bold">
                  ₹{product.price}
                </p>
              </div>
              <div className="bg-neutral-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  Seller: <span className="text-pink-400">{product.sellerName}</span>
                </p>
                <p className="text-gray-300">
                  Contact: <span className="text-pink-400">{product.contactDetails}</span>
                </p>
              </div>
            </div>

            {/* Map */}
            {product.location && (
              <div className="bg-neutral-700 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Seller Location</h3>
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="300"
                    frameBorder="0"
                    className="rounded-lg"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${product.location.latitude},${product.location.longitude}&zoom=15`}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-4">
                  <button
                    onClick={getDirections}
                    disabled={isGettingLocation}
                    className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* Location Pin Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>
                      {isGettingLocation ? "Getting Location..." : "Get Directions"}
                    </span>
                  </button>
                  {locationError && (
                    <p className="mt-2 text-red-400 text-sm">{locationError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact Form */}
            {!showContactForm ? (
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Contact Seller
              </button>
            ) : (
              <div className="bg-neutral-700 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Contact Seller</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-neutral-600 border border-neutral-500 rounded-lg focus:outline-none focus:border-pink-500 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-neutral-600 border border-neutral-500 rounded-lg focus:outline-none focus:border-pink-500 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 bg-neutral-600 border border-neutral-500 rounded-lg focus:outline-none focus:border-pink-500 text-gray-100"
                    ></textarea>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="bg-neutral-600 hover:bg-neutral-500 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;