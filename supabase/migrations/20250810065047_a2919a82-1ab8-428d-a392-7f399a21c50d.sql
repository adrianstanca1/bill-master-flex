-- Enable required extensions (idempotent)
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Schedule daily invocation at 06:00 UTC using a new job name to avoid permissions on cron.job
select cron.schedule(
  'task-scheduler-daily-0600-v2',
  '0 6 * * *',
  $$
  select net.http_post(
    url := 'https://zpbuvuxpfemldsknerew.supabase.co/functions/v1/task-scheduler',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnV2dXhwZmVtbGRza25lcmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMTQzMTcsImV4cCI6MjA3MTY5MDMxN30.4wb8_qMaJ0hpkLEv51EWh0pRtVXD3GWWOsuCmZsOx6A"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);
