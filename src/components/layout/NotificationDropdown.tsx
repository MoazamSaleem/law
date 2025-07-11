import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    title: 'Contract Review Required',
    message: 'TechCorp Service Agreement needs your review',
    type: 'warning' as const,
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    title: 'Document Signed',
    message: 'Employment Contract - John Doe has been signed',
    type: 'success' as const,
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    title: 'Task Assigned',
    message: 'You have been assigned to update NDA Template',
    type: 'info' as const,
    time: '2 hours ago',
    read: true
  }
];

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'info':
        return <Info className="text-blue-500" size={16} />;
      default:
        return <Bell className="text-gray-500" size={16} />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}