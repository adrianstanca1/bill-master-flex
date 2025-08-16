
import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  Plus,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProjectsData, type Project } from '@/hooks/useProjectsData';
import { cn } from '@/lib/utils';

interface ProjectsOverviewProps {
  onViewProject: (id: string) => void;
  onCreateProject: () => void;
}

const ProjectsOverview = memo(({ onViewProject, onCreateProject }: ProjectsOverviewProps) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { projects, analytics, isLoading } = useProjectsData();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'planning': return 'outline';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-GB');

  if (isLoading) {
    return (
      <Card className="glass-effect border-cyber">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-primary/20 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-primary/10 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-cyber">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-gradient">
              <Building2 className="h-5 w-5 text-cyber-primary" />
              Projects Overview
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {analytics.totalProjects} Total
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-success" />
                {analytics.activeProjects} Active
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" />
                {analytics.overdueProjects} Overdue
              </div>
            </div>
          </div>
          <Button onClick={onCreateProject} size={isMobile ? "sm" : "default"} className="cyber-button">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="cyber-card hover:border-cyber-primary/50 transition-all duration-300 hover:shadow-cyber-glow/20"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gradient">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.client || 'No client assigned'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(project.status)} className="ml-2">
                            {project.status}
                          </Badge>
                          {project.health_score !== undefined && (
                            <div className={cn("text-xs font-medium", getHealthColor(project.health_score))}>
                              Health: {Math.round(project.health_score)}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {project.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-cyber-primary" />
                            {project.location}
                          </div>
                        )}
                        {project.start_date && project.end_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-cyber-primary" />
                            {formatDate(project.start_date)} - {formatDate(project.end_date)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-cyber-primary" />
                          {project.progress}% complete
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="text-cyber-primary font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 cyber-progress" />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">
                          <span className={project.spent > project.budget ? 'text-destructive' : 'text-success'}>
                            {formatCurrency(project.spent)}
                          </span>
                          {' / '}
                          <span className="text-muted-foreground">
                            {formatCurrency(project.budget)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => onViewProject(project.id)}
                        className="cyber-button-outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-16 w-16 mx-auto mb-4 opacity-30 text-cyber-primary" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-sm mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first project'}
            </p>
            <Button variant="outline" className="cyber-button-outline" onClick={onCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProjectsOverview.displayName = 'ProjectsOverview';

export { ProjectsOverview };
