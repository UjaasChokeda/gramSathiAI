import React from 'react';
import { useNavigate } from 'react-router-dom';

const LowBandwidthLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Gram Sathi AI</h1>
      
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={() => navigate('/market')} 
          className="w-full bg-gray-200 text-black py-2 rounded-md text-lg border border-gray-400">
          Community Market
        </button>
        <button 
          onClick={() => navigate('/health')} 
          className="w-full bg-gray-200 text-black py-2 rounded-md text-lg border border-gray-400">
          Doctor bhAI
        </button>
        <button 
          onClick={() => navigate('/dt')} 
          className="w-full bg-gray-200 text-black py-2 rounded-md text-lg border border-gray-400">
          Baat Bandhu
        </button>
        <button 
          onClick={() => navigate('/sa')} 
          className="w-full bg-gray-200 text-black py-2 rounded-md text-lg border border-gray-400">
          Web & Form Assistance
        </button>
      </div>
    </div>
  );
};

export default LowBandwidthLanding;
