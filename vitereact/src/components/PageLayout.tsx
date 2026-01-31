import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Navigation from './Navigation';
import Footer from './Footer';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
  structuredData?: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title = 'MENALANE – Connecting Global Capital to MENA Opportunities',
  description = 'Expert market intelligence, investment advisory, and strategic insights for the Middle East and North Africa region.',
  ogImage,
  structuredData
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
        
        {/* Organization Structured Data - Always include on all pages */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MENALANE",
            "url": "https://menalane.com",
            "logo": "https://menalane.com/logo.png",
            "description": "Expert market intelligence, investment advisory, and strategic insights for the Middle East and North Africa region.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Dubai",
              "addressCountry": "AE"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "info@menalane.com",
              "contactType": "customer service"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-colors z-40"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageLayout;
