import React, { useState, useCallback } from 'react';
import { Upload, File, Folder, X, CheckCircle, AlertCircle, Plus, FolderPlus } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  folder?: string;
  tags?: string[];
}

export default function UploadDocuments() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [autoTagging, setAutoTagging] = useState(true);
  const [bulkUpload, setBulkUpload] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const folders = [
    'Active Contracts',
    'Templates',
    'Legal Documents',
    'HR Files',
    'Financial Records',
    'Archive'
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      folder: selectedFolder,
      tags: autoTagging ? generateAutoTags(file.name) : []
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const generateAutoTags = (filename: string): string[] => {
    const tags: string[] = [];
    const name = filename.toLowerCase();
    
    if (name.includes('contract')) tags.push('contract');
    if (name.includes('nda')) tags.push('nda', 'confidential');
    if (name.includes('agreement')) tags.push('agreement');
    if (name.includes('invoice')) tags.push('invoice', 'financial');
    if (name.includes('template')) tags.push('template');
    if (name.includes('legal')) tags.push('legal');
    if (name.includes('hr')) tags.push('hr');
    
    // Add file type tag
    const extension = filename.split('.').pop();
    if (extension) tags.push(extension);
    
    return tags;
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'completed', progress: 100 }
            : file
        ));
      } else {
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, progress }
            : file
        ));
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    return '📁';
  };

  const completedFiles = uploadedFiles.filter(f => f.status === 'completed').length;
  const totalFiles = uploadedFiles.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">Upload files or folders to your repository with AI-powered auto-tagging</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upload Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination Folder</label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select folder...</option>
                  {folders.map(folder => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoTagging"
                    checked={autoTagging}
                    onChange={(e) => setAutoTagging(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoTagging" className="ml-2 text-sm text-gray-900">
                    AI Auto-tagging
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bulkUpload"
                    checked={bulkUpload}
                    onChange={(e) => setBulkUpload(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="bulkUpload" className="ml-2 text-sm text-gray-900">
                    Bulk Upload
                  </label>
                </div>
              </div>
            </div>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {bulkUpload ? 'Upload Files or Folders' : 'Upload Files'}
              </h4>
              <p className="text-gray-600 mb-4">
                Drag and drop your {bulkUpload ? 'files or folders' : 'files'} here, or click to browse
              </p>
              
              <div className="flex justify-center space-x-3">
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png,.xlsx,.pptx"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <File size={16} />
                  <span>Choose Files</span>
                </label>
                
                {bulkUpload && (
                  <input
                    type="file"
                    multiple
                    webkitdirectory=""
                    onChange={handleFileInput}
                    className="hidden"
                    id="folder-upload"
                  />
                )}
                {bulkUpload && (
                  <label
                    htmlFor="folder-upload"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <Folder size={16} />
                    <span>Choose Folder</span>
                  </label>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Supports PDF, DOC, DOCX, TXT, JPG, PNG, XLSX, PPTX files up to 50MB each
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Progress</h3>
                <span className="text-sm text-gray-600">
                  {completedFiles} of {totalFiles} completed
                </span>
              </div>
              
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.status === 'completed' && (
                          <CheckCircle className="text-green-600" size={20} />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="text-red-600" size={20} />
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Settings */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <Plus size={16} />
                <span>Create New Folder</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <FolderPlus size={16} />
                <span>Bulk Organize</span>
              </button>
            </div>
          </div>

          {/* Upload Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Statistics</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Files uploaded today</span>
                <span className="text-sm font-medium text-gray-900">{completedFiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total size</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatFileSize(uploadedFiles.reduce((acc, file) => acc + file.size, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto-tagged files</span>
                <span className="text-sm font-medium text-gray-900">
                  {uploadedFiles.filter(f => f.tags && f.tags.length > 0).length}
                </span>
              </div>
            </div>
          </div>

          {/* AI Tagging Info */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Auto-Tagging</h3>
            <p className="text-sm text-purple-700 mb-3">
              Our AI automatically analyzes your documents and adds relevant tags for better organization.
            </p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Identifies document types</li>
              <li>• Extracts key information</li>
              <li>• Suggests relevant categories</li>
              <li>• Improves searchability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}