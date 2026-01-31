import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  content_type: string;
  region: string;
  industry: string;
  author: string;
  published_at: string | null;
  created_at: string;
}

export default function CMSContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    industry: '',
    search: ''
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.region) params.append('region', filters.region);
      if (filters.industry) params.append('industry', filters.industry);
      if (filters.search) params.append('search', filters.search);
      params.append('include_drafts', 'true');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/cms/content?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/cms/content/${id}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  return (
    <PageLayout
      title="Content Management"
      description="Manage articles, reports, and other content"
    >
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Content Management</h1>
          <Link to="/cms/content/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Content
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="commentary">Commentary</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.region || 'all'}
                onValueChange={(value) => setFilters({ ...filters, region: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="gcc">GCC</SelectItem>
                  <SelectItem value="north_africa">North Africa</SelectItem>
                  <SelectItem value="levant">Levant</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.industry || 'all'}
                onValueChange={(value) => setFilters({ ...filters, industry: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : content.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">No content found</p>
              <Link to="/cms/content/new">
                <Button>Create your first content</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <Card key={item.id}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <Badge variant={item.published_at ? 'default' : 'secondary'}>
                          {item.published_at ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="outline">{item.content_type}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Region:</span> {item.region} • 
                          <span className="font-medium ml-2">Industry:</span> {item.industry}
                        </p>
                        <p>
                          <span className="font-medium">Author:</span> {item.author || 'N/A'} • 
                          <span className="font-medium ml-2">Created:</span> {format(new Date(item.created_at), 'MMM dd, yyyy')}
                        </p>
                        {item.published_at && (
                          <p>
                            <span className="font-medium">Published:</span> {format(new Date(item.published_at), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {item.published_at && (
                        <Link to={`/article/${item.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link to={`/cms/content/edit/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
