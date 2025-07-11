import { useAuth } from '../contexts/AuthContext';
import { hasPermission, hasFeature, canAccessRoute } from '../types/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'client';

  return {
    hasPermission: (resource: string, action: string) => 
      hasPermission(userRole, resource, action),
    
    hasFeature: (feature: string) => 
      hasFeature(userRole, feature),
    
    canAccessRoute: (route: string) => 
      canAccessRoute(userRole, route),
    
    isAdmin: () => userRole === 'admin',
    isTeam: () => userRole === 'team',
    isClient: () => userRole === 'client',
    
    role: userRole
  };
};