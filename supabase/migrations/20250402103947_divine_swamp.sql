/*
  # Add message auto-deletion functionality

  1. Changes
    - Add deletion warning status column
    - Create scheduled function to delete old messages
    - Create function to warn about upcoming deletions
    - Set up scheduled job to run cleanup periodically

  2. Security
    - Maintain existing RLS policies
*/

-- Add column for deletion warning status
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deletion_warned boolean DEFAULT false;

-- Create a function to handle message cleanup
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  -- Delete messages older than 5 days
  DELETE FROM messages 
  WHERE timestamp < NOW() - INTERVAL '5 days';

  -- Update warning flag for messages older than 4 days
  UPDATE messages
  SET deletion_warned = true
  WHERE 
    timestamp < NOW() - INTERVAL '4 days' AND 
    deletion_warned = false;
END;
$$ LANGUAGE plpgsql;

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup function to run every hour
SELECT cron.schedule('cleanup-old-messages', '0 * * * *', 'SELECT cleanup_old_messages()');

-- Run initial cleanup
SELECT cleanup_old_messages();