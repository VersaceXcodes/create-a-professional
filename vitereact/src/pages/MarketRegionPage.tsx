import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { fetchContent } from '@/lib/api';
import { ArrowRight, Calendar, FileText } from 'lucide-react';
import type { RegionType } from '@/types';

const MarketRegionPage: React.FC = () => {
  const { region } = useParams<{ region: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['region-content', region],
    queryFn: () => fetchContent({ region: region as RegionType, limit: 20 }),
  });

  const regionInfo: Record<string, { name: string; description: string }> = {
    gcc: {
      name: 'GCC Markets',
      description: 'Gulf Cooperation Council market analysis, economic outlooks, and investment insights covering Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman.',
    },
    'north-africa': {
      name: 'North Africa Markets',
      description: 'Comprehensive analysis of North African economies including Egypt, Morocco, Algeria, Tunisia, and Libya.',
    },
    levant: {
      name: 'Levant Markets',
      description: 'Insights into Levantine economies covering Lebanon, Jordan, Syria, and Palestine with focus on innovation and emerging sectors.',
    },
  };

  const currentRegion = region ? regionInfo[region] : null;

  return (
    <PageLayout
      title={`${currentRegion?.name || 'Regional'} Analysis | MENALANE`}
      description={currentRegion?.description || 'Regional market analysis'}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {currentRegion?.name}
            </h1>
            <p className="text-xl text-blue-100">
              {currentRegion?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Listing */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : data?.content && data.content.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.content.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/article/${item.slug}`}
                    className="block h-full bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {item.excerpt}
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
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No content available for this region yet.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default MarketRegionPage;
