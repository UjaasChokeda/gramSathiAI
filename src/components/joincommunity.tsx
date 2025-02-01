import React from 'react';
import { useNavigate } from 'react-router-dom';

const JoinCommunityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#ff007a] font-mono">
      {/* Header */}
      <nav className="border-b border-[#444444] bg-[#1c1f21]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="text-lg font-extrabold text-[#ff1f7a] cursor-pointer hover:text-[#1f94ff] transition-colors duration-300"
              onClick={() => navigate('/')}
            >
              Rural Care
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
            Join Our Community
          </h1>
          <p className="text-[#a1a5a8] text-lg mb-8">
            Become a part of our growing community and experience the benefits of digital solutions.
          </p>
          {/* <button 
            onClick={() => navigate('/get-started')}
            className="bg-gradient-to-r from-[#ff1f7a] to-[#1f94ff] hover:from-[#1f94ff] hover:to-[#ff1f7a] text-white font-extrabold py-3 px-8 rounded-xl transition-all duration-300 text-sm shadow-lg"
          >
            Get Started
          </button> */}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-[#181a1b]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#1c1f21] to-[#3a3b3d] p-8 rounded-2xl border border-[#444444] shadow-lg">
              <h3 className="text-xl font-extrabold text-white mb-4">Connect with Experts</h3>
              <p className="text-[#a1a5a8] font-mono">
                Access a network of professionals and experts ready to assist you.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1c1f21] to-[#3a3b3d] p-8 rounded-2xl border border-[#444444] shadow-lg">
              <h3 className="text-xl font-extrabold text-white mb-4">Smart Solutions</h3>
              <p className="text-[#a1a5a8] font-mono">
                Get personalized recommendations and innovative tools.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1c1f21] to-[#3a3b3d] p-8 rounded-2xl border border-[#444444] shadow-lg">
              <h3 className="text-xl font-extrabold text-white mb-4">Stay Informed</h3>
              <p className="text-[#a1a5a8] font-mono">
                Receive updates and insights tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#1c1f21] to-[#181a1b] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Ready to Join?
          </h2>
          <p className="text-[#a1a5a8] mb-8">
            Experience the future of rural care and digital agriculture with us.
          </p>
          <div className="flex justify-center space-x-4">
            
            <a href='https://discord.gg/FZHqV6Uf' target='_blank' rel='noreferrer'>
            <img 
            src='https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png'
            alt='discord'
            width={75}
            height={75}/>
            </a>

            
            <a href='https://instagram.com/rollin_sap' target='_blank' rel='noreferrer'>
            <img
            src='https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg'
            alt='instagram'
            width={60}
            height={60}/>
            </a>

        </div>

        </div>
      </section>
    </div>
  );
};

export default JoinCommunityPage;
