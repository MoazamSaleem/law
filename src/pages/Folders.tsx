import React, { useState } from 'react';
import { Folder, FolderPlus, MoreHorizontal, Edit, Trash2, Share, Lock, Users, FileText, Search, Grid, List } from 'lucide-react';
import { mockFolders, mockDocuments } from '../data/mockData';

export default function Folders() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  const filteredFolders = mockFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFolderDocuments = (folderId: string) => {
    return mockDocuments.filter(doc => doc.folder === mockFolders.find(f => f.id === folderId)?.name);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Folders</h1>
          <p className="text-gray-600">Organize your documents with folders</p>
        </div>
        <button
          onClick={() => setShowNewFolderModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FolderPlus size={16} />
          <span>New Folder</span>
        </button>
      </div>

      {/* Search and View Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'} transition-colors`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'} transition-colors`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Folders Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFolders.map((folder) => (
            <div key={folder.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Folder className="text-blue-600" size={24} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{folder.name}</h3>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{folder.documentCount} documents</span>
                <span>{folder.createdAt.toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText size={14} />
                  <span>Open</span>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Name</th>
                  <th className="text-left p-4 font-medium text-gray-900">Documents</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created</th>
                  <th className="text-left p-4 font-medium text-gray-900">Permissions</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFolders.map((folder) => (
                  <tr key={folder.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Folder className="text-blue-600" size={20} />
                        <span className="font-medium text-gray-900">{folder.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{folder.documentCount}</td>
                    <td className="p-4 text-sm text-gray-600">{folder.createdAt.toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {folder.permissions.some(p => p.permission === 'admin') && (
                          <Lock className="text-gray-400" size={14} />
                        )}
                        <Users className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-600">{folder.permissions.length}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Share size={16} />
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
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter folder name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Folder</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Root</option>
                  {mockFolders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Folder
              </button>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}