import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Image, Plus, Settings } from 'lucide-react';

export default function CMSDashboardPage() {
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalMedia: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/cms/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching CMS stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="CMS Dashboard"
      description="Manage content, media, and settings"
    >
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Content Management System</h1>
          <p className="text-lg text-gray-600">
            Manage articles, reports, and media assets for MENALANE
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? '...' : stats.totalContent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : stats.publishedContent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{loading ? '...' : stats.draftContent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Media Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : stats.totalMedia}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-900 mb-4" />
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Create, edit, and publish articles and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link to="/cms/content/new" className="flex-1">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  New Content
                </Button>
              </Link>
              <Link to="/cms/content" className="flex-1">
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image className="h-10 w-10 text-blue-900 mb-4" />
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Upload and manage images, PDFs, and other assets
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link to="/cms/media" className="flex-1">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </Link>
              <Link to="/cms/media" className="flex-1">
                <Button variant="outline" className="w-full">
                  View Library
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-10 w-10 text-blue-900 mb-4" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure content types, regions, and industries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/cms/settings">
                <Button variant="outline" className="w-full">
                  Configure
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
