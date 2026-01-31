import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { fetchJobs } from '@/lib/api';
import { Briefcase, MapPin, Users, Award } from 'lucide-react';

const CareersPage: React.FC = () => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  return (
    <PageLayout
      title="Careers – Join MENALANE | Expert MENA Market Intelligence"
      description="Join our team of MENA market experts and help connect global capital with regional opportunities."
    >
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Careers at MENALANE</h1>
            <p className="text-xl text-blue-100">
              Join our team of experts shaping the future of MENA markets
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Expert Team',
                description: 'Work alongside economists, analysts, and regional specialists with deep MENA expertise.',
              },
              {
                icon: <Award className="w-10 h-10" />,
                title: 'Regional Impact',
                description: 'Shape investment decisions and business strategies across one of the world\'s most dynamic regions.',
              },
              {
                icon: <Briefcase className="w-10 h-10" />,
                title: 'Career Growth',
                description: 'Develop your skills and expertise in a fast-growing firm with expanding regional presence.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-blue-900 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <p className="text-gray-700 text-sm">{job.requirements}</p>
                  </div>
                  <button className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors">
                    Apply Now
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No open positions at the moment</p>
              <p className="text-gray-500">Check back soon or send us your resume at careers@menalane.com</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default CareersPage;
