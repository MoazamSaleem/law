import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Users, Building, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'organization', label: 'Organization', icon: Building }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={32} />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Change Photo
                      </button>
                      <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="Umar"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Khan"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="umar@pocketlaw.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue="Legal professional with 10+ years of experience in contract management and corporate law."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Email Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Contract status updates', description: 'Get notified when contract status changes' },
                        { label: 'Task assignments', description: 'Receive notifications for new task assignments' },
                        { label: 'Document uploads', description: 'Get notified when new documents are uploaded' },
                        { label: 'Weekly summary', description: 'Receive weekly activity summary' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add other tab contents similarly */}
            {activeTab !== 'profile' && activeTab !== 'notifications' && activeTab !== 'security' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Settings for {tabs.find(t => t.id === activeTab)?.label} coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}