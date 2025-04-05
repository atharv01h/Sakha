/*
  # Enhance chat security and user isolation

  1. Changes
    - Add RLS policies to ensure users can only access their own messages
    - Add indexes for better query performance
    - Add constraints for data integrity

  2. Security
    - Strengthen RLS policies
    - Add user_id validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

-- Add user_id index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Add composite index for user_id and timestamp
CREATE INDEX IF NOT EXISTS idx_messages_user_timestamp ON messages(user_id, timestamp);

-- Add RLS policies with strict user isolation
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    AND user_id IS NOT NULL
  );

CREATE POLICY "Users can create own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND user_id IS NOT NULL
  );

CREATE POLICY "Users can delete own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND user_id IS NOT NULL
  );

-- Add foreign key constraint to ensure user_id exists
ALTER TABLE messages
  ADD CONSTRAINT fk_messages_user
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Add check constraint for valid message content
ALTER TABLE messages
  ADD CONSTRAINT check_message_content
  CHECK (length(content) > 0 AND length(content) <= 10000);

-- Add check constraint for valid user_type
ALTER TABLE messages
  ADD CONSTRAINT check_user_type
  CHECK (user_type IN ('sakha', 'sakhi') OR user_type IS NULL);