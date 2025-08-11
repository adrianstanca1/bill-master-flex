
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Timesheet } from '@/types/business';

export function TimesheetTracker() {
  const [activeTimer, setActiveTimer] = useState<Timesheet | null>(null);
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();
  const companyId = useCompanyId();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['projects', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('company_id', companyId);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  // Fetch active timesheet
  const { data: timesheets } = useQuery({
    queryKey: ['timesheets', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Timesheet[];
    },
    enabled: !!companyId,
  });

  // Start timer mutation
  const startTimerMutation = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error('No company ID');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('timesheets')
        .insert({
          company_id: companyId,
          user_id: user.id,
          project_id: selectedProject || null,
          start_time: new Date().toISOString(),
          description,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Timesheet;
    },
    onSuccess: (data) => {
      setActiveTimer(data);
      toast({
        title: "Timer started",
        description: "Your timesheet tracking has begun.",
      });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  // Stop timer mutation
  const stopTimerMutation = useMutation({
    mutationFn: async (timesheetId: string) => {
      const { error } = await supabase
        .from('timesheets')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', timesheetId);

      if (error) throw error;
    },
    onSuccess: () => {
      setActiveTimer(null);
      setElapsedTime(0);
      toast({
        title: "Timer stopped",
        description: "Timesheet has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  // Update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        const start = new Date(activeTimer.start_time).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeTimer]);

  // Check for active timer on load
  useEffect(() => {
    if (timesheets && timesheets.length > 0) {
      setActiveTimer(timesheets[0]);
    }
  }, [timesheets]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!companyId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please set up your company in Settings first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTimer ? (
            <div className="text-center space-y-4">
              <div className="text-4xl font-mono font-bold text-primary">
                {formatTime(elapsedTime)}
              </div>
              <Badge variant="outline" className="text-green-600">
                Timer Active
              </Badge>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Started: {new Date(activeTimer.start_time).toLocaleString()}
                </p>
                {activeTimer.description && (
                  <p className="text-sm">Task: {activeTimer.description}</p>
                )}
              </div>
              <Button 
                onClick={() => stopTimerMutation.mutate(activeTimer.id)}
                disabled={stopTimerMutation.isPending}
                variant="destructive"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Timer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project (Optional)</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Task Description</label>
                <Textarea
                  placeholder="What are you working on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button 
                onClick={() => startTimerMutation.mutate()}
                disabled={startTimerMutation.isPending}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
