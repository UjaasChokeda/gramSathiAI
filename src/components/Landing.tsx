import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define the types for the props
interface FeatureCardProps {
  title: string;
  description: string;
  iconAlt: string;
  path: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, iconAlt, path }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-[#1c1f21] p-6 rounded-lg border border-[#444444] transition-all duration-300 hover:bg-[#232729] cursor-pointer hover:shadow-lg hover:border-[#ff1f7a] group"
      onClick={() => navigate(path)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(path);
        }
      }}
    >
      <img 
        src="https://cdn-icons-png.flaticon.com/512/3848/3848135.png" 
        alt={iconAlt} 
        className="w-12 h-12 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      />
      <h2 className="text-lg font-bold mb-3 text-[#e1e2e3] font-mono group-hover:text-[#ff1f7a] transition-colors duration-300">
        {title}
      </h2>
      <p className="text-[#888d8f] text-sm font-mono">{description}</p>
      <div className="mt-4 text-[#ff1f7a] text-sm font-mono group-hover:text-[#1f94ff] transition-colors duration-300">
        Explore →
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Smart Market",
      description: "Connect with local sellers and access fresh, locally-sourced products at competitive prices.",
      iconAlt: "MarketIcon",
      path: "/market",
    },
    {
      title: "Health Assistant",
      description: "Get personalized health insights and recommendations based on your symptoms.",
      iconAlt: "Health Icon",
      path: "/health"
    },
    {
      title: "Language Support",
      description: "Access all features in your preferred language with our seamless translation system.",
      iconAlt: "Translation Icon",
      path: "/dt"
    }
  ];

  return (
    <div className="min-h-screen bg-[#181a1b] font-mono">
      {/* Navigation */}
      <nav className="border-b border-[#444444] bg-[#1c1f21]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="text-lg font-bold text-[#ff1f7a] cursor-pointer hover:text-[#1f94ff] transition-colors duration-300"
              onClick={() => navigate('/')}>
              Rural Care
            </div>
            <div className="hidden md:flex gap-8">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => navigate(feature.path)}
                  className="text-[#888d8f] hover:text-[#ff1f7a] transition-colors duration-300 text-sm"
                >
                  {feature.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#1c1f21] to-[#181a1b]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Rural Care & Agriculture Assistant
          </h1>
          <p className="text-[#888d8f] text-lg mb-8">
            Digital solutions for farming success and healthcare management
          </p>
          <button 
            onClick={() => navigate('/get-started')}
            className="bg-gradient-to-r from-[#ff1f7a] to-[#1f94ff] hover:from-[#1f94ff] hover:to-[#ff1f7a] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-sm"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-[#181a1b]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#1c1f21] to-[#181a1b] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
        <button 
            onClick={() => navigate('/community')}
            className="bg-gradient-to-r from-[#ff1f7a] to-[#1f94ff] hover:from-[#1f94ff] hover:to-[#ff1f7a] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-sm"
          >
            Join our Community
          </button>
          <p className="text-[#888d8f] mb-8 mt-5">
            Experience the benefits of our digital platform
          </p>
          
        </div>
      </section>
    </div>
  );
};

export default LandingPage;