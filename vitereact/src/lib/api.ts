import axios from 'axios';
import type { Content, MarketHighlight, Job, ContactFormData, NewsletterFormData, ContentFilters } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Content APIs
export const fetchFeaturedContent = async (): Promise<Content[]> => {
  const response = await api.get('/api/content/featured');
  return response.data.content;
};

export const fetchContent = async (filters: ContentFilters = {}) => {
  const response = await api.get('/api/content', { params: filters });
  return response.data;
};

export const fetchContentBySlug = async (slug: string) => {
  const response = await api.get(`/api/content/${slug}`);
  return response.data;
};

// Market Highlights API
export const fetchMarketHighlights = async (region?: string): Promise<MarketHighlight[]> => {
  const response = await api.get('/api/market-highlights', { 
    params: region ? { region } : {} 
  });
  return response.data.highlights;
};

// Jobs API
export const fetchJobs = async (): Promise<Job[]> => {
  const response = await api.get('/api/jobs');
  return response.data.jobs;
};

// Contact Form API
export const submitContactForm = async (data: ContactFormData) => {
  const response = await api.post('/api/contact', data);
  return response.data;
};

// Newsletter API
export const subscribeNewsletter = async (data: NewsletterFormData) => {
  const response = await api.post('/api/newsletter/subscribe', data);
  return response.data;
};

export default api;
