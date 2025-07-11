import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  resource?: string;
  action?: string;
  feature?: string;
  role?: 'admin' | 'team' | 'client';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function PermissionGate({
  resource,
  action,
  feature,
  role,
  fallback = null,
  children
}: PermissionGateProps) {
  const permissions = usePermissions();

  let hasAccess = true;

  if (resource && action) {
    hasAccess = permissions.hasPermission(resource, action);
  } else if (feature) {
    hasAccess = permissions.hasFeature(feature);
  } else if (role) {
    hasAccess = permissions.role === role;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}