import { Document, Task, Template, Folder, Insight, User, Notification, ActivityLog } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Umar Khan',
  email: 'umar@pocketlaw.com',
  role: 'admin',
  department: 'Legal',
  phone: '+1 (555) 123-4567',
  bio: 'Legal professional with 10+ years of experience in contract management and corporate law.',
  createdAt: new Date('2023-01-01'),
  lastLogin: new Date(),
  isActive: true
};

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Service Agreement - TechCorp',
    type: 'contract',
    status: 'review',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'Umar',
    size: 245000,
    tags: ['service', 'tech', 'annual'],
    folder: 'Active Contracts',
    priority: 'high',
    dueDate: new Date('2024-02-01'),
    version: 1,
    comments: []
  },
  {
    id: '2',
    name: 'NDA Template v2.1',
    type: 'template',
    status: 'signed',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    createdBy: 'Sarah Johnson',
    size: 89000,
    tags: ['nda', 'template', 'standard'],
    priority: 'medium',
    version: 2,
    comments: []
  },
  {
    id: '3',
    name: 'Employment Contract - John Doe',
    type: 'contract',
    status: 'esigning',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    createdBy: 'HR Team',
    size: 156000,
    tags: ['employment', 'hr', 'full-time'],
    priority: 'high',
    dueDate: new Date('2024-01-30'),
    version: 1,
    comments: []
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review TechCorp Service Agreement',
    description: 'Legal review required for annual service agreement with TechCorp',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-01-25'),
    assignedTo: 'Umar',
    assignedBy: 'Legal Team',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    documentId: '1',
    estimatedHours: 4,
    actualHours: 2,
    tags: ['review', 'urgent']
  },
  {
    id: '2',
    title: 'Update NDA Template',
    description: 'Incorporate new privacy clauses into standard NDA template',
    status: 'todo',
    priority: 'medium',
    assignedTo: 'Legal Team',
    assignedBy: 'Umar',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    estimatedHours: 2,
    tags: ['template', 'update']
  },
  {
    id: '3',
    title: 'Contract Analysis Complete',
    description: 'Completed analysis of Q4 contract performance metrics',
    status: 'completed',
    priority: 'low',
    assignedTo: 'Umar',
    assignedBy: 'Manager',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    estimatedHours: 3,
    actualHours: 2.5,
    tags: ['analysis', 'completed']
  }
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Non-Disclosure Agreement',
    description: 'Standard NDA template for business partnerships',
    category: 'Legal',
    tags: ['nda', 'confidentiality', 'standard'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'Legal Team',
    usageCount: 45,
    isPublic: true,
    variables: [
      { id: '1', name: 'company_name', type: 'text', required: true },
      { id: '2', name: 'effective_date', type: 'date', required: true }
    ]
  },
  {
    id: '2',
    name: 'Service Agreement',
    description: 'Comprehensive service agreement template',
    category: 'Commercial',
    tags: ['service', 'commercial', 'b2b'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'Commercial Team',
    usageCount: 32,
    isPublic: true,
    variables: [
      { id: '3', name: 'service_type', type: 'text', required: true },
      { id: '4', name: 'contract_value', type: 'number', required: true }
    ]
  },
  {
    id: '3',
    name: 'Employment Contract',
    description: 'Standard employment contract template',
    category: 'HR',
    tags: ['employment', 'hr', 'full-time'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'HR Team',
    usageCount: 28,
    isPublic: false,
    variables: [
      { id: '5', name: 'employee_name', type: 'text', required: true },
      { id: '6', name: 'start_date', type: 'date', required: true },
      { id: '7', name: 'salary', type: 'number', required: true }
    ]
  }
];

export const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Active Contracts',
    documentCount: 15,
    createdAt: new Date('2024-01-01'),
    createdBy: 'Umar',
    permissions: [
      { userId: '1', permission: 'admin' }
    ]
  },
  {
    id: '2',
    name: 'Templates',
    documentCount: 8,
    createdAt: new Date('2024-01-01'),
    createdBy: 'Legal Team',
    permissions: [
      { userId: '1', permission: 'admin' }
    ]
  },
  {
    id: '3',
    name: 'Archive',
    documentCount: 42,
    createdAt: new Date('2024-01-01'),
    createdBy: 'System',
    permissions: [
      { userId: '1', permission: 'read' }
    ]
  }
];

export const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Total Contracts',
    value: 156,
    change: 12,
    period: 'vs last month',
    type: 'contracts',
    trend: 'up'
  },
  {
    id: '2',
    title: 'Contract Value',
    value: '$2.4M',
    change: 8,
    period: 'vs last month',
    type: 'revenue',
    trend: 'up'
  },
  {
    id: '3',
    title: 'Avg. Review Time',
    value: '3.2 days',
    change: -15,
    period: 'vs last month',
    type: 'time',
    trend: 'down'
  },
  {
    id: '4',
    title: 'Completion Rate',
    value: '94%',
    change: 5,
    period: 'vs last month',
    type: 'efficiency',
    trend: 'up'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Contract Review Required',
    message: 'TechCorp Service Agreement needs your review',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    actionUrl: '/repository/1'
  },
  {
    id: '2',
    title: 'Document Signed',
    message: 'Employment Contract - John Doe has been signed',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    actionUrl: '/repository/3'
  },
  {
    id: '3',
    title: 'Task Assigned',
    message: 'You have been assigned to update NDA Template',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: '/tasks/2'
  }
];

export const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    action: 'Document signed',
    entityType: 'document',
    entityId: '3',
    entityName: 'Employment Contract - John Doe',
    userId: '2',
    userName: 'John Doe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: { status: 'signed' }
  },
  {
    id: '2',
    action: 'Document uploaded',
    entityType: 'document',
    entityId: '2',
    entityName: 'NDA Template v2.1',
    userId: '3',
    userName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    details: { size: 89000 }
  },
  {
    id: '3',
    action: 'Task completed',
    entityType: 'task',
    entityId: '3',
    entityName: 'Contract Analysis Complete',
    userId: '1',
    userName: 'Umar Khan',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    details: { priority: 'low' }
  }
];