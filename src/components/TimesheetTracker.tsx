
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, Square, Clock, MapPin, Users, 
  Calendar, Timer, Activity, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Timesheet } from '@/types/business';

export function TimesheetTracker() {
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTimer, setActiveTimer] = useState<Timesheet | null>(null);
  
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

  // Fetch active timesheets
  const { data: timesheets, isLoading } = useQuery({
    queryKey: ['timesheets', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as Timesheet[];
    },
    enabled: !!companyId,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Find active timer
  useEffect(() => {
    const active = timesheets?.find(t => t.status === 'active');
    setActiveTimer(active || null);
    
    if (active) {
      const startTime = new Date(active.start_time).getTime();
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    } else {
      setElapsedTime(0);
    }
  }, [timesheets]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        const startTime = new Date(activeTimer.start_time).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  // Start timer mutation
  const startTimerMutation = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error('No company ID');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if there's already an active timer
      if (activeTimer) {
        throw new Error('Please stop the current timer before starting a new one');
      }

      const { data, error } = await supabase
        .from('timesheets')
        .insert({
          company_id: companyId,
          user_id: user.id,
          project_id: selectedProject || null,
          start_time: new Date().toISOString(),
          description: description.trim() || null,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Timer started",
        description: "Your timesheet tracking has begun.",
      });
      setDescription('');
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to start timer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Stop timer mutation
  const stopTimerMutation = useMutation({
    mutationFn: async () => {
      if (!activeTimer) throw new Error('No active timer');

      const { data, error } = await supabase
        .from('timesheets')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', activeTimer.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Timer stopped",
        description: "Your timesheet has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    return formatTime(diffSeconds);
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
      {/* Timer Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-4xl md:text-6xl font-mono font-bold text-primary">
              {formatTime(elapsedTime)}
            </div>
            {activeTimer && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                <span>Timer running since {new Date(activeTimer.start_time).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Timer Controls */}
          {!activeTimer ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project (Optional)</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
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
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="What are you working on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                onClick={() => startTimerMutation.mutate()}
                disabled={startTimerMutation.isPending}
                className="w-full h-12 text-lg"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Timer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-2">Current Activity</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {activeTimer.description && (
                    <p><strong>Description:</strong> {activeTimer.description}</p>
                  )}
                  {activeTimer.project_id && projects && (
                    <p><strong>Project:</strong> {projects.find(p => p.id === activeTimer.project_id)?.name}</p>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => stopTimerMutation.mutate()}
                disabled={stopTimerMutation.isPending}
                variant="destructive"
                className="w-full h-12 text-lg"
                size="lg"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop Timer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Timesheets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Timesheets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner text="Loading timesheets..." />
          ) : timesheets && timesheets.length > 0 ? (
            <div className="space-y-3">
              {timesheets.map((timesheet) => (
                <div key={timesheet.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={timesheet.status === 'active' ? 'default' : 'secondary'}>
                          {timesheet.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(timesheet.start_time).toLocaleDateString()}
                        </span>
                      </div>
                      {timesheet.description && (
                        <p className="text-sm">{timesheet.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold">
                        {formatDuration(timesheet.start_time, timesheet.end_time)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(timesheet.start_time).toLocaleTimeString()} - 
                        {timesheet.end_time ? new Date(timesheet.end_time).toLocaleTimeString() : 'Running'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No timesheets yet. Start your first timer!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
