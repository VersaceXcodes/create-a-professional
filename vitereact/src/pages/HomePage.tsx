import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, TrendingUp, FileText, Users, Shield, BarChart3, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { fetchFeaturedContent, fetchMarketHighlights } from '@/lib/api';

const HomePage: React.FC = () => {
  const { data: featuredContent, isLoading: contentLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: fetchFeaturedContent,
  });

  const { data: marketHighlights, isLoading: highlightsLoading } = useQuery({
    queryKey: ['market-highlights'],
    queryFn: () => fetchMarketHighlights(),
  });

  const services = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Investment Advisory',
      description: 'Strategic guidance for institutional investors and asset managers seeking opportunities in MENA markets.',
      link: '/services/investment-advisory',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Market Research & Reports',
      description: 'In-depth analysis and comprehensive reports on regional markets, sectors, and economic trends.',
      link: '/services/market-research',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Corporate Strategy & Consulting',
      description: 'Expert consulting for businesses entering or expanding in the MENA region.',
      link: '/services/corporate-strategy',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Risk & Geopolitical Analysis',
      description: 'Comprehensive risk assessment and geopolitical intelligence for informed decision-making.',
      link: '/services/risk-analysis',
    },
  ];

  const regions = [
    { name: 'GCC', key: 'gcc' },
    { name: 'North Africa', key: 'north_africa' },
    { name: 'Levant', key: 'levant' },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              MENALANE – Connecting Global Capital to MENA Opportunities
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl">
              Expert market intelligence, investment advisory, and strategic insights for the Middle East and North Africa region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/markets-insights"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-md hover:bg-blue-50 transition-colors"
              >
                Explore Insights
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for investors and businesses operating in MENA markets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={service.link}
                  className="block h-full p-6 bg-gray-50 rounded-lg hover:shadow-lg hover:bg-white transition-all duration-300 group"
                >
                  <div className="text-blue-900 mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center text-blue-900 font-medium">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Highlights */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Regional Market Highlights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key metrics and trends across MENA regions
            </p>
          </div>

          {highlightsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {regions.map((region) => {
                const regionHighlights = marketHighlights?.filter(h => h.region === region.key) || [];
                return (
                  <div key={region.key} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2 text-blue-900" />
                      {region.name}
                    </h3>
                    <div className="space-y-4">
                      {regionHighlights.map((highlight) => (
                        <div key={highlight.id} className="border-l-4 border-blue-900 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-700">{highlight.metric_name}</span>
                            <span className={`text-sm font-bold ${
                              highlight.trend === 'up' ? 'text-green-600' : 
                              highlight.trend === 'down' ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {highlight.metric_value}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{highlight.description}</p>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/markets-insights/${region.key}`}
                      className="mt-6 inline-flex items-center text-blue-900 font-medium hover:text-blue-700 transition-colors"
                    >
                      View Market Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Insights */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Latest analysis and reports from our experts
            </p>
          </div>

          {contentLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredContent?.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/article/${content.slug}`}
                    className="block h-full bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(content.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {content.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {content.excerpt}
                      </p>
                      <div className="flex items-center text-blue-900 font-medium text-sm">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/news-reports"
              className="inline-flex items-center px-8 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
            >
              View All Insights
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
