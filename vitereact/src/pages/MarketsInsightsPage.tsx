import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Globe, ArrowRight } from 'lucide-react';

const MarketsInsightsPage: React.FC = () => {
  const regions = [
    {
      key: 'gcc',
      name: 'GCC Markets',
      description: 'Gulf Cooperation Council - Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman. The region\'s economic powerhouse with massive diversification initiatives.',
      highlights: ['Vision 2030 Programs', 'Oil & Gas Leadership', 'Financial Hub Dubai/Riyadh', 'Infrastructure Mega-projects'],
    },
    {
      key: 'north-africa',
      name: 'North Africa',
      description: 'Egypt, Morocco, Algeria, Tunisia, and Libya. Gateway between Africa, Europe, and the Middle East with diverse economies and growing markets.',
      highlights: ['Renewable Energy Leadership', 'Manufacturing Hub', 'Strategic Trade Position', 'Young Demographics'],
    },
    {
      key: 'levant',
      name: 'Levant',
      description: 'Lebanon, Jordan, Syria, and Palestine. Hub of innovation and entrepreneurship with highly educated workforce and tech sector growth.',
      highlights: ['Tech Startups', 'Educated Workforce', 'Innovation Centers', 'Regional Trade Gateway'],
    },
  ];

  return (
    <PageLayout
      title="Markets & Insights – MENA Regional Analysis | MENALANE"
      description="Comprehensive market intelligence and insights covering GCC, North Africa, and Levant regions."
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <Globe className="w-16 h-16" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Markets & Insights
            </h1>
            <p className="text-xl text-blue-100">
              Comprehensive analysis and intelligence across MENA regions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Regional Market Intelligence
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our Markets & Insights platform provides deep-dive analysis of the three major MENA sub-regions, 
            each with distinct economic characteristics, opportunities, and challenges. Access comprehensive 
            market outlooks, sector analysis, economic data, and strategic insights tailored to your investment 
            and business needs.
          </p>
        </div>
      </section>

      {/* Regional Sections */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {regions.map((region, index) => (
              <motion.div
                key={region.key}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="lg:flex">
                  <div className="lg:w-2/3 p-8 lg:p-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {region.name}
                    </h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {region.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Highlights:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {region.highlights.map((highlight) => (
                          <div key={highlight} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-900 rounded-full mt-2 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      to={`/markets-insights/${region.key}`}
                      className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Explore {region.name}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                  <div className="lg:w-1/3 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-8">
                    <Globe className="w-32 h-32 text-white opacity-20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default MarketsInsightsPage;
