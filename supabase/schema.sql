-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  image_url text,
  overall_rating float,
  total_reviews int,
  created_at timestamp with time zone DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  youtube_video_id text,
  title text,
  channel_name text,
  video_url text,
  rating float,
  sentiment_score float,
  published_at timestamp with time zone,
  pros text[],
  cons text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  summary_text text,
  overall_sentiment text,
  confidence_score float,
  total_videos_analyzed int,
  key_points text[],
  pros_summary text[],
  cons_summary text[],
  created_at timestamp with time zone DEFAULT now()
); 