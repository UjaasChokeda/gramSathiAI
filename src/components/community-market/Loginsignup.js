import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "./users.json";

const LoginSignup = () => {
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
        navigate("/market/ProductList");
      } else {
        navigate("/market/addProduct");
      }
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1f21] font-['Space_Mono']">
      <div className="relative bg-[#232729] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#444444] backdrop-blur-sm">
        {/* Gradient Orb Decorations */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-white text-transparent bg-clip-text">
            {isBuyer ? "Buyer Login" : "Seller Login"}
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#1c1f21] border border-[#444444] rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-white placeholder-gray-500 transition-all"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1c1f21] border border-[#444444] rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-white placeholder-gray-500 transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Login
            </button>

            <button
              onClick={() => setIsBuyer(!isBuyer)}
              className="w-full text-sm text-gray-400 hover:text-pink-400 focus:outline-none transition-colors"
            >
              {isBuyer ? "Switch to Seller Login" : "Switch to Buyer Login"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;