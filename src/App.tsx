import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIReview from './pages/AIReview';
import CreateTemplate from './pages/CreateTemplate';
import UploadDocuments from './pages/UploadDocuments';
import ESignature from './pages/ESignature';
import Folders from './pages/Folders';
import AllDocuments from './pages/AllDocuments';
import TemplateDrafts from './pages/TemplateDrafts';
import KnowledgeHub from './pages/KnowledgeHub';
import Repository from './pages/Repository';
import Insights from './pages/Insights';
import Tasks from './pages/Tasks';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="ai-review" element={<AIReview />} />
            <Route path="create-template" element={<CreateTemplate />} />
            <Route path="upload" element={<UploadDocuments />} />
            <Route path="esignature" element={<ESignature />} />
            <Route path="folders" element={<Folders />} />
            <Route path="all-documents" element={<AllDocuments />} />
            <Route path="template-drafts" element={<TemplateDrafts />} />
            <Route path="knowledge" element={<KnowledgeHub />} />
            <Route path="repository" element={<Repository />} />
            <Route path="insights" element={<Insights />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="templates" element={<Templates />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;