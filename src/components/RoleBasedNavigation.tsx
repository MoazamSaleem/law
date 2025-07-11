import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  CheckSquare, 
  FileType, 
  Settings, 
  Users,
  BookOpen,
  Shield,
  CreditCard,
  Activity
} from 'lucide-react';

export const useNavigationItems = () => {
  const permissions = usePermissions();

  const allItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/',
      roles: ['admin', 'team', 'client']
    },
    {
      icon: FolderOpen,
      label: 'Documents',
      path: '/repository',
      roles: ['admin', 'team', 'client']
    },
    {
      icon: CheckSquare,
      label: 'Tasks',
      path: '/tasks',
      roles: ['admin', 'team', 'client']
    },
    {
      icon: FileType,
      label: 'Templates',
      path: '/templates',
      roles: ['admin', 'team']
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/insights',
      roles: ['admin', 'team']
    },
    {
      icon: Users,
      label: 'Team Management',
      path: '/user-management',
      roles: ['admin']
    },
    {
      icon: Shield,
      label: 'Security',
      path: '/security',
      roles: ['admin']
    },
    {
      icon: CreditCard,
      label: 'Billing',
      path: '/billing',
      roles: ['admin']
    },
    {
      icon: Activity,
      label: 'Audit Logs',
      path: '/audit-logs',
      roles: ['admin']
    },
    {
      icon: BookOpen,
      label: 'Knowledge Hub',
      path: '/knowledge',
      roles: ['admin', 'team', 'client']
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      roles: ['admin', 'team', 'client']
    }
  ];

  return allItems.filter(item => 
    item.roles.includes(permissions.role as any)
  );
};

export const getRoleBasedFeatures = (role: string) => {
  const features = {
    admin: [
      'Full system administration',
      'User and team management',
      'Billing and subscription management',
      'Advanced analytics and reporting',
      'Security and audit controls',
      'API and integration management',
      'Workflow automation',
      'Data export and backup'
    ],
    team: [
      'Document creation and management',
      'Task assignment and tracking',
      'Template creation and usage',
      'Team collaboration tools',
      'Basic analytics and reporting',
      'File sharing and organization',
      'Workflow participation'
    ],
    client: [
      'View assigned documents',
      'Download approved files',
      'Update task status',
      'Use available templates',
      'Basic collaboration features',
      'Track project status'
    ]
  };

  return features[role as keyof typeof features] || [];
};