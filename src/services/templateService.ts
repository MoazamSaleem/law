import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  variables: TemplateVariable[];
  usageCount: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'dropdown';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface CreateTemplateData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  variables: TemplateVariable[];
  isPublic: boolean;
}

class TemplateService {
  async createTemplate(templateData: CreateTemplateData): Promise<TemplateData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const newTemplate = {
        id: uuidv4(),
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        tags: templateData.tags,
        content: templateData.content,
        variables: templateData.variables,
        usage_count: 0,
        is_public: templateData.isPublic,
        created_by: user.user.id,
      };

      const { data, error } = await supabase
        .from('templates')
        .insert(newTemplate)
        .select()
        .single();

      if (error) throw error;
      return this.mapToTemplateData(data);
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async getTemplates(category?: string, isPublic?: boolean): Promise<TemplateData[]> {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (isPublic !== undefined) {
        query = query.eq('is_public', isPublic);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(this.mapToTemplateData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  async getTemplate(id: string): Promise<TemplateData | null> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapToTemplateData(data) : null;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  async updateTemplate(id: string, updates: Partial<CreateTemplateData>): Promise<TemplateData> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name) updateData.name = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.category) updateData.category = updates.category;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.content) updateData.content = updates.content;
      if (updates.variables) updateData.variables = updates.variables;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

      const { data, error } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapToTemplateData(data);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  async useTemplate(id: string, variables: Record<string, any>): Promise<string> {
    try {
      const template = await this.getTemplate(id);
      if (!template) throw new Error('Template not found');

      // Increment usage count
      await supabase
        .from('templates')
        .update({ usage_count: template.usageCount + 1 })
        .eq('id', id);

      // Replace variables in content
      let content = template.content;
      template.variables.forEach(variable => {
        const value = variables[variable.name] || variable.defaultValue || `[${variable.name.toUpperCase()}]`;
        const regex = new RegExp(`{{${variable.name}}}`, 'g');
        content = content.replace(regex, value);
      });

      return content;
    } catch (error) {
      console.error('Error using template:', error);
      throw error;
    }
  }

  async searchTemplates(query: string): Promise<TemplateData[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(this.mapToTemplateData);
    } catch (error) {
      console.error('Error searching templates:', error);
      throw error;
    }
  }

  async duplicateTemplate(id: string, newName?: string): Promise<TemplateData> {
    try {
      const template = await this.getTemplate(id);
      if (!template) throw new Error('Template not found');

      const duplicateData: CreateTemplateData = {
        name: newName || `${template.name} (Copy)`,
        description: template.description,
        category: template.category,
        tags: template.tags,
        content: template.content,
        variables: template.variables,
        isPublic: false, // Duplicates are private by default
      };

      return await this.createTemplate(duplicateData);
    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  }

  private mapToTemplateData(data: any): TemplateData {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags || [],
      content: data.content,
      variables: data.variables || [],
      usageCount: data.usage_count,
      isPublic: data.is_public,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const templateService = new TemplateService();