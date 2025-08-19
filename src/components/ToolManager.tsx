
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Wrench, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Tool {
  id: string;
  name: string;
  type?: string;
  serial?: string;
  meta: any;
  created_at: string;
}

export const ToolManager: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serial: ''
  });

  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tools
  const { data: tools, isLoading } = useQuery({
    queryKey: ['tools', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Tool[];
    },
    enabled: !!companyId,
  });

  // Create tool mutation
  const createToolMutation = useMutation({
    mutationFn: async (toolData: any) => {
      const { data, error } = await supabase
        .from('tools')
        .insert({
          ...toolData,
          company_id: companyId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Tool created successfully" });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create tool", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Update tool mutation
  const updateToolMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('tools')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Tool updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      resetForm();
    }
  });

  // Delete tool mutation
  const deleteToolMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Tool deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      serial: ''
    });
    setIsCreating(false);
    setEditingTool(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTool) {
      updateToolMutation.mutate({ id: editingTool.id, ...formData });
    } else {
      createToolMutation.mutate(formData);
    }
  };

  const startEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      type: tool.type || '',
      serial: tool.serial || ''
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tool Management</h2>
          <p className="text-muted-foreground">Track and manage your construction tools and equipment</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTool ? 'Edit Tool' : 'Add New Tool'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="power_tool">Power Tool</SelectItem>
                      <SelectItem value="hand_tool">Hand Tool</SelectItem>
                      <SelectItem value="measuring">Measuring Tool</SelectItem>
                      <SelectItem value="safety">Safety Equipment</SelectItem>
                      <SelectItem value="cutting">Cutting Tool</SelectItem>
                      <SelectItem value="fastening">Fastening Tool</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input
                    id="serial"
                    value={formData.serial}
                    onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createToolMutation.isPending || updateToolMutation.isPending}>
                  {editingTool ? 'Update' : 'Create'} Tool
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tools?.map((tool) => (
          <Card key={tool.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4" />
                    <span className="font-semibold">{tool.name}</span>
                    {tool.type && (
                      <Badge variant="secondary">{tool.type.replace('_', ' ')}</Badge>
                    )}
                  </div>
                  
                  {tool.serial && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      <span>Serial: {tool.serial}</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Added: {new Date(tool.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(tool)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteToolMutation.mutate(tool.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No tools registered yet</p>
            <Button className="mt-4" onClick={() => setIsCreating(true)}>
              Add Your First Tool
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
