import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { fetchContentBySlug } from '@/lib/api';
import { Calendar, User, ArrowRight, Share2, Linkedin, Twitter, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchContentBySlug(slug!),
    enabled: !!slug,
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = data?.content?.title || '';

    let shareUrl = '';
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </PageLayout>
    );
  }

  if (!data?.content) {
    return (
      <PageLayout title="Article Not Found">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/news-reports" className="text-blue-900 hover:text-blue-700 font-medium">
            ← Back to News & Reports
          </Link>
        </div>
      </PageLayout>
    );
  }

  const { content, related } = data;

  return (
    <PageLayout
      title={`${content.title} | MENALANE`}
      description={content.excerpt}
    >
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/news-reports" className="hover:text-blue-900">News & Reports</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{content.title}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {content.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(content.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-medium">
                  {content.content_type}
                </span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-2 pb-6 border-b border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Share:</span>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Share via Email"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  onClick={copyLink}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Copy link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none">
              {content.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Content */}
      {related && related.length > 0 && (
        <section className="bg-gray-50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item: any) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-br from-blue-900 to-blue-700" />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-blue-900 font-medium text-sm">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default ArticlePage;
