import React, { useState } from 'react';
import { Search, Filter, Grid, List, Download, Eye, MoreHorizontal, FileText, Calendar, User, Tag } from 'lucide-react';
import { mockDocuments } from '../data/mockData';

export default function AllDocuments() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated');

  const statuses = ['all', 'draft', 'review', 'agreed', 'esigning', 'signed'];
  const types = ['all', 'contract', 'template', 'agreement', 'nda', 'invoice'];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'updated':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      agreed: 'bg-green-100 text-green-800',
      esigning: 'bg-blue-100 text-blue-800',
      signed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      contract: 'bg-blue-100 text-blue-800',
      template: 'bg-purple-100 text-purple-800',
      agreement: 'bg-green-100 text-green-800',
      nda: 'bg-orange-100 text-orange-800',
      invoice: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Documents</h1>
        <p className="text-gray-600">Browse and manage all your documents</p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="name">Name</option>
              <option value="size">File Size</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={16} />
            </button>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'} transition-colors`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'} transition-colors`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Name</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Size</th>
                  <th className="text-left p-4 font-medium text-gray-900">Modified</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created By</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {doc.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{doc.tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                    <td className="p-4 text-sm text-gray-600">{doc.updatedAt.toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-gray-600">{doc.createdBy}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Download size={16} />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <FileText className="text-blue-600" size={24} />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{doc.name}</h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                  {doc.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>

              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <div className="flex items-center space-x-1">
                  <User size={12} />
                  <span>{doc.createdBy}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{doc.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText size={12} />
                  <span>{formatFileSize(doc.size)}</span>
                </div>
              </div>

              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}