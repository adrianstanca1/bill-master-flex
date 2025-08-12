
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
import { Users, Phone, Mail, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'lead' | 'prospect' | 'client' | 'inactive';
  source: string;
  notes: string;
  lastContact: string;
  value: number;
}

interface Activity {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  date: string;
  outcome?: string;
}

export default function CRM() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contacts');
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 7700 900123',
      company: 'Smith Developments',
      position: 'Property Developer',
      status: 'client',
      source: 'Referral',
      notes: 'Interested in commercial projects',
      lastContact: '2025-01-10',
      value: 50000
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      phone: '+44 161 123 4567',
      company: 'TechCorp Ltd',
      position: 'Facilities Manager',
      status: 'prospect',
      source: 'Website',
      notes: 'Looking for office renovation',
      lastContact: '2025-01-08',
      value: 75000
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      contactId: '1',
      type: 'call',
      description: 'Discussed upcoming project requirements',
      date: '2025-01-10',
      outcome: 'Positive - will send proposal'
    },
    {
      id: '2',
      contactId: '2',
      type: 'email',
      description: 'Sent project portfolio and pricing',
      date: '2025-01-08',
      outcome: 'Awaiting response'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead',
    source: '',
    notes: '',
    value: ''
  });

  const [newActivity, setNewActivity] = useState({
    contactId: '',
    type: 'call',
    description: '',
    outcome: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and email",
        variant: "destructive"
      });
      return;
    }

    const contact: Contact = {
      id: (contacts.length + 1).toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      position: newContact.position,
      status: newContact.status as Contact['status'],
      source: newContact.source,
      notes: newContact.notes,
      lastContact: new Date().toISOString().split('T')[0],
      value: parseFloat(newContact.value) || 0
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'lead',
      source: '',
      notes: '',
      value: ''
    });

    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your CRM`,
    });
  };

  const handleAddActivity = () => {
    if (!newActivity.contactId || !newActivity.description) {
      toast({
        title: "Missing Information",
        description: "Please select a contact and add description",
        variant: "destructive"
      });
      return;
    }

    const activity: Activity = {
      id: (activities.length + 1).toString(),
      contactId: newActivity.contactId,
      type: newActivity.type as Activity['type'],
      description: newActivity.description,
      date: new Date().toISOString().split('T')[0],
      outcome: newActivity.outcome
    };

    setActivities([...activities, activity]);
    setNewActivity({
      contactId: '',
      type: 'call',
      description: '',
      outcome: ''
    });

    toast({
      title: "Activity Added",
      description: "Activity has been logged successfully",
    });
  };

  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.status !== 'inactive').length;
  const totalValue = contacts.reduce((sum, c) => sum + c.value, 0);
  const recentActivities = activities.slice(0, 5);

  return (
    <>
      <TopNavigation />
      <ResponsiveLayout>
        <SEO 
          title="CRM" 
          description="Manage your customer relationships and sales pipeline"
        />
      
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Relationship Management</h1>
          <p className="text-muted-foreground">Manage contacts, track interactions, and grow your business</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab('contacts')}>
            <Users className="w-4 h-4 mr-2" />
            Contacts
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('activities')}>
            <Calendar className="w-4 h-4 mr-2" />
            Activities
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          {/* CRM Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalContacts}</div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{activeContacts}</div>
                <p className="text-sm text-muted-foreground">Active Contacts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">£{totalValue.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{recentActivities.length}</div>
                <p className="text-sm text-muted-foreground">Recent Activities</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const contact = contacts.find(c => c.id === activity.contactId);
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="p-2 bg-muted rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{contact?.name}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        {activity.outcome && (
                          <p className="text-xs text-muted-foreground mt-1">Outcome: {activity.outcome}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6 mt-6">
          {/* Add New Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Name *</Label>
                  <Input
                    id="contactName"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="contactCompany">Company</Label>
                  <Input
                    id="contactCompany"
                    value={newContact.company}
                    onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPosition">Position</Label>
                  <Input
                    id="contactPosition"
                    value={newContact.position}
                    onChange={(e) => setNewContact(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Enter position/title"
                  />
                </div>
                <div>
                  <Label htmlFor="contactStatus">Status</Label>
                  <Select value={newContact.status} onValueChange={(value) => setNewContact(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactSource">Source</Label>
                  <Input
                    id="contactSource"
                    value={newContact.source}
                    onChange={(e) => setNewContact(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="How did you find them?"
                  />
                </div>
                <div>
                  <Label htmlFor="contactValue">Potential Value (£)</Label>
                  <Input
                    id="contactValue"
                    type="number"
                    value={newContact.value}
                    onChange={(e) => setNewContact(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="contactNotes">Notes</Label>
                  <Textarea
                    id="contactNotes"
                    value={newContact.notes}
                    onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this contact"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleAddContact}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </CardContent>
          </Card>

          {/* Contacts List */}
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{contact.position} at {contact.company}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{contact.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{contact.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Value:</span>
                          <p className="font-medium">£{contact.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Source:</span>
                          <p className="font-medium">{contact.source || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Contact:</span>
                          <p className="font-medium">{new Date(contact.lastContact).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {contact.notes && (
                        <div className="mt-3">
                          <span className="text-muted-foreground text-sm">Notes:</span>
                          <p className="text-sm mt-1">{contact.notes}</p>
                        </div>
                      )}
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

        <TabsContent value="activities" className="space-y-6 mt-6">
          {/* Add New Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Log New Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activityContact">Contact</Label>
                  <Select value={newActivity.contactId} onValueChange={(value) => setNewActivity(prev => ({ ...prev, contactId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} - {contact.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="activityType">Activity Type</Label>
                  <Select value={newActivity.type} onValueChange={(value) => setNewActivity(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="activityDescription">Description</Label>
                  <Textarea
                    id="activityDescription"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the activity or interaction"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="activityOutcome">Outcome (Optional)</Label>
                  <Input
                    id="activityOutcome"
                    value={newActivity.outcome}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, outcome: e.target.value }))}
                    placeholder="What was the result or next step?"
                  />
                </div>
              </div>
              <Button onClick={handleAddActivity}>
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
            </CardContent>
          </Card>

          {/* Activities List */}
          <div className="space-y-4">
            {activities.map((activity) => {
              const contact = contacts.find(c => c.id === activity.contactId);
              return (
                <Card key={activity.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{contact?.name}</h3>
                          <Badge variant="outline">
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{contact?.company}</p>
                        <p className="mb-2">{activity.description}</p>
                        {activity.outcome && (
                          <div className="p-2 bg-muted rounded-md">
                            <span className="text-sm font-medium">Outcome: </span>
                            <span className="text-sm">{activity.outcome}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
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
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </ResponsiveLayout>
  );
}
