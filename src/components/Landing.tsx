import React from 'react';
import { useNavigate } from 'react-router-dom';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
      title: "Community Market",
      description: "Connect with local sellers and access fresh, locally-sourced products.",
      iconAlt: "MarketIcon",
      path: "/market",
    },
    {
      title: "Doctor bhAI",
      description: "Get personalized health insights and recommendations based on your symptoms.",
      iconAlt: "Health Icon",
      path: "/health",
    },
    {
      title: "Baat Bandhu",
      description: "Talk to anyone, anywhere, anytime. Locals or Tourists, we are here to help.",
      iconAlt: "Translation Icon",
      path: "/dt",
    },
    {
      title: "Web and Form Assistance",
      description: "Fill out forms or navigate through web with our AI guidance via screen share.",
      iconAlt: "Form Icon",
      path: "/sa",
    }
  ];

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '[data-tour="logo"]',
          popover: {
            title: 'Welcome to Rural Care',
            description: 'Your digital platform for farming success and healthcare management.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="market"]',
          popover: {
            title: 'Community Market',
            description: 'Connect with local sellers and find fresh, locally-sourced products.',
            side: "bottom"
          }
        },
        {
          element: '[data-tour="health"]',
          popover: {
            title: 'Doctor bhAI',
            description: 'Get AI-powered health insights and personalized recommendations.',
            side: "bottom"
          }
        },
        {
          element: '[data-tour="language"]',
          popover: {
            title: 'Language Support',
            description: 'Use the platform in your preferred language with our translation system.',
            side: "bottom"
          }
        },
        {
          element: '[data-tour="forms"]',
          popover: {
            title: 'Form Assistance',
            description: 'Get help filling out forms with screen-sharing support.',
            side: "bottom"
          }
        },
        {
          element: '[data-tour="community"]',
          popover: {
            title: 'Join Our Community',
            description: 'Become part of our growing network of rural communities.',
            side: "top"
          }
        }
      ]
    });

    driverObj.drive();
  };

  // Function to get location and send SOS via WhatsApp
  const getLocationAndSendSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const message = `Help! I'm at https://www.google.com/maps?q=${latitude},${longitude}`;
          
          // List of WhatsApp contacts (replace with actual phone numbers)
          const contacts = [
            '9480801000'
          ];

          contacts.forEach(contact => {
            window.open(`https://wa.me/${contact}?text=${encodeURIComponent(message)}`, '_blank');
          });
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-[#181a1b] font-mono">
      {/* Navigation */}
      <nav className="border-b border-[#444444] bg-[#1c1f21]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div 
              data-tour="logo"
              className="text-lg font-bold text-[#ff1f7a] cursor-pointer hover:text-[#1f94ff] transition-colors duration-300"
              onClick={() => navigate('/')} >
              Rural Care
            </div>
            <div data-tour="navigation" className="hidden md:flex gap-8">
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
            Gram Sathi AI!
          </h1>
          <p className="text-[#888d8f] text-lg mb-8">
            Digital solutions for rural areas by team CharLog!
          </p>
          <button 
            onClick={startTour}
            className="bg-gradient-to-r from-[#ff1f7a] to-[#1f94ff] hover:from-[#1f94ff] hover:to-[#ff1f7a] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-sm"
          >
            Get Started
          </button>
          <br/>
          <br/>
          <button 
  onClick={getLocationAndSendSOS}
  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500"
>
  SOS Help
</button>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-[#181a1b]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div data-tour="market">
              <FeatureCard {...features[0]} />
            </div>
            <div data-tour="health">
              <FeatureCard {...features[1]} />
            </div>
            <div data-tour="language">
              <FeatureCard {...features[2]} />
            </div>
            <div data-tour="forms" className="md:col-span-2 lg:col-span-1 md:mx-auto md:w-full max-w-sm">
              <FeatureCard {...features[3]} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#1c1f21] to-[#181a1b] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <button 
            data-tour="community"
            onClick={() => navigate("/joincommunity")}
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
