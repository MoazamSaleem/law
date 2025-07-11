import React, { useState } from 'react';
import { Bot, Upload, FileText, Send, Sparkles, AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface AIAnalysis {
  id: string;
  type: 'risk' | 'suggestion' | 'compliance' | 'clause';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion?: string;
  location?: string;
}

export default function AIReview() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis[]>([]);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);

  const mockAnalysis: AIAnalysis[] = [
    {
      id: '1',
      type: 'risk',
      severity: 'high',
      title: 'Unlimited Liability Clause',
      description: 'The contract contains an unlimited liability clause that could expose your organization to significant financial risk.',
      suggestion: 'Consider adding a liability cap clause limiting damages to the contract value or a specific amount.',
      location: 'Section 8.2'
    },
    {
      id: '2',
      type: 'compliance',
      severity: 'medium',
      title: 'GDPR Compliance Gap',
      description: 'The data processing terms may not fully comply with GDPR requirements.',
      suggestion: 'Add specific GDPR compliance language and data subject rights provisions.',
      location: 'Section 12.1'
    },
    {
      id: '3',
      type: 'suggestion',
      severity: 'low',
      title: 'Termination Notice Period',
      description: 'The 30-day termination notice period is shorter than industry standard.',
      suggestion: 'Consider extending to 60 or 90 days for better planning.',
      location: 'Section 15.3'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    setChatHistory(prev => [...prev, { type: 'user', message: question }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on the contract analysis, this clause appears to be standard for this type of agreement.",
        "I recommend reviewing this section with your legal team as it may have compliance implications.",
        "This term is favorable to your organization and aligns with industry best practices.",
        "Consider negotiating this clause as it may pose potential risks to your business."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { type: 'ai', message: randomResponse }]);
    }, 1000);
    
    setQuestion('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertCircle size={16} className="text-red-600" />;
      case 'compliance': return <CheckCircle size={16} className="text-yellow-600" />;
      case 'suggestion': return <Sparkles size={16} className="text-blue-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Bot className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Contract Review</h1>
            <p className="text-gray-600">Get instant AI-powered analysis and insights for your contracts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upload and Analysis */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Contract</h3>
            
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your contract</h4>
                <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload size={16} />
                  <span>Choose File</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX, TXT files up to 10MB</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-blue-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Bot size={16} />
                        <span>Analyze with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
              
              <div className="space-y-4">
                {analysis.map((item) => (
                  <div key={item.id} className={`border rounded-lg p-4 ${getSeverityColor(item.severity)}`}>
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.title}</h4>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                            {item.location}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{item.description}</p>
                        {item.suggestion && (
                          <div className="bg-white bg-opacity-50 rounded p-3 mt-2">
                            <p className="text-sm font-medium">Recommendation:</p>
                            <p className="text-sm">{item.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Chat Assistant */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask AI Assistant</h3>
          
          {/* Chat History */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-600">Ask questions about your contract</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    chat.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {chat.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Question Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about clauses, risks, compliance..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button
              onClick={handleAskQuestion}
              disabled={!question.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Quick Questions */}
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Quick questions:</p>
            <div className="space-y-1">
              {[
                "What are the main risks in this contract?",
                "Is this contract GDPR compliant?",
                "What's the termination process?",
                "Are there any unusual clauses?"
              ].map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="block w-full text-left text-xs text-blue-600 hover:text-blue-700 py-1"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}