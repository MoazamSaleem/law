import React from 'react';
import { User, Settings, LogOut, HelpCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  onClose: () => void;
}

export default function UserDropdown({ onClose }: UserDropdownProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="py-2">
          <button
            onClick={() => handleNavigation('/profile')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => handleNavigation('/settings')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            onClick={() => handleNavigation('/help')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </button>
        </div>
        
        <div className="border-t border-gray-200 py-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}