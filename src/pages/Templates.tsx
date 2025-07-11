import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Download, Eye, Copy, Star } from 'lucide-react';
import { mockTemplates } from '../data/mockData';

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Legal', 'Commercial', 'HR', 'Finance'];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      Legal: 'bg-blue-100 text-blue-800',
      Commercial: 'bg-green-100 text-green-800',
      HR: 'bg-purple-100 text-purple-800',
      Finance: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">Browse and manage your document templates</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Star size={16} className="text-gray-400 hover:text-yellow-500" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Used {template.usageCount} times</span>
              <span>Updated {template.updatedAt.toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Copy size={14} />
                <span>Use Template</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye size={16} />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}