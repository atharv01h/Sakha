/*
  # Simplify Messages Table RLS Policies

  1. Changes
    - Drop and recreate RLS policies with simpler conditions
    - Fix authentication checks
    - Ensure proper user_id validation

  2. Security
    - Maintain strict user isolation
    - Simplify policy conditions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own messages" ON messages;
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;

-- Ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "Users can create own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_timestamp ON messages(user_id, timestamp);