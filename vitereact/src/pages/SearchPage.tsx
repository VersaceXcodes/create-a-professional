import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { fetchContent } from '@/lib/api';
import { Search, Calendar, FileText, ArrowRight } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const { data, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => fetchContent({ search: searchQuery, limit: 50 }),
    enabled: searchQuery.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <PageLayout
      title={`Search Results${searchQuery ? ` for "${searchQuery}"` : ''} | MENALANE`}
      description="Search MENALANE market intelligence, reports, and analysis"
    >
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center">Search</h1>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, reports, and insights..."
                  className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-900 hover:text-blue-700"
                  aria-label="Search"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!searchQuery || searchQuery.length < 2 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                Enter at least 2 characters to start searching
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : data?.content && data.content.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Found {data.content.length} results for "{searchQuery}"
                </h2>
              </div>
              <div className="space-y-6">
                {data.content.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <Link to={`/article/${item.slug}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-900">
                            {item.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-2 space-x-4">
                            <div className="flex items-center">
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
                            {item.region && item.region !== 'general' && (
                              <span className="text-gray-600 capitalize">
                                {item.region.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <FileText className="w-12 h-12 text-blue-900 opacity-20 ml-4" />
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                      <div className="flex items-center text-blue-900 font-medium text-sm">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">
                No results found for "{searchQuery}"
              </p>
              <p className="text-gray-500">Try different keywords or browse our content sections</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default SearchPage;
