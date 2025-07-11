import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File, Folder } from 'lucide-react';
import { documentService, DocumentUpload } from '../services/documentService';
import { validateFileType, validateFileSize, formatFileSize, getFileIcon } from '../utils/fileUtils';

interface FileUploaderProps {
  folderId?: string;
  onUploadComplete?: (documents: any[]) => void;
  onUploadError?: (error: string) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

interface UploadFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  tags: string[];
}

export default function FileUploader({
  folderId,
  onUploadComplete,
  onUploadError,
  allowedTypes = ['pdf', 'word', 'excel', 'image', 'text'],
  maxFileSize = 50,
  multiple = true,
  className = ''
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles: UploadFile[] = [];
    const errors: string[] = [];

    fileList.forEach(file => {
      // Validate file type
      if (!validateFileType(file, allowedTypes)) {
        errors.push(`${file.name}: File type not allowed`);
        return;
      }

      // Validate file size
      if (!validateFileSize(file, maxFileSize)) {
        errors.push(`${file.name}: File size exceeds ${maxFileSize}MB limit`);
        return;
      }

      // Generate auto tags
      const autoTags = generateAutoTags(file);

      validFiles.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        status: 'pending',
        progress: 0,
        tags: autoTags
      });
    });

    if (errors.length > 0) {
      onUploadError?.(errors.join('\n'));
    }

    if (!multiple && validFiles.length > 1) {
      validFiles.splice(1);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const generateAutoTags = (file: File): string[] => {
    const tags: string[] = [];
    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    // File type tags
    if (fileType.includes('pdf')) tags.push('pdf');
    if (fileType.includes('word')) tags.push('word', 'document');
    if (fileType.includes('excel')) tags.push('excel', 'spreadsheet');
    if (fileType.includes('image')) tags.push('image');

    // Content-based tags
    if (fileName.includes('contract')) tags.push('contract', 'legal');
    if (fileName.includes('nda')) tags.push('nda', 'confidential');
    if (fileName.includes('agreement')) tags.push('agreement', 'legal');
    if (fileName.includes('invoice')) tags.push('invoice', 'financial');
    if (fileName.includes('template')) tags.push('template');
    if (fileName.includes('draft')) tags.push('draft');
    if (fileName.includes('final')) tags.push('final');

    return tags;
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileTags = (id: string, tags: string[]) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, tags } : f
    ));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedDocuments: any[] = [];

    for (const uploadFile of files) {
      if (uploadFile.status !== 'pending') continue;

      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ));

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 90) }
              : f
          ));
        }, 200);

        const uploadData: DocumentUpload = {
          file: uploadFile.file,
          folderId,
          tags: uploadFile.tags,
          priority: 'medium'
        };

        const document = await documentService.uploadDocument(uploadData);
        uploadedDocuments.push(document);

        clearInterval(progressInterval);

        // Update status to completed
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ));

      } catch (error) {
        console.error('Upload error:', error);
        
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed' 
              }
            : f
        ));
      }
    }

    setUploading(false);
    
    if (uploadedDocuments.length > 0) {
      onUploadComplete?.(uploadedDocuments);
    }
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  const hasFiles = files.length > 0;
  const hasCompletedFiles = files.some(f => f.status === 'completed');
  const hasPendingFiles = files.some(f => f.status === 'pending');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
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
          Upload {multiple ? 'Files' : 'File'}
        </h4>
        <p className="text-gray-600 mb-4">
          Drag and drop your files here, or click to browse
        </p>
        
        <input
          type="file"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          accept={allowedTypes.map(type => `.${type}`).join(',')}
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <File size={16} />
          <span>Choose {multiple ? 'Files' : 'File'}</span>
        </label>
        
        <p className="text-xs text-gray-500 mt-4">
          Supports {allowedTypes.join(', ').toUpperCase()} files up to {maxFileSize}MB each
        </p>
      </div>

      {/* File List */}
      {hasFiles && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Files to Upload</h4>
            <div className="flex items-center space-x-2">
              {hasCompletedFiles && (
                <button
                  onClick={clearCompleted}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Completed
                </button>
              )}
              {hasPendingFiles && (
                <button
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload All'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {files.map((uploadFile) => (
              <div key={uploadFile.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(uploadFile.file.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{uploadFile.file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(uploadFile.file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadFile.status === 'completed' && (
                      <CheckCircle className="text-green-600" size={20} />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="text-red-600" size={20} />
                    )}
                    {uploadFile.status === 'pending' && (
                      <button
                        onClick={() => removeFile(uploadFile.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {uploadFile.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadFile.progress}%` }}
                    ></div>
                  </div>
                )}

                {uploadFile.status === 'error' && uploadFile.error && (
                  <p className="text-sm text-red-600 mb-2">{uploadFile.error}</p>
                )}
                
                {uploadFile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {uploadFile.tags.map((tag, index) => (
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
  );
}