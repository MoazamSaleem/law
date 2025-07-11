import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  CheckSquare, 
  FileType, 
  Settings, 
  User, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [repositoryExpanded, setRepositoryExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/',
      active: location.pathname === '/'
    },
    { 
      icon: FolderOpen, 
      label: 'Repository', 
      path: '/repository',
      expandable: true,
      expanded: repositoryExpanded,
      active: location.pathname === '/repository',
      onToggle: () => setRepositoryExpanded(!repositoryExpanded),
      submenu: [
        { label: 'Folders', path: '/folders', active: location.pathname === '/folders' },
        { label: 'All documents', path: '/all-documents', active: location.pathname === '/all-documents' },
        { label: 'Template drafts', path: '/template-drafts', active: location.pathname === '/template-drafts' }
      ]
    },
    { 
      icon: BarChart3, 
      label: 'Insights', 
      path: '/insights',
      active: location.pathname === '/insights'
    },
    { 
      icon: CheckSquare, 
      label: 'Tasks', 
      path: '/tasks',
      active: location.pathname === '/tasks'
    },
    { 
      icon: FileType, 
      label: 'Templates', 
      path: '/templates',
      active: location.pathname === '/templates'
    },
    { 
      icon: Settings, 
      label: 'Settings',
      path: '/settings',
      expandable: true,
      expanded: settingsExpanded,
      active: location.pathname === '/settings',
      onToggle: () => setSettingsExpanded(!settingsExpanded),
      submenu: [
        { label: 'Users & teams', active: false },
        { label: 'Account', active: false }
      ]
    },
    { 
      icon: BookOpen, 
      label: 'Knowledge hub', 
      path: '/knowledge',
      active: location.pathname === '/knowledge'
    }
  ];

  const handleNavigation = (item: any) => {
    if (item.expandable) {
      item.onToggle?.();
    } else if (item.path) {
      navigate(item.path);
      if (window.innerWidth < 1024) {
        onToggle();
      }
    }
  };

  const handleSubmenuNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };
  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0 flex flex-col`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Pocketlaw</h1>
            <button 
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded">
                Ctrl+K
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    item.active ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.expandable && (
                    item.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </button>
                
                {item.expandable && item.expanded && item.submenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => subItem.path && handleSubmenuNavigation(subItem.path)}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          subItem.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User profile */}
          <div className="px-6 py-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}