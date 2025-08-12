
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
  Eye
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'active' | 'completed' | 'pending' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
}

interface ProjectsOverviewProps {
  projects: Project[];
  onViewProject: (id: string) => void;
  onCreateProject: () => void;
}

const ProjectsOverview = memo(({ projects, onViewProject, onCreateProject }: ProjectsOverviewProps) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-GB');

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Projects Overview
          </CardTitle>
          <Button onClick={onCreateProject} size={isMobile ? "sm" : "default"}>
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
            <option value="pending">Pending</option>
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
                className="border rounded-lg p-4 hover:bg-card/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                      <Badge variant={getStatusColor(project.status)} className="ml-2">
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.progress}% complete
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">
                        {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={() => onViewProject(project.id)}
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
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No projects found</p>
            <Button variant="outline" className="mt-3" onClick={onCreateProject}>
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
