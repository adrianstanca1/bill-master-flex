import { Schema, Table, column, PowerSyncDatabase } from '@powersync/web';
import { supabase } from '@/integrations/supabase/client';

// Define the local PowerSync schema. This mirrors the `reminders` table in
// Supabase and adds a `synced` column to track pending local changes.
const AppSchema = new Schema({
  reminders: new Table({
    assigned_to: column.text,
    category: column.text,
    company_id: column.text,
    created_at: column.text,
    created_by: column.text,
    description: column.text,
    due_date: column.text,
    priority: column.text,
    project_id: column.text,
    recurring: column.integer,
    recurring_pattern: column.text,
    status: column.text,
    title: column.text,
    updated_at: column.text,
    synced: column.integer
  })
});

export const powersync = new PowerSyncDatabase({
  schema: AppSchema,
  database: { dbFilename: 'offline.db' }
});

// Synchronize local PowerSync data with Supabase. Unsynced local rows are
// pushed first, followed by fetching the latest remote rows.
export async function syncOfflineData() {
  try {
    await powersync.init();

    // Push unsynced local reminders to Supabase
    const unsynced = await powersync.execute(
      'SELECT id, assigned_to, category, company_id, created_at, created_by, description, due_date, priority, project_id, recurring, recurring_pattern, status, title, updated_at FROM reminders WHERE synced = 0'
    );
    const pending = unsynced.rows?._array ?? [];

    if (pending.length) {
      const { error } = await supabase
        .from('reminders')
        .upsert(
          pending.map((r: any) => ({
            ...r,
            recurring: !!r.recurring
          }))
        );
      if (error) throw error;

      await powersync.execute(
        `UPDATE reminders SET synced = 1 WHERE id IN (${pending
          .map(() => '?')
          .join(',')})`,
        pending.map((r: any) => r.id)
      );
    }

    // Pull latest reminders from Supabase
    const { data: remote, error: pullError } = await supabase
      .from('reminders')
      .select('*');
    if (pullError) throw pullError;

    if (remote) {
      await powersync.writeTransaction(async (tx) => {
        for (const r of remote) {
          await tx.execute(
            'INSERT OR REPLACE INTO reminders (id, assigned_to, category, company_id, created_at, created_by, description, due_date, priority, project_id, recurring, recurring_pattern, status, title, updated_at, synced) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)',
            [
              r.id,
              r.assigned_to,
              r.category,
              r.company_id,
              r.created_at,
              r.created_by,
              r.description,
              r.due_date,
              r.priority,
              r.project_id,
              r.recurring ? 1 : 0,
              r.recurring_pattern,
              r.status,
              r.title,
              r.updated_at
            ]
          );
        }
      });
    }
  } catch (err) {
    console.error('PowerSync synchronization failed', err);
  }
}
