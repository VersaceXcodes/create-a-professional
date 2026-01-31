import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { fetchContent } from '@/lib/api';
import { Calendar, FileText, ArrowRight, Filter } from 'lucide-react';

const NewsReportsPage: React.FC = () => {
  const [filters, setFilters] = useState({ type: '', region: '', industry: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['all-content', filters],
    queryFn: () => fetchContent(filters),
  });

  return (
    <PageLayout
      title="News & Reports – Latest MENA Market Intelligence | MENALANE"
      description="Latest news, analysis, and reports on MENA markets, industries, and economic developments."
    >
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">News & Reports</h1>
            <p className="text-xl text-blue-100">
              Latest insights, analysis, and market intelligence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="article">Articles</option>
              <option value="report">Reports</option>
              <option value="commentary">Commentary</option>
            </select>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              <option value="gcc">GCC</option>
              <option value="north_africa">North Africa</option>
              <option value="levant">Levant</option>
            </select>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              <option value="energy">Energy</option>
              <option value="finance">Finance</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="technology">Technology</option>
              <option value="real_estate">Real Estate</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.content?.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-xs font-medium">
                          {item.content_type}
                        </span>
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
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default NewsReportsPage;
