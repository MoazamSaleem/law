import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo: string;
  assignedBy: string;
  documentId?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignedTo: string;
  documentId?: string;
  estimatedHours?: number;
  tags?: string[];
}

class TaskService {
  async createTask(taskData: CreateTaskData): Promise<TaskData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const newTask = {
        id: uuidv4(),
        title: taskData.title,
        description: taskData.description,
        status: 'todo' as const,
        priority: taskData.priority,
        due_date: taskData.dueDate?.toISOString(),
        assigned_to: taskData.assignedTo,
        assigned_by: user.user.id,
        document_id: taskData.documentId,
        estimated_hours: taskData.estimatedHours,
        tags: taskData.tags || [],
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;
      return this.mapToTaskData(data);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getTasks(status?: string, assignedTo?: string): Promise<TaskData[]> {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (assignedTo) {
        query = query.eq('assigned_to', assignedTo);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(this.mapToTaskData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTask(id: string): Promise<TaskData | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapToTaskData(data) : null;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<TaskData>): Promise<TaskData> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.dueDate) updateData.due_date = updates.dueDate;
      if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;
      if (updates.estimatedHours !== undefined) updateData.estimated_hours = updates.estimatedHours;
      if (updates.actualHours !== undefined) updateData.actual_hours = updates.actualHours;
      if (updates.tags) updateData.tags = updates.tags;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapToTaskData(data);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async completeTask(id: string, actualHours?: number): Promise<TaskData> {
    try {
      const updateData: any = {
        status: 'completed',
        updated_at: new Date().toISOString(),
      };

      if (actualHours !== undefined) {
        updateData.actual_hours = actualHours;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapToTaskData(data);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  async getTasksByDocument(documentId: string): Promise<TaskData[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.mapToTaskData);
    } catch (error) {
      console.error('Error fetching tasks by document:', error);
      throw error;
    }
  }

  private mapToTaskData(data: any): TaskData {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      assignedBy: data.assigned_by,
      documentId: data.document_id,
      estimatedHours: data.estimated_hours,
      actualHours: data.actual_hours,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const taskService = new TaskService();