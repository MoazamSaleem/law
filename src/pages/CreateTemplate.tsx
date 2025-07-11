import React, { useState } from 'react';
import { Save, Eye, Plus, Trash2, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'dropdown';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'Legal',
    tags: '',
    content: '',
    isPublic: false
  });
  
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['Legal', 'Commercial', 'HR', 'Finance', 'IT', 'Marketing'];

  const addVariable = () => {
    const newVariable: TemplateVariable = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false
    };
    setVariables([...variables, newVariable]);
  };

  const updateVariable = (id: string, field: keyof TemplateVariable, value: any) => {
    setVariables(variables.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const handleSave = () => {
    // Here you would save the template
    console.log('Saving template:', { templateData, variables });
    navigate('/templates');
  };

  const renderPreview = () => {
    let content = templateData.content;
    variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      const replacement = variable.defaultValue || `[${variable.name.toUpperCase()}]`;
      content = content.replace(new RegExp(placeholder, 'g'), replacement);
    });
    return content;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/templates')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Template</h1>
            <p className="text-gray-600">Build reusable document templates</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye size={16} />
            <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            <span>Save Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Template Editor */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={templateData.category}
                  onChange={(e) => setTemplateData({...templateData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={templateData.description}
                onChange={(e) => setTemplateData({...templateData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what this template is for"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={templateData.tags}
                onChange={(e) => setTemplateData({...templateData, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contract, legal, standard"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={templateData.isPublic}
                onChange={(e) => setTemplateData({...templateData, isPublic: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                Make this template public for all users
              </label>
            </div>
          </div>

          {/* Template Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Content</h3>
            
            {showPreview ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-96">
                <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                  {renderPreview() || 'Start typing your template content...'}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Use variables like <code className="bg-gray-100 px-1 rounded">{'{{company_name}}'}</code> that will be replaced when creating documents.
                  </p>
                </div>
                <textarea
                  value={templateData.content}
                  onChange={(e) => setTemplateData({...templateData, content: e.target.value})}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter your template content here...

Example:
This {{contract_type}} is entered into on {{date}} between {{company_name}} and {{client_name}}.

Terms and Conditions:
1. {{term_1}}
2. {{term_2}}

Signature: {{signature_date}}"
                />
              </div>
            )}
          </div>
        </div>

        {/* Variables Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Template Variables</h3>
            <button
              onClick={addVariable}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Variable</span>
            </button>
          </div>

          {variables.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="text-sm text-gray-600">No variables added yet</p>
              <p className="text-xs text-gray-500 mt-1">Variables make templates reusable</p>
            </div>
          ) : (
            <div className="space-y-4">
              {variables.map((variable) => (
                <div key={variable.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                      placeholder="Variable name"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeVariable(variable.id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={variable.type}
                      onChange={(e) => updateVariable(variable.id, 'type', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Yes/No</option>
                      <option value="dropdown">Dropdown</option>
                    </select>

                    <input
                      type="text"
                      value={variable.defaultValue || ''}
                      onChange={(e) => updateVariable(variable.id, 'defaultValue', e.target.value)}
                      placeholder="Default value"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`required-${variable.id}`}
                        checked={variable.required}
                        onChange={(e) => updateVariable(variable.id, 'required', e.target.checked)}
                        className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`required-${variable.id}`} className="ml-2 text-xs text-gray-700">
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Usage Instructions</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use {'{{variable_name}}'} in your content</li>
              <li>• Variables will be replaced when creating documents</li>
              <li>• Required variables must be filled</li>
              <li>• Default values are used if not specified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}