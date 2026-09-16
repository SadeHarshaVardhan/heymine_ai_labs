CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT NOT NULL,
  groq_api_key_encrypted TEXT,
  use_own_key BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT DEFAULT 'general',
  cache_key TEXT NOT NULL,
  description TEXT NOT NULL,
  constraints JSONB NOT NULL DEFAULT '[]'::jsonb,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  language TEXT,
  status TEXT NOT NULL DEFAULT 'attempted' CHECK (status IN ('attempted', 'passed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_cache_key ON public.questions(cache_key);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty_topic ON public.questions(difficulty, topic);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON public.question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON public.question_attempts(question_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_user_question ON public.question_attempts(user_id, question_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'username', ''), SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.increment_question_usage(question_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.questions
  SET usage_count = usage_count + 1
  WHERE id = question_uuid;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;

DROP INDEX IF EXISTS profiles_username_key;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;
CREATE POLICY "Authenticated users can read questions"
ON public.questions FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can view own attempts" ON public.question_attempts;
CREATE POLICY "Users can view own attempts"
ON public.question_attempts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.question_attempts;
CREATE POLICY "Users can insert own attempts"
ON public.question_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attempts" ON public.question_attempts;
CREATE POLICY "Users can update own attempts"
ON public.question_attempts FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
