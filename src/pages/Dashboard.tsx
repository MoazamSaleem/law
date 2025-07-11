import React from 'react';
import { Bot, FileText, Upload, PenTool } from 'lucide-react';
import ActionCard from '../components/ActionCard';
import ContractWorkflow from '../components/ContractWorkflow';
import TasksPanel from '../components/TasksPanel';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import PermissionGate from '../components/PermissionGate';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = usePermissions();

  const allActionCards = [
    {
      icon: Bot,
      iconColor: 'bg-blue-100 text-blue-600',
      title: 'Review contract with AI',
      description: 'Get immediate responses to your questions and AI assistance with drafting and summarizing',
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      textColor: 'text-white',
      category: 'FI AI',
      onClick: () => navigate('/ai-review'),
      requiredPermission: { resource: 'documents', action: 'read' }
    },
    {
      icon: FileText,
      iconColor: 'bg-gray-100 text-gray-700',
      title: 'Create a template',
      description: 'Create a reusable document template',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      category: 'Template library',
      onClick: () => navigate('/create-template'),
      requiredPermission: { resource: 'templates', action: 'create' }
    },
    {
      icon: Upload,
      iconColor: 'bg-gray-100 text-gray-700',
      title: 'Upload documents',
      description: 'Upload files or folders to the repository and autotag metadata with AI',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      category: 'Repository',
      onClick: () => navigate('/upload'),
      requiredPermission: { resource: 'documents', action: 'create' }
    },
    {
      icon: PenTool,
      iconColor: 'bg-gray-100 text-gray-700',
      title: 'Send for eSignature',
      description: 'Upload a document and send for eSigning instantly',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      category: 'eSigning',
      onClick: () => navigate('/esignature'),
      requiredPermission: { resource: 'documents', action: 'create' }
    }
  ];

  // Filter action cards based on user permissions
  const actionCards = allActionCards.filter(card => {
    if (!card.requiredPermission) return true;
    return permissions.hasPermission(
      card.requiredPermission.resource, 
      card.requiredPermission.action
    );
  });

  const getWelcomeMessage = () => {
    const roleMessages = {
      admin: `Welcome back ${user?.name?.split(' ')[0]}, manage your legal operations`,
      team: `Welcome back ${user?.name?.split(' ')[0]}, let's get productive`,
      client: `Welcome ${user?.name?.split(' ')[0]}, check your documents and tasks`
    };
    return roleMessages[user?.role as keyof typeof roleMessages] || `Welcome back ${user?.name?.split(' ')[0]}`;
  };
  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getWelcomeMessage()}</h1>
        <p className="text-gray-600 text-lg">
          {permissions.isAdmin() && "Manage your organization and monitor all activities"}
          {permissions.isTeam() && "Here's what's happening in your workspace"}
          {permissions.isClient() && "View your documents and track progress"}
        </p>
      </div>

      {/* Action cards */}
      {actionCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {actionCards.map((card, index) => (
            <div key={index} className="h-40">
              <ActionCard {...card} />
            </div>
          ))}
        </div>
      )}

      {/* Contract workflow and tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <PermissionGate resource="documents" action="read">
          <div className="xl:col-span-2">
            <ContractWorkflow />
          </div>
        </PermissionGate>
        <PermissionGate resource="tasks" action="read">
          <div>
            <TasksPanel />
          </div>
        </PermissionGate>
      </div>

      {/* Role-specific information */}
      <PermissionGate role="client">
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Client Portal</h3>
          <p className="text-blue-700 mb-4">
            You have access to view and download your assigned documents. You can also update task statuses and communicate with your legal team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Documents</h4>
              <p className="text-sm text-gray-600">View and download your files</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Tasks</h4>
              <p className="text-sm text-gray-600">Update your task progress</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Communication</h4>
              <p className="text-sm text-gray-600">Stay in touch with your team</p>
            </div>
          </div>
        </div>
      </PermissionGate>
    </div>
  );
}