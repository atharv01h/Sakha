/*
  # Fix Messages Table RLS Policies

  1. Changes
    - Drop and recreate RLS policies with proper conditions
    - Fix bot message handling in policies
    - Ensure proper user authentication checks

  2. Security
    - Maintain strict user isolation
    - Allow bot messages to be created and read by authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own messages" ON messages;
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;

-- Ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper conditions
CREATE POLICY "Users can create own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
    CASE 
        WHEN is_bot = true THEN 
            auth.uid() = user_id
        ELSE 
            auth.uid() = user_id
    END
);

CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own messages"
ON messages
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_messages_user_bot 
ON messages(user_id, is_bot);