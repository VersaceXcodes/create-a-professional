import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Zap, Building2, Cpu, Home as HomeIcon, Landmark, ArrowRight } from 'lucide-react';

const IndustriesPage: React.FC = () => {
  const industries = [
    {
      slug: 'energy',
      icon: <Zap className="w-12 h-12" />,
      title: 'Energy',
      description: 'Oil & gas, renewable energy, and power generation across MENA - the world\'s energy heartland.',
      highlights: ['Renewable Energy Transition', 'Oil & Gas Leadership', 'Green Hydrogen', 'Power Infrastructure'],
    },
    {
      slug: 'finance',
      icon: <Landmark className="w-12 h-12" />,
      title: 'Finance',
      description: 'Banking, fintech, capital markets, and financial services driving regional economic growth.',
      highlights: ['Islamic Finance', 'Fintech Innovation', 'Capital Markets', 'Digital Banking'],
    },
    {
      slug: 'infrastructure',
      icon: <Building2 className="w-12 h-12" />,
      title: 'Infrastructure',
      description: 'Construction, transportation, and mega-projects transforming the region\'s physical landscape.',
      highlights: ['Mega Projects', 'Smart Cities', 'Transport Networks', 'Urban Development'],
    },
    {
      slug: 'technology',
      icon: <Cpu className="w-12 h-12" />,
      title: 'Technology',
      description: 'Digital transformation, startups, and tech innovation emerging across MENA markets.',
      highlights: ['Startup Ecosystems', 'Digital Transformation', 'E-commerce', 'AI & Innovation'],
    },
    {
      slug: 'real-estate',
      icon: <HomeIcon className="w-12 h-12" />,
      title: 'Real Estate',
      description: 'Property development, investment, and real estate markets across commercial and residential sectors.',
      highlights: ['Luxury Development', 'Commercial RE', 'REITs', 'Tourism Properties'],
    },
  ];

  return (
    <PageLayout
      title="Industries – MENA Sector Analysis | MENALANE"
      description="Comprehensive insights across key MENA industries: Energy, Finance, Infrastructure, Technology, and Real Estate."
    >
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Industries</h1>
            <p className="text-xl text-blue-100">
              Sector-specific insights and analysis across key MENA industries
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/industries/${industry.slug}`}
                  className="block h-full bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all group"
                >
                  <div className="text-blue-900 mb-4 group-hover:scale-110 transition-transform">
                    {industry.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                    {industry.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{industry.description}</p>
                  <div className="space-y-2 mb-4">
                    {industry.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-900 rounded-full mr-2" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-blue-900 font-medium">
                    View Insights
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default IndustriesPage;
