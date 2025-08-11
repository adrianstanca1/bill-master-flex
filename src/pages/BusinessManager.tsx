
import React, { useState } from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Calendar, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { ProfileUpload } from '@/components/ProfileUpload';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  location: string;
  description: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'business';
  projects: number;
  totalValue: number;
}

export default function BusinessManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Kitchen Renovation',
      client: 'Smith Family',
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      budget: 25000,
      spent: 12500,
      location: 'London, SW1',
      description: 'Complete kitchen renovation including new cabinets, appliances, and flooring'
    },
    {
      id: '2',
      name: 'Office Building Extension',
      client: 'TechCorp Ltd',
      status: 'planning',
      startDate: '2025-02-01',
      budget: 150000,
      spent: 5000,
      location: 'Manchester, M1',
      description: 'Two-story extension to existing office building'
    }
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Smith Family',
      email: 'john.smith@email.com',
      phone: '+44 7700 900123',
      address: '123 High Street, London, SW1A 1AA',
      type: 'individual',
      projects: 1,
      totalValue: 25000
    },
    {
      id: '2',
      name: 'TechCorp Ltd',
      email: 'contact@techcorp.com',
      phone: '+44 161 123 4567',
      address: '456 Business Park, Manchester, M1 1AA',
      type: 'business',
      projects: 1,
      totalValue: 150000
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
    description: ''
  });

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'individual'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddProject = () => {
    if (!newProject.name || !newProject.client || !newProject.startDate || !newProject.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: (projects.length + 1).toString(),
      name: newProject.name,
      client: newProject.client,
      status: 'planning',
      startDate: newProject.startDate,
      endDate: newProject.endDate || undefined,
      budget: parseFloat(newProject.budget),
      spent: 0,
      location: newProject.location,
      description: newProject.description
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      client: '',
      startDate: '',
      endDate: '',
      budget: '',
      location: '',
      description: ''
    });

    toast({
      title: "Project Created",
      description: `${project.name} has been added successfully`,
    });
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      id: (clients.length + 1).toString(),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      address: newClient.address,
      type: newClient.type as 'individual' | 'business',
      projects: 0,
      totalValue: 0
    };

    setClients([...clients, client]);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'individual'
    });

    toast({
      title: "Client Added",
      description: `${client.name} has been added successfully`,
    });
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);

  return (
    <ResponsiveLayout>
      <SEO 
        title="Business Manager" 
        description="Manage your construction business projects, clients, and operations"
      />
      
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Business Manager</h1>
          <p className="text-muted-foreground">Manage your projects, clients, and business operations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab('projects')}>
            <Building2 className="w-4 h-4 mr-2" />
            Projects
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('clients')}>
            <Users className="w-4 h-4 mr-2" />
            Clients
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Overview Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{activeProjects}</div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">£{totalBudget.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">£{totalSpent.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.client} • {project.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        £{project.spent.toLocaleString()} / £{project.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          {/* Add New Project */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="projectClient">Client *</Label>
                  <Input
                    id="projectClient"
                    value={newProject.client}
                    onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget (£) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newProject.location}
                    onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Project location"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddProject}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{project.client} • {project.location}</p>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start:</span>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        {project.endDate && (
                          <div>
                            <span className="text-muted-foreground">End:</span>
                            <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">£{project.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Spent:</span>
                          <p className="font-medium">£{project.spent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6 mt-6">
          {/* Add New Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Name *</Label>
                  <Input
                    id="clientName"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientType">Type</Label>
                  <Select value={newClient.type} onValueChange={(value) => setNewClient(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Phone *</Label>
                  <Input
                    id="clientPhone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="clientAddress">Address</Label>
                  <Textarea
                    id="clientAddress"
                    value={newClient.address}
                    onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                    rows={2}
                  />
                </div>
              </div>
              <Button onClick={handleAddClient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </CardContent>
          </Card>

          {/* Clients List */}
          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <Badge variant={client.type === 'business' ? 'default' : 'secondary'}>
                          {client.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{client.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{client.phone}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Projects:</span>
                          <p className="font-medium">{client.projects}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Value:</span>
                          <p className="font-medium">£{client.totalValue.toLocaleString()}</p>
                        </div>
                        {client.address && (
                          <div className="md:col-span-2">
                            <span className="text-muted-foreground">Address:</span>
                            <p className="font-medium">{client.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <ProfileUpload />
        </TabsContent>
      </Tabs>
    </ResponsiveLayout>
  );
}
