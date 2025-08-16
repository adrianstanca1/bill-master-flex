import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from './useCompanyId';
import { useToast } from './use-toast';

export interface Project {
  id: string;
  name: string;
  client?: string;
  location?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  start_date?: string;
  end_date?: string;
  budget: number;
  spent: number;
  estimated_completion?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  meta?: any;
  health_score?: number;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed_at?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  created_by?: string;
}

export const useProjectsData = () => {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects with health scores
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate health scores for each project
      const projectsWithHealth = await Promise.all(
        data.map(async (project) => {
          try {
            const { data: healthScore } = await supabase
              .rpc('calculate_project_health', { project_id: project.id });
            
            return {
              ...project,
              health_score: healthScore || 0
            };
          } catch (err) {
            console.warn('Failed to calculate health score for project:', project.id);
            return { ...project, health_score: 0 };
          }
        })
      );

      return projectsWithHealth as Project[];
    },
    enabled: !!companyId,
  });

  // Fetch project milestones
  const { data: milestones = [] } = useQuery({
    queryKey: ['project-milestones', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('company_id', companyId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as ProjectMilestone[];
    },
    enabled: !!companyId,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'health_score'>) => {
      if (!companyId) throw new Error('No company ID');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          company_id: companyId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', companyId] });
      toast({ title: 'Project created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Update project mutation
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
      queryClient.invalidateQueries({ queryKey: ['projects', companyId] });
      toast({ title: 'Project updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating project',
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async (milestoneData: Omit<ProjectMilestone, 'id' | 'created_at'>) => {
      if (!companyId) throw new Error('No company ID');

      const { data, error } = await supabase
        .from('project_milestones')
        .insert({
          ...milestoneData,
          company_id: companyId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones', companyId] });
      toast({ title: 'Milestone created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating milestone',
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!companyId) return;

    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `company_id=eq.${companyId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['projects', companyId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_milestones',
          filter: `company_id=eq.${companyId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['project-milestones', companyId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId, queryClient]);

  // Analytics calculations
  const analytics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    overdueProjects: projects.filter(p => 
      p.end_date && new Date(p.end_date) < new Date() && p.status !== 'completed'
    ).length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalSpent: projects.reduce((sum, p) => sum + (p.spent || 0), 0),
    averageProgress: projects.length > 0 
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
      : 0,
    averageHealthScore: projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.health_score || 0), 0) / projects.length 
      : 0,
    upcomingMilestones: milestones.filter(m => 
      m.due_date && new Date(m.due_date) >= new Date() && m.status !== 'completed'
    ).slice(0, 5),
    overdueMilestones: milestones.filter(m => 
      m.due_date && new Date(m.due_date) < new Date() && m.status !== 'completed'
    ).length,
  };

  return {
    projects,
    milestones,
    analytics,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    createMilestone: createMilestoneMutation.mutate,
    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProject: updateProjectMutation.isPending,
    isCreatingMilestone: createMilestoneMutation.isPending,
  };
};