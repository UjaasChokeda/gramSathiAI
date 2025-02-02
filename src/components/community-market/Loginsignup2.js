import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "./users.json";

const LoginSignuptwo = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isBuyer, setIsBuyer] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const userType = isBuyer ? "buyers" : "sellers";
    const user = usersData[userType].find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      if (isBuyer) {
        navigate("/market2/ProductList2");
      } else {
        navigate("/market2/addProduct2");
      }
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-sm w-96">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          {isBuyer ? "Buyer Login" : "Seller Login"}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>

          <button
            onClick={() => setIsBuyer(!isBuyer)}
            className="w-full text-sm text-gray-500 hover:text-blue-500"
          >
            {isBuyer ? "Switch to Seller Login" : "Switch to Buyer Login"}
          </button>

          {error && (
            <div className="p-2 bg-red-50 text-red-500 text-sm text-center rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignuptwo;