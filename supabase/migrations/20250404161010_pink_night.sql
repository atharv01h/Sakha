/*
  # Fix Chat Functionality and RLS Policies

  1. Changes
    - Reset and simplify RLS policies
    - Add proper indexes
    - Add constraints for data integrity
    - Fix authentication checks

  2. Security
    - Maintain strict user isolation
    - Ensure proper authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own messages" ON messages;
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;

-- Ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create simplified policies with proper authentication checks
CREATE POLICY "Users can create own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id
);

CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
TO authenticated
USING (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own messages"
ON messages
FOR DELETE
TO authenticated
USING (
    auth.uid() IS NOT NULL AND
    auth.uid() = user_id
);

-- Ensure proper indexes exist
DROP INDEX IF EXISTS idx_messages_user_id;
DROP INDEX IF EXISTS idx_messages_user_timestamp;
DROP INDEX IF EXISTS idx_messages_user_bot;

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_user_timestamp ON messages(user_id, timestamp);
CREATE INDEX idx_messages_user_bot ON messages(user_id, is_bot);

-- Add constraints for data integrity
ALTER TABLE messages DROP CONSTRAINT IF EXISTS check_message_content;
ALTER TABLE messages ADD CONSTRAINT check_message_content
    CHECK (length(content) > 0 AND length(content) <= 10000);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS check_user_type;
ALTER TABLE messages ADD CONSTRAINT check_user_type
    CHECK (user_type IN ('sakha', 'sakhi') OR user_type IS NULL);

-- Ensure foreign key constraint exists
ALTER TABLE messages DROP CONSTRAINT IF EXISTS fk_messages_user;
ALTER TABLE messages ADD CONSTRAINT fk_messages_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;