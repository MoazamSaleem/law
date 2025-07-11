import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { n8nService } from './n8nService';

export interface DocumentUpload {
  file: File;
  folderId?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  status: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  folderId?: string;
  priority: string;
  dueDate?: string;
  version: number;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

class DocumentService {
  async uploadDocument(uploadData: DocumentUpload): Promise<DocumentMetadata> {
    try {
      const { file, folderId, tags = [], priority = 'medium', dueDate } = uploadData;
      const fileId = uuidv4();
      const fileName = `${fileId}-${file.name}`;
      
      // Upload file to Supabase Storage
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Auto-generate tags based on file content
      const autoTags = await this.generateAutoTags(file);
      const allTags = [...new Set([...tags, ...autoTags])];

      // Save document metadata to database
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const documentData = {
        id: fileId,
        name: file.name,
        type: this.getDocumentType(file.type),
        status: 'draft',
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        tags: allTags,
        folder_id: folderId,
        priority,
        due_date: dueDate?.toISOString(),
        version: 1,
        created_by: user.user.id,
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;

      // Get user profile for N8N webhook
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.user.id)
        .single();

      const document = this.mapToDocumentMetadata(data);

      // Send N8N webhook for document upload
      if (userProfile) {
        await n8nService.documentUploaded(userProfile, document);
        
        // Special handling for proposals
        if (file.name.toLowerCase().includes('proposal') || allTags.includes('proposal')) {
          await n8nService.proposalUploaded(userProfile, document);
        }
      }

      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async getDocuments(folderId?: string): Promise<DocumentMetadata[]> {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(this.mapToDocumentMetadata);
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async getDocument(id: string): Promise<DocumentMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapToDocumentMetadata(data) : null;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  async downloadDocument(id: string): Promise<Blob> {
    try {
      const document = await this.getDocument(id);
      if (!document) throw new Error('Document not found');

      const response = await fetch(document.fileUrl);
      if (!response.ok) throw new Error('Failed to download document');

      return await response.blob();
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const document = await this.getDocument(id);
      if (!document) throw new Error('Document not found');

      // Delete file from storage
      const fileName = document.fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('documents')
          .remove([fileName]);
      }

      // Delete document record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async updateDocument(id: string, updates: Partial<DocumentMetadata>): Promise<DocumentMetadata> {
    try {
      // Get current document for comparison
      const currentDoc = await this.getDocument(id);
      const oldStatus = currentDoc?.status;

      const { data, error } = await supabase
        .from('documents')
        .update({
          name: updates.name,
          status: updates.status,
          tags: updates.tags,
          priority: updates.priority,
          due_date: updates.dueDate,
          assigned_to: updates.assignedTo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedDocument = this.mapToDocumentMetadata(data);

      // Send N8N webhook for status change
      if (oldStatus && updates.status && oldStatus !== updates.status) {
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.user.id)
            .single();

          if (userProfile) {
            await n8nService.documentStatusChanged(userProfile, updatedDocument, oldStatus, updates.status);
          }
        }
      }

      return updatedDocument;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async searchDocuments(query: string): Promise<DocumentMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`name.ilike.%${query}%,tags.cs.{${query}}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(this.mapToDocumentMetadata);
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  private async generateAutoTags(file: File): Promise<string[]> {
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
    if (fileName.includes('signed')) tags.push('signed');

    // Date-based tags
    const currentYear = new Date().getFullYear();
    if (fileName.includes(currentYear.toString())) tags.push(currentYear.toString());

    return tags;
  }

  private getDocumentType(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word')) return 'document';
    if (mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('text')) return 'text';
    return 'other';
  }

  private mapToDocumentMetadata(data: any): DocumentMetadata {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      fileUrl: data.file_url,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      tags: data.tags || [],
      folderId: data.folder_id,
      priority: data.priority,
      dueDate: data.due_date,
      version: data.version,
      createdBy: data.created_by,
      assignedTo: data.assigned_to,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const documentService = new DocumentService();