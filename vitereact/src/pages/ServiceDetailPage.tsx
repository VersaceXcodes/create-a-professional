import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { TrendingUp, FileText, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const ServiceDetailPage: React.FC = () => {
  const { service } = useParams<{ service: string }>();

  const servicesData: Record<string, any> = {
    'investment-advisory': {
      icon: <TrendingUp className="w-16 h-16" />,
      title: 'Investment Advisory',
      tagline: 'Strategic guidance for MENA market investments',
      description: 'Our Investment Advisory service provides institutional investors, family offices, and asset managers with comprehensive strategic guidance on MENA market opportunities. We combine deep regional expertise with global investment standards to help clients identify, evaluate, and execute investments across the region.',
      approach: [
        'Market and sector opportunity assessment',
        'Investment thesis development',
        'Deal sourcing and screening',
        'Due diligence support and coordination',
        'Transaction structuring advice',
        'Post-investment monitoring and support',
      ],
      benefits: [
        'Access to proprietary deal flow and off-market opportunities',
        'Deep understanding of local market dynamics and regulations',
        'Strong networks across government, corporate, and financial sectors',
        'Culturally-informed advisory that bridges global and local perspectives',
        'Ongoing market intelligence and portfolio support',
      ],
      targetClients: [
        'Institutional investors and asset managers',
        'Private equity and venture capital firms',
        'Family offices and high-net-worth individuals',
        'Sovereign wealth funds and pension funds',
      ],
    },
    'market-research': {
      icon: <FileText className="w-16 h-16" />,
      title: 'Market Research & Reports',
      tagline: 'Comprehensive intelligence on MENA markets',
      description: 'Our research platform delivers comprehensive market reports, sector analysis, economic outlooks, and data-driven insights covering all major MENA markets. Whether you need regular intelligence updates or bespoke research, our team of economists and analysts provides the insights you need.',
      approach: [
        'Macro-economic analysis and forecasting',
        'Sector and industry deep-dives',
        'Company and competitive analysis',
        'Regulatory and policy monitoring',
        'Data collection and synthesis',
        'Custom research projects',
      ],
      benefits: [
        'Access to comprehensive research library',
        'Regular market outlook and update reports',
        'Proprietary data and analysis',
        'Direct access to research team for clarifications',
        'Custom research tailored to your specific needs',
      ],
      targetClients: [
        'Investment banks and brokerage firms',
        'Corporate strategy and planning teams',
        'Market research and intelligence professionals',
        'Business development and expansion teams',
      ],
    },
    'corporate-strategy': {
      icon: <Users className="w-16 h-16" />,
      title: 'Corporate Strategy & Consulting',
      tagline: 'Strategic consulting for MENA market entry and expansion',
      description: 'We help corporations develop and execute strategies for entering and scaling operations in MENA markets. Our consulting services combine strategic advisory with practical implementation support, helping you navigate the complexities of regional business environments.',
      approach: [
        'Market opportunity assessment and sizing',
        'Entry strategy and business model development',
        'Partner and stakeholder identification',
        'Regulatory and compliance navigation',
        'Operational setup and localization',
        'Go-to-market strategy and execution',
      ],
      benefits: [
        'Accelerated market entry with reduced risk',
        'Local partner identification and vetting',
        'Regulatory compliance and licensing support',
        'Cultural adaptation and localization guidance',
        'Ongoing operational and strategic support',
      ],
      targetClients: [
        'Multinational corporations entering MENA',
        'Mid-market companies expanding regionally',
        'Technology and innovation firms',
        'Industrial and manufacturing companies',
      ],
    },
    'risk-analysis': {
      icon: <Shield className="w-16 h-16" />,
      title: 'Risk & Geopolitical Analysis',
      tagline: 'Comprehensive risk assessment for MENA operations',
      description: 'Our risk analysis service provides comprehensive assessment of political, economic, regulatory, and operational risks across MENA markets. We monitor geopolitical developments, policy changes, and market stability factors to help you make informed decisions and manage risk exposure.',
      approach: [
        'Political and geopolitical risk assessment',
        'Economic and financial risk analysis',
        'Regulatory and compliance risk monitoring',
        'Operational and security risk evaluation',
        'Scenario planning and stress testing',
        'Crisis monitoring and early warning systems',
      ],
      benefits: [
        'Proactive risk identification and monitoring',
        'Timely alerts on material developments',
        'Actionable risk mitigation recommendations',
        'Scenario analysis for strategic planning',
        'Crisis preparedness and response support',
      ],
      targetClients: [
        'Institutional investors with MENA exposure',
        'Corporations with regional operations',
        'Financial institutions and lenders',
        'Insurance and risk management firms',
      ],
    },
  };

  const currentService = service ? servicesData[service] : null;

  if (!currentService) {
    return (
      <PageLayout title="Service Not Found">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/services" className="text-blue-900 hover:text-blue-700 font-medium">
            ← Back to Services
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`${currentService.title} | MENALANE Services`}
      description={currentService.tagline}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-white mb-6">
              {currentService.icon}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {currentService.title}
            </h1>
            <p className="text-xl text-blue-100">
              {currentService.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-gray-700 leading-relaxed">
            {currentService.description}
          </p>
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Approach</h2>
              <div className="space-y-4">
                {currentService.approach.map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-blue-900 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
              <div className="space-y-4">
                {currentService.benefits.map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Clients */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Who We Serve</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {currentService.targetClients.map((client: string, index: number) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-900"
              >
                <p className="text-gray-800 font-medium">{client}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Started with {currentService.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us to discuss your specific needs and how we can help
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

export default ServiceDetailPage;
