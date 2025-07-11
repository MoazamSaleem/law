import React, { useState } from 'react';
import { Bell, Search, Plus, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

interface HeaderProps {
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

export default function Header({ onSidebarToggle, sidebarOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search documents, tasks, templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right side - Actions + User */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <button className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            <span className="hidden md:inline">New</span>
          </button>

          {/* Mobile search button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </button>
            {showUserMenu && (
              <UserDropdown onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}