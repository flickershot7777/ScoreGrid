-- ============================================
-- ExamPro — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Categories (managed by OPCO)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📚',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Exams (managed by OPCO, belong to a category)
CREATE TABLE exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  total_questions INTEGER NOT NULL DEFAULT 10,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Questions (belong to an exam)
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Exam Results (saved per user attempt)
CREATE TABLE exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB,
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Categories: anyone can read active categories
CREATE POLICY "Anyone can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Categories: authenticated users can do everything (OPCO check is in app code)
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Exams: anyone can read active exams
CREATE POLICY "Anyone can read active exams"
  ON exams FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage exams"
  ON exams FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Questions: authenticated users can read questions
CREATE POLICY "Authenticated users can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage questions"
  ON questions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Exam Results: users can read their own results
CREATE POLICY "Users can read own results"
  ON exam_results FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Exam Results: users can insert their own results
CREATE POLICY "Users can insert own results"
  ON exam_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Exam Results: OPCO can read all results (via authenticated)
CREATE POLICY "Authenticated can read all results"
  ON exam_results FOR SELECT
  TO authenticated
  USING (true);
