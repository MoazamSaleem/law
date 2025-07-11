import React from 'react';
import { Bot, FileText, Upload, PenTool } from 'lucide-react';
import ActionCard from '../components/ActionCard';
import ContractWorkflow from '../components/ContractWorkflow';
import TasksPanel from '../components/TasksPanel';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actionCards = [
    {
      icon: Bot,
      iconColor: 'bg-blue-100 text-blue-600',
      title: 'Review contract with AI',
      description: 'Get immediate responses to your questions and AI assistance with drafting and summarizing',
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      textColor: 'text-white',
      category: 'FI AI',
      onClick: () => navigate('/ai-review')
    },
    {
      icon: FileText,
      iconColor: 'bg-gray-100 text-gray-700',
      title: 'Create a template',
      description: 'Create a reusable document template',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      category: 'Template library',
      onClick: () => navigate('/create-template')
    },
    {
      icon: Upload,
      iconColor: 'bg-gray-100 text-gray-700',
      title: 'Upload documents',
      description: 'Upload files or folders to the repository and autotag metadata with AI',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      category: 'Repository',
      onClick: () => navigate('/upload')
    },
    {
      icon: PenTool,
      iconColor: 'bg-gray-100 text-gray-700',
      title: 'Send for eSignature',
      description: 'Upload a document and send for eSigning instantly',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      category: 'eSigning',
      onClick: () => navigate('/esignature')
    }
  ];

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back {user?.name?.split(' ')[0]},</h1>
        <p className="text-gray-600 text-lg">Here is what's happening in your account</p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {actionCards.map((card, index) => (
          <div key={index} className="h-40">
            <ActionCard {...card} />
          </div>
        ))}
      </div>

      {/* Contract workflow and tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ContractWorkflow />
        </div>
        <div>
          <TasksPanel />
        </div>
      </div>
    </div>
  );
}