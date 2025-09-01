import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../hooks/useAuth';

const Footer = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  
  const handleProtectedLink = (path, action) => {
    if (!requireAuth(action)) return;
    navigate(path);
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white pt-16 px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Top section */}
        <div className="flex flex-wrap justify-between gap-8 md:gap-6 border-b border-white/20 pb-12">
          
          {/* Brand + Description */}
          <div className="max-w-80">
            <img src={assets.logo} alt="logo" className="mb-6 h-10 md:h-12 brightness-0 invert" />
            <p className="max-w-80 mt-4 text-gray-300 leading-relaxed">
              Drive in style and comfort with our premium car rental service. Choose from a wide range of luxury and economy vehicles tailored to meet your every journey.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src={assets.instagram_logo} className="w-6 h-6 brightness-0 invert" alt="Instagram" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src={assets.facebook_logo} className="w-6 h-6 brightness-0 invert" alt="Facebook" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src={assets.twitter_logo} className="w-6 h-6 brightness-0 invert" alt="Twitter" />
              </a>
              <a href="mailto:support@luxurydrive.com" className="hover:scale-110 transition-transform duration-300">
                <img src={assets.gmail_logo} className="w-6 h-6 brightness-0 invert" alt="Email" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl text-white font-bold mb-4">Quick Links</h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link to="/cars" className="text-gray-300 hover:text-white transition-colors duration-300">Browse Cars</Link></li>
              <li><button onClick={() => handleProtectedLink('/owner/add-car', 'list your car')} className="text-gray-300 hover:text-white transition-colors duration-300 text-left bg-transparent border-none cursor-pointer">List Your Car</button></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-xl text-white font-bold mb-4">Resources</h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors duration-300">Help Center</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/insurance" className="text-gray-300 hover:text-white transition-colors duration-300">Insurance Information</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl text-white font-bold mb-4">Contact Us</h2>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li>123 Luxury Drive</li>
              <li>San Francisco, Indore </li>
              <li> + 9179276701</li>
              <li>ashutoshpatel83700@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-8">
          <p className="text-gray-400">
            © {new Date().getFullYear()} <Link to="/" className="text-white hover:text-blue-300 transition-colors duration-300">LuxuryDrive</Link>. All rights reserved.
          </p>
          <ul className="flex items-center gap-6">
            <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy</Link></li>
            <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</Link></li>
            <li><Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">Sitemap</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;

