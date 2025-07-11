/*
  # Update User Roles Schema

  1. Changes
    - Update user role enum to include 'team' and 'client' instead of 'user' and 'viewer'
    - Add migration for existing data
    - Update constraints and policies

  2. Security
    - Maintain existing RLS policies
    - Update role-based access controls
*/

-- First, add the new role values
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'team', 'client'));

-- Update existing 'user' roles to 'team'
UPDATE users SET role = 'team' WHERE role = 'user';

-- Update existing 'viewer' roles to 'client'  
UPDATE users SET role = 'client' WHERE role = 'viewer';

-- Update RLS policies to use new role names
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add index for better role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update activity logs to track role changes
CREATE OR REPLACE FUNCTION log_user_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO activity_logs (
      action,
      entity_type,
      entity_id,
      entity_name,
      user_id,
      user_name,
      details
    ) VALUES (
      'role_changed',
      'user',
      NEW.id,
      NEW.name,
      auth.uid(),
      (SELECT name FROM users WHERE id = auth.uid()),
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for role changes
DROP TRIGGER IF EXISTS user_role_change_log ON users;
CREATE TRIGGER user_role_change_log
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_user_role_change();