import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface FolderData {
  id: string;
  name: string;
  parentId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  documentCount?: number;
}

class FolderService {
  async createFolder(name: string, parentId?: string): Promise<FolderData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const folderData = {
        id: uuidv4(),
        name,
        parent_id: parentId,
        created_by: user.user.id,
      };

      const { data, error } = await supabase
        .from('folders')
        .insert(folderData)
        .select()
        .single();

      if (error) throw error;
      return this.mapToFolderData(data);
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async getFolders(parentId?: string): Promise<FolderData[]> {
    try {
      let query = supabase
        .from('folders')
        .select('*')
        .order('name');

      if (parentId) {
        query = query.eq('parent_id', parentId);
      } else {
        query = query.is('parent_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get document counts for each folder
      const foldersWithCounts = await Promise.all(
        data.map(async (folder) => {
          const { count } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true })
            .eq('folder_id', folder.id);

          return {
            ...this.mapToFolderData(folder),
            documentCount: count || 0,
          };
        })
      );

      return foldersWithCounts;
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  }

  async getFolder(id: string): Promise<FolderData | null> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapToFolderData(data) : null;
    } catch (error) {
      console.error('Error fetching folder:', error);
      throw error;
    }
  }

  async updateFolder(id: string, name: string): Promise<FolderData> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapToFolderData(data);
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  }

  async deleteFolder(id: string): Promise<void> {
    try {
      // Check if folder has documents
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('folder_id', id);

      if (count && count > 0) {
        throw new Error('Cannot delete folder with documents. Please move or delete documents first.');
      }

      // Check if folder has subfolders
      const { count: subfolderCount } = await supabase
        .from('folders')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', id);

      if (subfolderCount && subfolderCount > 0) {
        throw new Error('Cannot delete folder with subfolders. Please delete subfolders first.');
      }

      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  }

  async moveFolder(id: string, newParentId?: string): Promise<FolderData> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .update({ 
          parent_id: newParentId,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapToFolderData(data);
    } catch (error) {
      console.error('Error moving folder:', error);
      throw error;
    }
  }

  private mapToFolderData(data: any): FolderData {
    return {
      id: data.id,
      name: data.name,
      parentId: data.parent_id,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const folderService = new FolderService();