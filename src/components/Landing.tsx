import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Custom hook for bandwidth detection
const useBandwidthDetection = (threshold = 1) => {
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBandwidth = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch('https://www.google.com/favicon.ico');
        const endTime = performance.now();
        
        // Get content length and handle potential null
        const contentLength = response.headers.get('content-length');
        const bitsLoaded = contentLength ? parseInt(contentLength) * 8 : 8000; // fallback to 1KB if no content-length
        
        const duration = endTime - startTime;
        const speedMbps = (bitsLoaded / (1024*1024)) / (duration / 1000);
    
        if (speedMbps < threshold) {
          setIsLowBandwidth(true);
        }
      } catch (error) {
        setIsLowBandwidth(true);
      }
    };

    // Add connection change listener
    const handleConnectionChange = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || connection.effectiveType === '3g')  {
          setIsLowBandwidth(true);
          navigate('/lowbandwidthlandwidth');
        }
      }
    };

    // Check initial bandwidth
    checkBandwidth();

    // Set up network status monitoring if available
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [navigate, threshold]);

  return isLowBandwidth;
};

interface FeatureCardProps {
  title: string;
  description: string;
  iconAlt: string;
  path: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  iconAlt,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-[#1c1f21]/80 backdrop-blur-sm p-6 rounded-lg border border-[#444444] transition-all duration-300 hover:bg-[#232729]/90 cursor-pointer hover:shadow-lg hover:border-[#ff1f7a] group"
      onClick={() => navigate(path)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
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
  // Use the bandwidth detection hook with 1 Mbps threshold
  const isLowBandwidth = useBandwidthDetection(1);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n") {
        navigate("/lowbandwidthlandwidth");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  const features = [
    {
      title: "Community Market",
      description:
        "Connect with local sellers and access fresh, locally-sourced products.",
      iconAlt: "MarketIcon",
      path: "/market",
    },
    {
      title: "Doctor bhAI",
      description:
        "Get personalized health insights and recommendations based on your symptoms.",
      iconAlt: "Health Icon",
      path: "/health",
    },
    {
      title: "Baat Bandhu",
      description:
        "Talk to anyone, anywhere, anytime. Locals or Tourists, we are here to help.",
      iconAlt: "Translation Icon",
      path: "/dt",
    },
    {
      title: "Web and Form Assistance",
      description:
        "Fill out forms or navigate through web with our AI guidance via screen share.",
      iconAlt: "Form Icon",
      path: "/sa",
    },
  ];

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '[data-tour="logo"]',
          popover: {
            title: "Welcome to Rural Care",
            description:
              "Your digital platform for farming success and healthcare management.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: '[data-tour="SOS"]',
          popover: {
            title: "Emergency Services",
            description: "Click here to avail Emergency services.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="market"]',
          popover: {
            title: "Community Market",
            description:
              "Connect with local sellers and find fresh, locally-sourced products.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="health"]',
          popover: {
            title: "Doctor bhAI",
            description:
              "Get AI-powered health insights and personalized recommendations.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="language"]',
          popover: {
            title: "Language Support",
            description:
              "Use the platform in your preferred language with our translation system.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="forms"]',
          popover: {
            title: "Form Assistance",
            description:
              "Get help filling out forms with screen-sharing support.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="community"]',
          popover: {
            title: "Join Our Community",
            description:
              "Become part of our growing network of rural communities.",
            side: "top",
          },
        },
      ],
    });

    driverObj.drive();
  };

  const getLocationAndSendSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const message = `Help! I'm at https://www.google.com/maps?q=${latitude},${longitude}`;
          const contacts = ["9480801000"];

          contacts.forEach((contact) => {
            window.open(
              `https://wa.me/${contact}?text=${encodeURIComponent(message)}`,
              "_blank"
            );
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
    <div
      className="min-h-screen font-mono relative"
      style={{
        backgroundImage: 'url("/bg.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Semi-transparent overlay for entire page */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Navigation - now transparent */}
        <nav className="border-b border-[#444444]/30 bg-[#1c1f21]/30 backdrop-blur-sm fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div
                data-tour="logo"
                className="text-lg font-bold text-[#ff1f7a] cursor-pointer hover:text-[#1f94ff] transition-colors duration-300"
                onClick={() => navigate("/")}
              >
                GramSathi
              </div>
              <div data-tour="navigation" className="hidden md:flex gap-8">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(feature.path)}
                    className="text-[#e1e2e3] hover:text-[#ff1f7a] transition-colors duration-300 text-sm"
                  >
                    {feature.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 px-6 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Gram Sathi!
            </h1>
            <p className="text-[#e1e2e3] text-lg mb-8">
              Digital solutions for rural areas by team CharLog!
            </p>
            <button
              onClick={startTour}
              className="bg-gradient-to-r from-[#ff1f7a] to-[#1f94ff] hover:from-[#1f94ff] hover:to-[#ff1f7a] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-sm"
            >
              Get Started
            </button>
            <br />
            <br />
            <button
              data-tour="SOS"
              onClick={getLocationAndSendSOS}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500"
            >
              SOS Help
            </button>
          </div>
        </section>

        {/* Features Grid - now with transparent cards */}
        <section className="py-16 px-6">
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
              <div
                data-tour="forms"
                className="md:col-span-2 lg:col-span-1 md:mx-auto md:w-full max-w-sm"
              >
                <FeatureCard {...features[3]} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 text-center bg-[#1c1f21]/5 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <button
              data-tour="community"
              onClick={() => navigate("/joincommunity")}
              className="bg-gradient-to-r from-[#ff1f7a] to-[#1f94ff] hover:from-[#1f94ff] hover:to-[#ff1f7a] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-sm"
            >
              Join our Community
            </button>
            <p className="text-[#e1e2e3] mb-8 mt-5">
              Experience the benefits of our digital platform
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;