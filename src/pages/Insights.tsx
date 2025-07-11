import React from 'react';
import { TrendingUp, TrendingDown, FileText, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { mockInsights } from '../data/mockData';

export default function Insights() {
  const getIcon = (type: string) => {
    const icons = {
      contracts: FileText,
      revenue: DollarSign,
      time: Clock,
      efficiency: CheckCircle
    };
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon size={24} />;
  };

  const getIconColor = (type: string) => {
    const colors = {
      contracts: 'text-blue-600',
      revenue: 'text-green-600',
      time: 'text-orange-600',
      efficiency: 'text-purple-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insights</h1>
        <p className="text-gray-600">Track your contract performance and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {mockInsights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gray-50 ${getIconColor(insight.type)}`}>
                {getIcon(insight.type)}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                insight.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {insight.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{Math.abs(insight.change)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</h3>
            <p className="text-sm text-gray-600">{insight.title}</p>
            <p className="text-xs text-gray-500 mt-1">{insight.period}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Contract Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Contract Status Distribution</h3>
          <div className="space-y-4">
            {[
              { status: 'Signed', count: 45, percentage: 45, color: 'bg-green-500' },
              { status: 'Review', count: 23, percentage: 23, color: 'bg-yellow-500' },
              { status: 'Draft', count: 18, percentage: 18, color: 'bg-gray-500' },
              { status: 'eSigning', count: 14, percentage: 14, color: 'bg-blue-500' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Activity</h3>
          <div className="space-y-4">
            {[
              { month: 'January', contracts: 32, value: '$1.2M' },
              { month: 'February', contracts: 28, value: '$980K' },
              { month: 'March', contracts: 35, value: '$1.4M' },
              { month: 'April', contracts: 41, value: '$1.6M' }
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{item.contracts} contracts</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Contract signed', document: 'Service Agreement - TechCorp', time: '2 hours ago', user: 'John Doe' },
            { action: 'Document uploaded', document: 'NDA Template v2.1', time: '4 hours ago', user: 'Sarah Johnson' },
            { action: 'Review completed', document: 'Employment Contract', time: '1 day ago', user: 'Legal Team' },
            { action: 'Template created', document: 'Consulting Agreement', time: '2 days ago', user: 'Umar' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.document}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{activity.user}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}