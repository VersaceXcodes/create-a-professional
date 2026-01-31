// MENALANE Types

export type ContentType = 'article' | 'report' | 'commentary';
export type RegionType = 'gcc' | 'north_africa' | 'levant' | 'general';
export type IndustryType = 'energy' | 'finance' | 'infrastructure' | 'technology' | 'real_estate' | 'general';
export type ServiceType = 'investment_advisory' | 'market_research' | 'corporate_strategy' | 'risk_analysis';

export interface Content {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image?: string;
  content_type: ContentType;
  region: RegionType;
  industry: IndustryType;
  is_featured: boolean;
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface MarketHighlight {
  id: number;
  region: RegionType;
  metric_name: string;
  metric_value: string;
  trend: string;
  description: string;
  display_order: number;
}

export interface Job {
  id: number;
  title: string;
  location: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface ContentFilters {
  type?: ContentType;
  region?: RegionType;
  industry?: IndustryType;
  search?: string;
  limit?: number;
  offset?: number;
}
