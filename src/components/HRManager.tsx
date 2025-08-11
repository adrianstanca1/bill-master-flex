
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Plus, Calendar, Award, AlertTriangle, 
  FileText, BookOpen, CheckCircle, Clock,
  User, Phone, Mail, MapPin
} from 'lucide-react';
import { useCompanyId } from '@/hooks/useCompanyId';
import { ErrorHandler } from '@/components/ErrorHandler';

export const HRManager: React.FC = () => {
  const companyId = useCompanyId();
  const [activeTab, setActiveTab] = useState('employees');

  // Mock data - in real app, this would come from the database
  const employees = [
    {
      id: '1',
      name: 'John Smith',
      position: 'Site Manager',
      email: 'john.smith@company.com',
      phone: '+44 7123 456789',
      startDate: '2023-01-15',
      status: 'Active',
      certifications: ['CSCS Gold', 'First Aid', 'SMSTS'],
      trainingStatus: 85
    },
    {
      id: '2',
      name: 'Sarah Jones',
      position: 'Health & Safety Officer',
      email: 'sarah.jones@company.com',
      phone: '+44 7987 654321',
      startDate: '2022-06-01',
      status: 'Active',
      certifications: ['NEBOSH', 'IOSH', 'Fire Safety'],
      trainingStatus: 92
    }
  ];

  const trainingMatrix = [
    {
      course: 'Health & Safety Awareness',
      required: true,
      frequency: 'Annual',
      completionRate: 78,
      nextDue: '2024-03-15'
    },
    {
      course: 'Manual Handling',
      required: true,
      frequency: '3 Years',
      completionRate: 92,
      nextDue: '2024-06-20'
    },
    {
      course: 'Working at Height',
      required: true,
      frequency: '3 Years',
      completionRate: 65,
      nextDue: '2024-04-10'
    }
  ];

  const upcomingTraining = [
    {
      employee: 'John Smith',
      course: 'CSCS Renewal',
      dueDate: '2024-02-28',
      priority: 'High'
    },
    {
      employee: 'Sarah Jones',
      course: 'NEBOSH Refresher',
      dueDate: '2024-03-15',
      priority: 'Medium'
    }
  ];

  if (!companyId) {
    return (
      <ErrorHandler 
        error={new Error('Company ID not found')} 
        context="HR Manager"
        showApiKeyPrompt={false}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Manager</h1>
          <p className="text-muted-foreground">
            Manage employees, training, and certifications
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Certifications</p>
                <p className="text-2xl font-bold">
                  {employees.reduce((acc, emp) => acc + emp.certifications.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Training Due</p>
                <p className="text-2xl font-bold">{upcomingTraining.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="training">Training Matrix</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 mr-1" />
                            {employee.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {employee.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {employee.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Training: {employee.trainingStatus}% complete
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {employee.certifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                        {employee.certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{employee.certifications.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingMatrix.map((training, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{training.course}</h3>
                      <div className="flex items-center space-x-2">
                        {training.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Every {training.frequency}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          Completion Rate: {training.completionRate}%
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${training.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Next Due: {training.nextDue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Training & Renewals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTraining.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h3 className="font-medium">{item.employee}</h3>
                        <p className="text-sm text-muted-foreground">{item.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={item.priority === 'High' ? 'destructive' : 'secondary'}
                        className="mb-1"
                      >
                        {item.priority} Priority
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Due: {item.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HR Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Training Records</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Competency Matrix</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Award className="h-6 w-6 mb-2" />
                  <span>Certification Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Training Schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
