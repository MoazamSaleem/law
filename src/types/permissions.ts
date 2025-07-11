export interface Permission {
  resource: string;
  actions: string[];
}

export interface Role {
  name: 'admin' | 'team' | 'client';
  displayName: string;
  description: string;
  permissions: Permission[];
  features: string[];
}

export const ROLES: Record<string, Role> = {
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with all administrative privileges',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'invite', 'manage_roles'] },
      { resource: 'documents', actions: ['create', 'read', 'update', 'delete', 'download', 'share', 'approve'] },
      { resource: 'folders', actions: ['create', 'read', 'update', 'delete', 'organize'] },
      { resource: 'tasks', actions: ['create', 'read', 'update', 'delete', 'assign', 'complete'] },
      { resource: 'templates', actions: ['create', 'read', 'update', 'delete', 'publish', 'use'] },
      { resource: 'settings', actions: ['read', 'update', 'configure'] },
      { resource: 'analytics', actions: ['read', 'export'] },
      { resource: 'billing', actions: ['read', 'update', 'manage'] },
      { resource: 'integrations', actions: ['read', 'update', 'configure'] }
    ],
    features: [
      'user_management',
      'system_settings',
      'billing_management',
      'analytics_dashboard',
      'audit_logs',
      'api_access',
      'workflow_automation',
      'advanced_reporting',
      'bulk_operations',
      'data_export'
    ]
  },
  team: {
    name: 'team',
    displayName: 'Team Member',
    description: 'Internal team member with document and task management access',
    permissions: [
      { resource: 'users', actions: ['read'] },
      { resource: 'documents', actions: ['create', 'read', 'update', 'download', 'share'] },
      { resource: 'folders', actions: ['create', 'read', 'update', 'organize'] },
      { resource: 'tasks', actions: ['create', 'read', 'update', 'assign', 'complete'] },
      { resource: 'templates', actions: ['create', 'read', 'update', 'use'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] }
    ],
    features: [
      'document_management',
      'task_management',
      'template_creation',
      'collaboration_tools',
      'basic_reporting',
      'file_sharing',
      'workflow_participation'
    ]
  },
  client: {
    name: 'client',
    displayName: 'Client',
    description: 'External client with limited access to assigned documents and tasks',
    permissions: [
      { resource: 'documents', actions: ['read', 'download'] },
      { resource: 'tasks', actions: ['read', 'update'] },
      { resource: 'templates', actions: ['read', 'use'] }
    ],
    features: [
      'document_viewing',
      'document_download',
      'task_updates',
      'template_usage',
      'basic_collaboration',
      'status_tracking'
    ]
  }
};

export const hasPermission = (userRole: string, resource: string, action: string): boolean => {
  const role = ROLES[userRole];
  if (!role) return false;
  
  const permission = role.permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action) : false;
};

export const hasFeature = (userRole: string, feature: string): boolean => {
  const role = ROLES[userRole];
  return role ? role.features.includes(feature) : false;
};

export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissions: Record<string, { resource: string; action: string }> = {
    '/users': { resource: 'users', action: 'read' },
    '/user-management': { resource: 'users', action: 'manage_roles' },
    '/settings': { resource: 'settings', action: 'read' },
    '/analytics': { resource: 'analytics', action: 'read' },
    '/insights': { resource: 'analytics', action: 'read' },
    '/billing': { resource: 'billing', action: 'read' }
  };

  const permission = routePermissions[route];
  if (!permission) return true; // Allow access to routes without specific permissions
  
  return hasPermission(userRole, permission.resource, permission.action);
};