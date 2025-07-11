import React, { useState } from 'react';
import { FileText, Edit, Trash2, Copy, Eye, Plus, Search, Calendar, User } from 'lucide-react';

interface TemplateDraft {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'draft' | 'review' | 'published';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  progress: number;
  variables: number;
}

export default function TemplateDrafts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const drafts: TemplateDraft[] = [
    {
      id: '1',
      name: 'Software License Agreement',
      description: 'Template for software licensing agreements with SaaS companies',
      category: 'Legal',
      status: 'draft',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
      createdBy: 'Legal Team',
      progress: 75,
      variables: 12
    },
    {
      id: '2',
      name: 'Freelancer Contract Template',
      description: 'Standard contract template for freelance work arrangements',
      category: 'HR',
      status: 'review',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-21'),
      createdBy: 'HR Manager',
      progress: 90,
      variables: 8
    },
    {
      id: '3',
      name: 'Partnership Agreement',
      description: 'Template for business partnership agreements',
      category: 'Commercial',
      status: 'draft',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-19'),
      createdBy: 'Umar',
      progress: 45,
      variables: 15
    }
  ];

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || draft.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Drafts</h1>
          <p className="text-gray-600">Manage your work-in-progress templates</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          <span>New Draft</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrafts.map((draft) => (
          <div key={draft.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(draft.category)}`}>
                    {draft.category}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(draft.status)}`}>
                {draft.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{draft.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{draft.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{draft.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${draft.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <User size={12} />
                <span>{draft.createdBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{draft.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              {draft.variables} variables • Last updated {draft.updatedAt.toLocaleDateString()}
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye size={16} />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Copy size={16} />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDrafts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts found</h3>
          <p className="text-gray-600">Create a new template draft to get started.</p>
        </div>
      )}
    </div>
  );
}