import React, { useState, useEffect } from 'react';
import { X, Download, Share, Edit, Trash2, Eye, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { DocumentMetadata } from '../services/documentService';
import { downloadFile } from '../utils/fileUtils';

interface DocumentViewerProps {
  document: DocumentMetadata;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export default function DocumentViewer({ 
  document, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onShare 
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate loading time
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isOpen, document.id]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      await downloadFile(document.fileUrl, document.name);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderDocumentContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (document.mimeType.includes('pdf')) {
      return (
        <iframe
          src={`${document.fileUrl}#zoom=${zoom}`}
          className="w-full h-full border-0"
          style={{ transform: `rotate(${rotation}deg)` }}
          title={document.name}
        />
      );
    }

    if (document.mimeType.includes('image')) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <img
            src={document.fileUrl}
            alt={document.name}
            className="max-w-full max-h-full object-contain"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      );
    }

    if (document.mimeType.includes('text')) {
      return (
        <div className="p-6 h-full overflow-auto">
          <iframe
            src={document.fileUrl}
            className="w-full h-full border-0"
            style={{ fontSize: `${zoom}%` }}
            title={document.name}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Eye size={48} className="mb-4" />
        <p className="text-lg font-medium mb-2">Preview not available</p>
        <p className="text-sm">This file type cannot be previewed in the browser.</p>
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download to view
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{document.name}</h3>
            <p className="text-sm text-gray-500">
              {document.type} • {(document.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 mx-4">
            {(document.mimeType.includes('pdf') || document.mimeType.includes('image')) && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={16} />
                </button>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share size={16} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderDocumentContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
              <span>Modified: {new Date(document.updatedAt).toLocaleDateString()}</span>
              <span>Version: {document.version}</span>
            </div>
            <div className="flex items-center space-x-2">
              {document.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}