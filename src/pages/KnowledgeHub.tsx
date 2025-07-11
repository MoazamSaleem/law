import React, { useState } from 'react';
import { BookOpen, Search, Star, Clock, User, Tag, ExternalLink, Download, Bookmark, ThumbsUp } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: Date;
  readTime: number;
  rating: number;
  views: number;
  bookmarked: boolean;
  liked: boolean;
  type: 'article' | 'guide' | 'template' | 'video' | 'webinar';
}

export default function KnowledgeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = ['all', 'Contract Law', 'Compliance', 'Best Practices', 'Industry Updates', 'Templates', 'Automation'];
  const types = ['all', 'article', 'guide', 'template', 'video', 'webinar'];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Essential Contract Clauses Every Business Should Know',
      description: 'A comprehensive guide to understanding and implementing key contract clauses that protect your business interests.',
      category: 'Contract Law',
      tags: ['contracts', 'legal', 'business'],
      author: 'Legal Team',
      publishedAt: new Date('2024-01-20'),
      readTime: 8,
      rating: 4.8,
      views: 1250,
      bookmarked: true,
      liked: false,
      type: 'article'
    },
    {
      id: '2',
      title: 'GDPR Compliance in Contract Management',
      description: 'Learn how to ensure your contracts comply with GDPR requirements and protect personal data.',
      category: 'Compliance',
      tags: ['gdpr', 'compliance', 'data protection'],
      author: 'Compliance Officer',
      publishedAt: new Date('2024-01-18'),
      readTime: 12,
      rating: 4.9,
      views: 890,
      bookmarked: false,
      liked: true,
      type: 'guide'
    },
    {
      id: '3',
      title: 'Contract Automation Best Practices',
      description: 'Discover how to streamline your contract processes with automation tools and workflows.',
      category: 'Automation',
      tags: ['automation', 'workflow', 'efficiency'],
      author: 'Product Team',
      publishedAt: new Date('2024-01-15'),
      readTime: 6,
      rating: 4.7,
      views: 2100,
      bookmarked: false,
      liked: false,
      type: 'video'
    },
    {
      id: '4',
      title: 'NDA Template Library',
      description: 'Access our collection of professionally crafted NDA templates for various business scenarios.',
      category: 'Templates',
      tags: ['nda', 'templates', 'confidentiality'],
      author: 'Legal Team',
      publishedAt: new Date('2024-01-12'),
      readTime: 3,
      rating: 4.6,
      views: 1680,
      bookmarked: true,
      liked: true,
      type: 'template'
    },
    {
      id: '5',
      title: 'Contract Negotiation Strategies Webinar',
      description: 'Join our expert panel discussion on effective contract negotiation techniques and strategies.',
      category: 'Best Practices',
      tags: ['negotiation', 'strategy', 'webinar'],
      author: 'Expert Panel',
      publishedAt: new Date('2024-01-10'),
      readTime: 45,
      rating: 4.9,
      views: 3200,
      bookmarked: false,
      liked: false,
      type: 'webinar'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesType = selectedType === 'all' || article.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'guide': return '📖';
      case 'template': return '📋';
      case 'video': return '🎥';
      case 'webinar': return '🎯';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      guide: 'bg-green-100 text-green-800',
      template: 'bg-purple-100 text-purple-800',
      video: 'bg-red-100 text-red-800',
      webinar: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const toggleBookmark = (id: string) => {
    // In a real app, this would update the backend
    console.log('Toggle bookmark for article:', id);
  };

  const toggleLike = (id: string) => {
    // In a real app, this would update the backend
    console.log('Toggle like for article:', id);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
            <p className="text-gray-600">Learn, explore, and master contract management</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Featured: Contract Law Masterclass</h2>
            <p className="text-blue-100 mb-4">
              Join our comprehensive masterclass on modern contract law and best practices.
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <ExternalLink size={16} />
              <span>Watch Now</span>
            </button>
          </div>
          <div className="text-6xl opacity-20">🎓</div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(article.type)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(article.type)}`}>
                  {article.type}
                </span>
              </div>
              <button
                onClick={() => toggleBookmark(article.id)}
                className={`p-1 rounded transition-colors ${
                  article.bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Bookmark size={16} fill={article.bookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {article.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <User size={12} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{article.readTime} min read</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-500" size={12} fill="currentColor" />
                <span>{article.rating}</span>
              </div>
              <span>{article.views.toLocaleString()} views</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <BookOpen size={14} />
                <span>Read</span>
              </button>
              <button
                onClick={() => toggleLike(article.id)}
                className={`p-2 border rounded-lg transition-colors ${
                  article.liked 
                    ? 'border-blue-300 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp size={16} fill={article.liked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Getting Started</h3>
          <p className="text-sm text-green-700 mb-4">New to contract management? Start here with our beginner's guide.</p>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Learn More →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Advanced Topics</h3>
          <p className="text-sm text-purple-700 mb-4">Deep dive into complex contract scenarios and solutions.</p>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Explore →
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Industry Insights</h3>
          <p className="text-sm text-orange-700 mb-4">Stay updated with the latest trends and regulations.</p>
          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
}