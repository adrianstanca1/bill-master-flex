import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/useCompanyId';

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
}

export const RemindersWidget: React.FC = () => {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState<string>('');

  const load = async () => {
    if (!companyId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('reminders')
      .select('id, title, description, due_date, status')
      .eq('company_id', companyId)
      .order('due_date', { ascending: true })
      .limit(10);
    if (error) {
      toast({ title: 'Failed to load reminders', description: error.message, variant: 'destructive' });
    } else {
      setItems((data || []) as Reminder[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [companyId]);

  const add = async () => {
    if (!companyId) return;
    if (!title.trim() || !due) {
      toast({ title: 'Missing fields', description: 'Add a title and due date.' });
      return;
    }
    const { error } = await supabase.from('reminders').insert({
      company_id: companyId,
      title: title.trim(),
      due_date: new Date(due).toISOString(),
      priority: 'medium',
      category: 'general',
      status: 'pending'
    });
    if (error) {
      toast({ title: 'Could not create reminder', description: error.message, variant: 'destructive' });
    } else {
      setTitle('');
      setDue('');
      toast({ title: 'Reminder added' });
      load();
    }
  };

  const markDone = async (id: string) => {
    const { error } = await supabase.from('reminders').update({ status: 'done' }).eq('id', id);
    if (error) {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
    } else {
      setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!companyId && (
          <div className="text-sm text-muted-foreground">
            Set a valid Company ID in Settings to enable reminders.
          </div>
        )}

        {companyId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
              </div>
              <div>
                <Label className="text-xs">Due date</Label>
                <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button onClick={add} disabled={loading}>Add</Button>
              </div>
            </div>

            <ul className="space-y-2">
              {items.map(r => (
                <li key={r.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">Due {new Date(r.due_date).toLocaleString()} • {r.status}</div>
                  </div>
                  <div>
                    {r.status !== 'done' && (
                      <Button size="sm" variant="outline" onClick={() => markDone(r.id)}>Mark done</Button>
                    )}
                  </div>
                </li>
              ))}
              {items.length === 0 && <div className="text-sm text-muted-foreground">No reminders yet.</div>}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};
