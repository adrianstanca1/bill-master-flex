
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
import { Plus, Settings, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VATScheme {
  id: string;
  scheme: string;
  country: string;
  rules: any;
  effective_from: string;
}

export const VATSchemeManager: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    scheme: '',
    country: 'UK',
    effective_from: new Date().toISOString().split('T')[0]
  });

  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch VAT schemes
  const { data: vatSchemes, isLoading } = useQuery({
    queryKey: ['vat-schemes', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('vat_schemes')
        .select('*')
        .eq('company_id', companyId)
        .order('effective_from', { ascending: false });
      if (error) throw error;
      return data as VATScheme[];
    },
    enabled: !!companyId,
  });

  // Create VAT scheme mutation
  const createVATSchemeMutation = useMutation({
    mutationFn: async (schemeData: any) => {
      const { data, error } = await supabase
        .from('vat_schemes')
        .insert({
          ...schemeData,
          company_id: companyId,
          rules: getSchemeRules(schemeData.scheme),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "VAT scheme updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['vat-schemes'] });
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update VAT scheme", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const getSchemeRules = (scheme: string) => {
    switch (scheme) {
      case 'standard':
        return { rate: 0.20, threshold: 85000, description: 'Standard VAT rate of 20%' };
      case 'flat_rate':
        return { rate: 0.165, threshold: 150000, description: 'Flat rate scheme for small businesses' };
      case 'reverse_charge':
        return { rate: 0.20, description: 'Construction Industry Reverse Charge' };
      case 'zero_rated':
        return { rate: 0.0, description: 'Zero-rated supplies' };
      default:
        return {};
    }
  };

  const resetForm = () => {
    setFormData({
      scheme: '',
      country: 'UK',
      effective_from: new Date().toISOString().split('T')[0]
    });
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVATSchemeMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading VAT schemes...</div>;
  }

  const currentScheme = vatSchemes?.[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">VAT Scheme Management</h2>
          <p className="text-muted-foreground">Configure your VAT calculation rules</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Update Scheme
        </Button>
      </div>

      {currentScheme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Current VAT Scheme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Scheme Type</Label>
                <div className="mt-1">
                  <Badge variant="default">
                    {currentScheme.scheme.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Country</Label>
                <p className="mt-1 font-medium">{currentScheme.country}</p>
              </div>
              <div>
                <Label>Effective From</Label>
                <p className="mt-1 font-medium">
                  {new Date(currentScheme.effective_from).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {currentScheme.rules && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Scheme Details:</h4>
                <ul className="text-sm space-y-1">
                  {currentScheme.rules.rate && (
                    <li>• Rate: {(currentScheme.rules.rate * 100).toFixed(1)}%</li>
                  )}
                  {currentScheme.rules.threshold && (
                    <li>• Threshold: £{currentScheme.rules.threshold.toLocaleString()}</li>
                  )}
                  {currentScheme.rules.description && (
                    <li>• {currentScheme.rules.description}</li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Update VAT Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheme">VAT Scheme *</Label>
                  <Select
                    value={formData.scheme}
                    onValueChange={(value) => setFormData({ ...formData, scheme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select VAT scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rate (20%)</SelectItem>
                      <SelectItem value="flat_rate">Flat Rate Scheme</SelectItem>
                      <SelectItem value="reverse_charge">Reverse Charge (CIS)</SelectItem>
                      <SelectItem value="zero_rated">Zero Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="IE">Ireland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="effective_from">Effective From</Label>
                  <Input
                    id="effective_from"
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              {formData.scheme && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Scheme Preview:</h4>
                  <div className="text-sm text-blue-800">
                    {(() => {
                      const rules = getSchemeRules(formData.scheme);
                      return (
                        <div>
                          {rules.rate && <p>• VAT Rate: {(rules.rate * 100).toFixed(1)}%</p>}
                          {rules.threshold && <p>• Turnover Threshold: £{rules.threshold.toLocaleString()}</p>}
                          {rules.description && <p>• {rules.description}</p>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={createVATSchemeMutation.isPending}>
                  Update VAT Scheme
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!currentScheme && !isCreating && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No VAT scheme configured</p>
            <Button onClick={() => setIsCreating(true)}>
              Configure VAT Scheme
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
