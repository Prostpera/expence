-- Add is_daily field to quests table
ALTER TABLE quests
ADD COLUMN IF NOT EXISTS is_daily BOOLEAN DEFAULT FALSE;

-- Create daily_quest_completions table
CREATE TABLE IF NOT EXISTS daily_quest_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exp_earned INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id, completed_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_completions_user_id ON daily_quest_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_completions_quest_id ON daily_quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_daily_completions_date ON daily_quest_completions(completed_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_completions_user_quest ON daily_quest_completions(user_id, quest_id);
CREATE INDEX IF NOT EXISTS idx_quests_is_daily ON quests(is_daily) WHERE is_daily = TRUE;

-- Row Level Security Policies
ALTER TABLE daily_quest_completions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own daily completions
CREATE POLICY "Users can view their own daily completions"
  ON daily_quest_completions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily completions
CREATE POLICY "Users can insert their own daily completions"
  ON daily_quest_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update or delete daily completions (immutable record)
CREATE POLICY "Users cannot update daily completions"
  ON daily_quest_completions FOR UPDATE
  USING (false);

CREATE POLICY "Users cannot delete daily completions"
  ON daily_quest_completions FOR DELETE
  USING (false);

-- Function to calculate streak for a user's daily quest
CREATE OR REPLACE FUNCTION get_daily_quest_streak(p_user_id UUID, p_quest_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  -- Loop backwards from today to find consecutive days
  LOOP
    -- Check if there's a completion for this date
    IF EXISTS (
      SELECT 1 FROM daily_quest_completions
      WHERE user_id = p_user_id
        AND quest_id = p_quest_id
        AND completed_date = check_date
    ) THEN
      current_streak := current_streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      -- Streak broken
      EXIT;
    END IF;
  END LOOP;

  RETURN current_streak;
END;
$$ LANGUAGE plpgsql STABLE;
