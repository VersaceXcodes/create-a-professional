import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MarketsInsightsPage = lazy(() => import('./pages/MarketsInsightsPage'));
const MarketRegionPage = lazy(() => import('./pages/MarketRegionPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'));
const IndustryDetailPage = lazy(() => import('./pages/IndustryDetailPage'));
const NewsReportsPage = lazy(() => import('./pages/NewsReportsPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// CMS pages
const CMSDashboardPage = lazy(() => import('./pages/CMSDashboardPage'));
const CMSContentPage = lazy(() => import('./pages/CMSContentPage'));
const CMSContentEditorPage = lazy(() => import('./pages/CMSContentEditorPage'));
const CMSMediaPage = lazy(() => import('./pages/CMSMediaPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/markets-insights" element={<MarketsInsightsPage />} />
            <Route path="/markets-insights/:region" element={<MarketRegionPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:service" element={<ServiceDetailPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/industries/:industry" element={<IndustryDetailPage />} />
            <Route path="/news-reports" element={<NewsReportsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* CMS Routes */}
            <Route path="/cms" element={<CMSDashboardPage />} />
            <Route path="/cms/content" element={<CMSContentPage />} />
            <Route path="/cms/content/new" element={<CMSContentEditorPage />} />
            <Route path="/cms/content/edit/:id" element={<CMSContentEditorPage />} />
            <Route path="/cms/media" element={<CMSMediaPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;