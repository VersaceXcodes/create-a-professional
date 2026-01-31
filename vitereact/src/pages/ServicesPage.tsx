import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { TrendingUp, FileText, Users, Shield, ArrowRight } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      slug: 'investment-advisory',
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Investment Advisory',
      shortDesc: 'Strategic guidance for institutional investors and asset managers',
      description: 'Our Investment Advisory service provides institutional investors, asset managers, and high-net-worth individuals with strategic guidance on MENA market opportunities. We offer portfolio strategy, deal sourcing, due diligence support, and market entry advisory.',
      benefits: [
        'Access to proprietary deal flow and opportunities',
        'Deep sector and regional expertise',
        'On-the-ground intelligence and networks',
        'Customized investment strategies',
      ],
    },
    {
      slug: 'market-research',
      icon: <FileText className="w-12 h-12" />,
      title: 'Market Research & Reports',
      shortDesc: 'Comprehensive analysis and intelligence on MENA markets',
      description: 'Our research platform delivers comprehensive market reports, sector analysis, economic outlooks, and data-driven insights. Subscribe to regular updates or commission bespoke research tailored to your specific requirements.',
      benefits: [
        'Regular market outlook reports',
        'Sector-specific deep dives',
        'Economic data and forecasts',
        'Custom research projects',
      ],
    },
    {
      slug: 'corporate-strategy',
      icon: <Users className="w-12 h-12" />,
      title: 'Corporate Strategy & Consulting',
      shortDesc: 'Strategic consulting for businesses entering MENA',
      description: 'We help corporations develop and execute strategies for entering and scaling in MENA markets. Our services include market entry strategy, partnership identification, regulatory navigation, and operational setup guidance.',
      benefits: [
        'Market entry and expansion strategies',
        'Local partner identification',
        'Regulatory and compliance guidance',
        'Operational setup support',
      ],
    },
    {
      slug: 'risk-analysis',
      icon: <Shield className="w-12 h-12" />,
      title: 'Risk & Geopolitical Analysis',
      shortDesc: 'Comprehensive risk assessment for MENA operations',
      description: 'Our risk analysis service provides comprehensive assessment of political, economic, and operational risks across MENA markets. We monitor geopolitical developments, regulatory changes, and market stability factors.',
      benefits: [
        'Political and geopolitical risk assessment',
        'Economic and market risk analysis',
        'Regulatory and compliance risk monitoring',
        'Crisis monitoring and early warning',
      ],
    },
  ];

  return (
    <PageLayout
      title="Services – Expert MENA Advisory & Research | MENALANE"
      description="Investment advisory, market research, corporate strategy, and risk analysis services for MENA markets."
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-blue-100">
              Comprehensive solutions for investors and businesses operating in MENA markets
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-900 mb-4">
                  {service.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {service.shortDesc}
                </p>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center text-blue-900 font-semibold hover:text-blue-700 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="lg:flex">
                  <div className={`lg:w-1/3 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-8 ${
                    index % 2 === 0 ? 'lg:order-first' : 'lg:order-last'
                  }`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  <div className="lg:w-2/3 p-8 lg:p-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-lg text-gray-700 mb-6">
                      {service.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-900 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
                    >
                      View Service Details
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us to discuss how we can support your MENA market initiatives
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-md hover:bg-blue-50 transition-colors"
          >
            Contact Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServicesPage;
