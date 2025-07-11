import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download file');
    
    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const downloadMultipleFiles = async (files: Array<{ url: string; name: string }>): Promise<void> => {
  try {
    const zip = new JSZip();
    
    for (const file of files) {
      const response = await fetch(file.url);
      if (response.ok) {
        const blob = await response.blob();
        zip.file(file.name, blob);
      }
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'documents.zip');
  } catch (error) {
    console.error('Error creating zip file:', error);
    throw error;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
  if (mimeType.includes('text')) return '📄';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  return '📁';
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.includes(type));
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};