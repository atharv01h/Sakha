/*
  # Fix Messages Table RLS Policies

  1. Changes
    - Drop existing RLS policies for messages table
    - Create new, properly configured RLS policies for messages table
    - Ensure policies handle both authenticated and system-generated messages

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - INSERT: Users can only create messages with their own user_id
      - SELECT: Users can read their own messages
      - DELETE: Users can delete their own messages
    - Special handling for bot messages (is_bot = true)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own messages" ON messages;
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;

-- Create new policies
CREATE POLICY "Users can create own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) OR 
  (is_bot = true AND auth.uid() IS NOT NULL)
);

CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id) OR 
  (is_bot = true AND user_id = auth.uid())
);

CREATE POLICY "Users can delete own messages"
ON messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);