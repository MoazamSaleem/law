import React, { useState } from 'react';
import { Send, Users, FileText, Calendar, Mail, Plus, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: Date;
}

interface ESignatureRequest {
  id: string;
  documentName: string;
  status: 'draft' | 'sent' | 'completed' | 'expired';
  createdAt: Date;
  dueDate: Date;
  signers: Signer[];
  message?: string;
}

export default function ESignature() {
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [signers, setSigners] = useState<Signer[]>([]);
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [requests, setRequests] = useState<ESignatureRequest[]>([
    {
      id: '1',
      documentName: 'Employment Contract - John Doe.pdf',
      status: 'sent',
      createdAt: new Date('2024-01-20'),
      dueDate: new Date('2024-01-27'),
      signers: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Employee', status: 'pending' },
        { id: '2', name: 'HR Manager', email: 'hr@company.com', role: 'HR', status: 'signed', signedAt: new Date('2024-01-21') }
      ],
      message: 'Please review and sign your employment contract.'
    },
    {
      id: '2',
      documentName: 'Service Agreement - TechCorp.pdf',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-01-22'),
      signers: [
        { id: '3', name: 'Tech Corp CEO', email: 'ceo@techcorp.com', role: 'Client', status: 'signed', signedAt: new Date('2024-01-18') },
        { id: '4', name: 'Legal Team', email: 'legal@company.com', role: 'Legal', status: 'signed', signedAt: new Date('2024-01-19') }
      ]
    }
  ]);

  const addSigner = () => {
    const newSigner: Signer = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: '',
      status: 'pending'
    };
    setSigners([...signers, newSigner]);
  };

  const updateSigner = (id: string, field: keyof Signer, value: string) => {
    setSigners(signers.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const removeSigner = (id: string) => {
    setSigners(signers.filter(s => s.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedDocument(file);
    }
  };

  const handleSendForSignature = () => {
    if (!selectedDocument || signers.length === 0) return;

    const newRequest: ESignatureRequest = {
      id: Date.now().toString(),
      documentName: selectedDocument.name,
      status: 'sent',
      createdAt: new Date(),
      dueDate: new Date(dueDate),
      signers: signers.map(s => ({ ...s, status: 'pending' as const })),
      message
    };

    setRequests([newRequest, ...requests]);
    
    // Reset form
    setSelectedDocument(null);
    setSigners([]);
    setMessage('');
    setDueDate('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignerStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="text-green-600" size={16} />;
      case 'declined': return <AlertCircle className="text-red-600" size={16} />;
      case 'pending': return <Clock className="text-yellow-600" size={16} />;
      default: return <Clock className="text-gray-600" size={16} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">eSignature</h1>
        <p className="text-gray-600">Send documents for electronic signature</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Send for Signature */}
        <div className="xl:col-span-2 space-y-6">
          {/* Document Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
            
            {!selectedDocument ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Select document to send</h4>
                <p className="text-gray-600 mb-4">Upload the document that needs to be signed</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <FileText size={16} />
                  <span>Choose Document</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX files up to 10MB</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-blue-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">{selectedDocument.name}</p>
                      <p className="text-sm text-gray-500">{(selectedDocument.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Signers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Signers</h3>
              <button
                onClick={addSigner}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Add Signer</span>
              </button>
            </div>

            {signers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-600">No signers added yet</p>
                <p className="text-xs text-gray-500 mt-1">Add people who need to sign this document</p>
              </div>
            ) : (
              <div className="space-y-4">
                {signers.map((signer, index) => (
                  <div key={signer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Signer {index + 1}</span>
                      <button
                        onClick={() => removeSigner(signer.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={signer.name}
                        onChange={(e) => updateSigner(signer.id, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={signer.email}
                        onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Role/Title"
                        value={signer.role}
                        onChange={(e) => updateSigner(signer.id, 'role', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message and Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message & Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message to Signers</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a personal message for the signers..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSendForSignature}
                disabled={!selectedDocument || signers.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
                <span>Send for Signature</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
          
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{request.documentName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  {request.signers.map((signer) => (
                    <div key={signer.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{signer.name}</span>
                      <div className="flex items-center space-x-1">
                        {getSignerStatusIcon(signer.status)}
                        <span className="text-gray-500">{signer.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Due: {request.dueDate.toLocaleDateString()}</span>
                  <span>{request.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}