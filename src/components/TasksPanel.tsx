import React, { useState } from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { mockTasks } from '../data/mockData';

const taskTabs = [
  { id: 'todo', label: 'To-do', count: mockTasks.filter(t => t.status === 'todo').length },
  { id: 'completed', label: 'Completed', count: mockTasks.filter(t => t.status === 'completed').length }
];

export default function TasksPanel() {
  const [activeTab, setActiveTab] = useState('todo');

  const todoTasks = mockTasks.filter(task => task.status === 'todo');
  const completedTasks = mockTasks.filter(task => task.status === 'completed');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Show all
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mb-6 border-b border-gray-200 -mx-1">
        {taskTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Empty state for to-do */}
      {activeTab === 'todo' && (
        <div>
          {todoTasks.length > 0 ? (
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <div key={task.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{task.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due {task.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-gray-400" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">To-do</h3>
              <p className="text-sm text-gray-600">You have no tasks to complete</p>
            </div>
          )}
          </div>
      )}

      {/* Empty state for completed */}
      {activeTab === 'completed' && (
        <div>
          {completedTasks.length > 0 ? (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div key={task.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-700 text-sm mb-1 line-through">{task.title}</h4>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Well done!</h3>
              <p className="text-sm text-gray-600">You have completed all your tasks</p>
            </div>
          )}
          </div>
      )}
    </div>
  );
}