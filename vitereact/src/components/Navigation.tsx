import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { 
      name: 'Markets & Insights', 
      path: '/markets-insights',
      submenu: [
        { name: 'GCC', path: '/markets-insights/gcc' },
        { name: 'North Africa', path: '/markets-insights/north-africa' },
        { name: 'Levant', path: '/markets-insights/levant' },
      ]
    },
    { name: 'Services', path: '/services' },
    { name: 'Industries', path: '/industries' },
    { name: 'News & Reports', path: '/news-reports' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl lg:text-3xl font-bold text-blue-900">
                MENALANE
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-blue-900 flex items-center ${
                      location.pathname === link.path
                        ? 'text-blue-900'
                        : 'text-gray-700'
                    }`}
                  >
                    {link.name}
                    {link.submenu && <ChevronDown className="ml-1 w-4 h-4" />}
                  </Link>
                  
                  {link.submenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.name}
                          to={sublink.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-900 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-blue-900 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <Link
                      to={link.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'bg-blue-50 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {link.submenu && (
                      <div className="ml-4 mt-2 space-y-2">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.name}
                            to={sublink.path}
                            className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles, reports, and insights..."
                    className="flex-1 outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed nav */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navigation;
