import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '@/lib/api';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      await subscribeNewsletter({ email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    Services: [
      { name: 'Investment Advisory', path: '/services/investment-advisory' },
      { name: 'Market Research', path: '/services/market-research' },
      { name: 'Corporate Strategy', path: '/services/corporate-strategy' },
      { name: 'Risk Analysis', path: '/services/risk-analysis' },
    ],
    Regions: [
      { name: 'GCC Markets', path: '/markets-insights/gcc' },
      { name: 'North Africa', path: '/markets-insights/north-africa' },
      { name: 'Levant', path: '/markets-insights/levant' },
    ],
    Industries: [
      { name: 'Energy', path: '/industries/energy' },
      { name: 'Finance', path: '/industries/finance' },
      { name: 'Infrastructure', path: '/industries/infrastructure' },
      { name: 'Technology', path: '/industries/technology' },
      { name: 'Real Estate', path: '/industries/real-estate' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-xl">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Informed
              </h3>
              <p className="text-gray-400">
                Get the latest MENA market insights, analysis, and reports delivered to your inbox.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <form onSubmit={handleNewsletterSubmit} className="sm:flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-md sm:rounded-r-none bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md sm:rounded-l-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubscribing ? 'Subscribing...' : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div>
              <Link to="/" className="text-2xl font-bold text-white">
                MENALANE
              </Link>
              <p className="mt-2 text-sm text-gray-400">
                Global Insight. Regional Power.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                © {new Date().getFullYear()} MENALANE. All rights reserved.
              </p>
            </div>

            <div className="mt-8 lg:mt-0">
              <div className="flex items-center space-x-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:info@menalane.com"
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                <a
                  href="mailto:info@menalane.com"
                  className="hover:text-white transition-colors"
                >
                  info@menalane.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
