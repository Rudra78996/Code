/*
  # Create projects table for storing user project history
  
  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `dimensions` (jsonb)
      - `materials` (jsonb)
      - `labor` (jsonb)
      - `total_cost` (numeric)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `projects` table
    - Add policies for users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  dimensions jsonb NOT NULL,
  materials jsonb NOT NULL,
  labor jsonb NOT NULL,
  total_cost numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);