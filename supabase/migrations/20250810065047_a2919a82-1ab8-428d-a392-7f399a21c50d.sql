-- Enable required extensions (idempotent)
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Schedule daily invocation at 06:00 UTC using a new job name to avoid permissions on cron.job
select cron.schedule(
  'task-scheduler-daily-0600-v2',
  '0 6 * * *',
  $$
  select net.http_post(
    url := 'https://zwxyoeqsbntsogvgwily.supabase.co/functions/v1/task-scheduler',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eHlvZXFzYm50c29ndmd3aWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODQ4NzksImV4cCI6MjA3MTU2MDg3OX0.hGZQHoXS_3RaoKpZcz6W8BNNYBt6QnyJMpTJ9HCvpW8"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);
