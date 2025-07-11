/*
  # Initial Schema Setup for Pocketlaw Dashboard

  1. New Tables
    - `users` - User profiles and authentication data
    - `folders` - Document organization folders
    - `documents` - Document metadata and file references
    - `tasks` - Task management and assignments
    - `templates` - Document templates with variables
    - `comments` - Comments on documents and tasks
    - `activity_logs` - System activity tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up proper access controls

  3. Storage
    - Create storage buckets for documents and avatars
    - Set up storage policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  department text,
  phone text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  parent_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'document',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'agreed', 'esigning', 'signed', 'rejected', 'expired')),
  file_url text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL,
  tags text[] DEFAULT '{}',
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  version integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  assigned_to uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  assigned_by uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  estimated_hours numeric,
  actual_hours numeric,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  content text NOT NULL,
  variables jsonb DEFAULT '[]',
  usage_count integer DEFAULT 0,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('document', 'task')),
  entity_id uuid NOT NULL,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  comment_type text NOT NULL DEFAULT 'comment' CHECK (comment_type IN ('comment', 'approval', 'rejection')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  action text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('document', 'task', 'template', 'user', 'folder')),
  entity_id uuid NOT NULL,
  entity_name text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all profiles" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for folders table
CREATE POLICY "Users can read all folders" ON folders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create folders" ON folders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own folders" ON folders
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own folders" ON folders
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for documents table
CREATE POLICY "Users can read all documents" ON documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create documents" ON documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE TO authenticated USING (
    auth.uid() = created_by OR auth.uid() = assigned_to
  );

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for tasks table
CREATE POLICY "Users can read assigned tasks" ON tasks
  FOR SELECT TO authenticated USING (
    auth.uid() = assigned_to OR auth.uid() = assigned_by
  );

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = assigned_by);

CREATE POLICY "Users can update assigned tasks" ON tasks
  FOR UPDATE TO authenticated USING (
    auth.uid() = assigned_to OR auth.uid() = assigned_by
  );

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE TO authenticated USING (auth.uid() = assigned_by);

-- RLS Policies for templates table
CREATE POLICY "Users can read public templates" ON templates
  FOR SELECT TO authenticated USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create templates" ON templates
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON templates
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own templates" ON templates
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for comments table
CREATE POLICY "Users can read all comments" ON comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- RLS Policies for activity_logs table
CREATE POLICY "Users can read all activity logs" ON activity_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert activity logs" ON activity_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can read documents" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'documents');

CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars bucket
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();