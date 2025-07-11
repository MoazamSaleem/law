import React, { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { mockDocuments } from '../data/mockData';

const tabs = [
  { id: 'all', label: 'All', count: mockDocuments.length },
  { id: 'draft', label: 'Draft', count: mockDocuments.filter(d => d.status === 'draft').length },
  { id: 'review', label: 'Review', count: mockDocuments.filter(d => d.status === 'review').length },
  { id: 'agreed', label: 'Agreed form', count: mockDocuments.filter(d => d.status === 'agreed').length },
  { id: 'esigning', label: 'eSigning', count: mockDocuments.filter(d => d.status === 'esigning').length },
  { id: 'signed', label: 'Signed', count: mockDocuments.filter(d => d.status === 'signed').length },
  { id: 'unknown', label: 'Unknown', count: mockDocuments.filter(d => d.status === 'unknown').length }
];

export default function ContractWorkflow() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredDocuments = activeTab === 'all' 
    ? mockDocuments 
    : mockDocuments.filter(doc => doc.status === activeTab);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-0">Contract workflow</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            My documents
          </button>
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <span>Last 30 days</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200 -mx-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Documents or Empty state */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-2">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="text-blue-600 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                  <p className="text-xs text-gray-500">Updated {doc.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'signed' ? 'bg-green-100 text-green-800' :
                  doc.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  doc.status === 'esigning' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="text-gray-400" size={24} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No documents</h3>
          <p className="text-sm text-gray-600 mb-4">No documents with this status</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </button>
        </div>
      )}
    </div>
  );
}