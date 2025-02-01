import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "./users.json";  // Import the JSON data

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isBuyer, setIsBuyer] = useState(false); // To toggle between buyer/seller
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const userType = isBuyer ? "buyers" : "sellers";
    const user = usersData[userType].find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Redirect based on role
      if (isBuyer) {
        navigate("/market/ProductList"); // Buyer goes to addProduct page
      } else {
        navigate("/market/addProduct"); // Seller goes to ProductList page
      }
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isBuyer ? "Buyer Login" : "Seller Login"}
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <div className="mt-6">
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsBuyer(!isBuyer)}
            className="text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            {isBuyer ? "Login as Seller" : "Login as Buyer"}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LoginSignup;
