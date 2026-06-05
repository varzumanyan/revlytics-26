CREATE TABLE public.dashboard_config (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  current_month TEXT NOT NULL,
  current_month_short TEXT NOT NULL,
  ytd_years INTEGER[] NOT NULL,
  months_elapsed INTEGER NOT NULL,
  percentage_threshold NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton_row CHECK (id = 'singleton')
);

GRANT SELECT ON public.dashboard_config TO anon;
GRANT SELECT, INSERT, UPDATE ON public.dashboard_config TO authenticated;
GRANT ALL ON public.dashboard_config TO service_role;

ALTER TABLE public.dashboard_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read dashboard config"
  ON public.dashboard_config FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert dashboard config"
  ON public.dashboard_config FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update dashboard config"
  ON public.dashboard_config FOR UPDATE
  USING (true) WITH CHECK (true);

GRANT INSERT, UPDATE ON public.dashboard_config TO anon;

INSERT INTO public.dashboard_config (id, current_month, current_month_short, ytd_years, months_elapsed, percentage_threshold)
VALUES ('singleton', 'April', 'Apr', ARRAY[2024,2025,2026], 10, 0.8333);