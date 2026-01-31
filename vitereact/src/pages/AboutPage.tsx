import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Target, Eye, Award, Globe, Shield, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Credibility',
      description: 'We maintain the highest standards of research integrity and analytical rigor, earning trust from institutional investors and corporations worldwide.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Regional Expertise',
      description: 'Deep understanding of MENA markets, local business practices, and cultural nuances that matter for successful investment and operations.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Global Standards',
      description: 'We apply international best practices and methodologies while maintaining sensitivity to regional context and requirements.',
    },
  ];

  return (
    <PageLayout
      title="About MENALANE – Expert MENA Market Intelligence"
      description="Learn about MENALANE's mission to connect global capital with MENA opportunities through expert analysis and advisory services."
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
              About MENALANE
            </h1>
            <p className="text-xl text-blue-100">
              Global Insight. Regional Power.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg"
            >
              <div className="text-blue-900 mb-4">
                <Target className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To bridge the gap between global capital markets and MENA opportunities by providing 
                world-class market intelligence, investment advisory, and strategic consulting services. 
                We empower investors and businesses with the insights they need to make informed decisions 
                in one of the world's most dynamic and rapidly evolving regions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg"
            >
              <div className="text-blue-900 mb-4">
                <Eye className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the most trusted and comprehensive source of market intelligence and strategic 
                advisory for the MENA region, recognized globally for our depth of expertise, quality of 
                analysis, and impact on successful investment outcomes. We envision a future where MENA 
                markets are fully integrated into global capital flows.
              </p>
            </motion.div>
          </div>

          <div className="mt-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why MENA Matters</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Middle East and North Africa region represents one of the world's most significant economic 
              opportunities, with a combined GDP exceeding $3.5 trillion, a young and growing population, 
              massive infrastructure development, and ongoing economic diversification initiatives. From the 
              GCC's Vision 2030 programs to North Africa's renewable energy boom and the Levant's tech 
              innovation, MENA offers unparalleled investment potential for those who understand its 
              complexities and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and relationships with clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <div className="text-blue-900 mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-blue-900 mb-4 flex justify-center">
              <Users className="w-16 h-16" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Team
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              MENALANE brings together economists, financial analysts, industry specialists, and regional 
              experts with decades of combined experience in MENA markets. Our team includes professionals 
              who have worked at leading investment banks, consulting firms, and regional institutions, 
              bringing both international expertise and on-the-ground knowledge.
            </p>
            <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
              We maintain offices in key MENA financial centers, ensuring direct access to local markets, 
              decision-makers, and real-time developments that shape regional economies.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
