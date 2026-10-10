CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Allow public read comments" ON public.comments
    FOR SELECT USING (true);

-- Allow anyone to insert comments
CREATE POLICY "Allow public insert comments" ON public.comments
    FOR INSERT WITH CHECK (true);
