
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, MapPin, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  start_date: string;
  end_date: string;
  project_manager_user_id: string;
  meta: {
    description?: string;
    budget?: number;
    progress?: number;
    status?: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
    milestones?: Array<{
      id: string;
      name: string;
      date: string;
      completed: boolean;
    }>;
  };
  created_at: string;
}

export function ProjectTracker() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    budget: '',
  });
  
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    enabled: !!companyId,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      if (!companyId) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          company_id: companyId,
          name: projectData.name,
          client: projectData.client,
          location: projectData.location,
          start_date: projectData.start_date || null,
          end_date: projectData.end_date || null,
          meta: {
            description: projectData.description,
            budget: projectData.budget ? parseFloat(projectData.budget) : null,
            progress: 0,
            status: 'planning' as const,
            milestones: []
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowNewProject(false);
      setNewProject({
        name: '',
        client: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        budget: '',
      });
      toast({ title: "Project created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create project", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: "Project updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update project", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.client) {
      toast({
        title: "Missing Information",
        description: "Please fill in project name and client",
        variant: "destructive"
      });
      return;
    }
    
    createProjectMutation.mutate(newProject);
  };

  const updateProjectProgress = (project: Project, progress: number) => {
    const status = progress >= 100 ? 'completed' : progress > 0 ? 'active' : 'planning';
    
    updateProjectMutation.mutate({
      id: project.id,
      updates: {
        meta: {
          ...project.meta,
          progress,
          status
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'active': return <Clock className="h-4 w-4" />;
      case 'on-hold': return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (isLoading && companyId) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Tracker</h1>
          <p className="text-muted-foreground">Manage and track your construction projects</p>
        </div>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {!companyId && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Sign in to track projects or use the demo view below
            </p>
          </CardContent>
        </Card>
      )}

      {/* New Project Form */}
      {showNewProject && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Kitchen Extension"
                />
              </div>
              <div>
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  value={newProject.client}
                  onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="ABC Construction Ltd"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProject.location}
                  onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="London, UK"
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget (£)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed project description..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCreateProject} 
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewProject(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(!companyId ? [
          // Demo projects for non-authenticated users
          {
            id: 'demo-1',
            name: 'Kitchen Extension',
            client: 'Smith Family',
            location: 'Manchester',
            start_date: '2025-01-15',
            end_date: '2025-03-15',
            meta: { 
              progress: 65, 
              status: 'active',
              budget: 35000,
              description: 'Single-story kitchen extension with bi-fold doors'
            },
            created_at: '2025-01-01'
          },
          {
            id: 'demo-2',
            name: 'Bathroom Renovation',
            client: 'Johnson Ltd',
            location: 'Birmingham',
            start_date: '2025-02-01',
            end_date: '2025-02-28',
            meta: { 
              progress: 25, 
              status: 'active',
              budget: 15000,
              description: 'Complete bathroom refurbishment'
            },
            created_at: '2025-01-15'
          }
        ] : projects).map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.meta?.status || 'planning')}>
                  {getStatusIcon(project.meta?.status || 'planning')}
                  <span className="ml-1 capitalize">{project.meta?.status || 'planning'}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {project.client}
                </div>
                {project.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                )}
                {project.start_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(project.start_date), 'dd/MM/yyyy')}
                    {project.end_date && ` - ${format(new Date(project.end_date), 'dd/MM/yyyy')}`}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.meta?.progress || 0}%</span>
                </div>
                <Progress value={project.meta?.progress || 0} className="h-2" />
              </div>

              {project.meta?.budget && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-semibold">£{project.meta.budget.toLocaleString()}</span>
                </div>
              )}

              {companyId && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details
                  </Button>
                  {project.meta?.progress < 100 && (
                    <Button 
                      size="sm"
                      onClick={() => updateProjectProgress(project, Math.min(100, (project.meta?.progress || 0) + 25))}
                    >
                      Update Progress
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && companyId && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Button onClick={() => setShowNewProject(true)}>
              Create your first project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
