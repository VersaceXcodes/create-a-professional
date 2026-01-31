import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <PageLayout title="Page Not Found | MENALANE">
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <AlertCircle className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Go Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors"
            >
              <Home className="mr-2 w-5 h-5" />
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
