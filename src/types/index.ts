export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  department?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'template' | 'agreement' | 'nda' | 'invoice';
  status: 'draft' | 'review' | 'agreed' | 'esigning' | 'signed' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  size: number;
  tags: string[];
  folder?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  version: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  type: 'comment' | 'approval' | 'rejection';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignedTo: string;
  assignedBy: string;
  createdAt: Date;
  updatedAt: Date;
  documentId?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
  isPublic: boolean;
  content?: string;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  documentCount: number;
  createdAt: Date;
  createdBy: string;
  permissions: FolderPermission[];
}

export interface FolderPermission {
  userId: string;
  permission: 'read' | 'write' | 'admin';
}

export interface Insight {
  id: string;
  title: string;
  value: string | number;
  change: number;
  period: string;
  type: 'contracts' | 'revenue' | 'time' | 'efficiency' | 'tasks' | 'templates';
  trend: 'up' | 'down' | 'stable';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: 'document' | 'task' | 'template' | 'user';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  settings: OrganizationSettings;
  subscription: Subscription;
}

export interface OrganizationSettings {
  allowPublicTemplates: boolean;
  requireApprovalForContracts: boolean;
  defaultContractExpiry: number; // days
  enableNotifications: boolean;
  timezone: string;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;
  features: string[];
}