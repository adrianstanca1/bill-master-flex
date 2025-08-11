
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Download, Send, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/useCompanyId';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  items: InvoiceItem[];
}

export const InvoiceManager: React.FC = () => {
  const { toast } = useToast();
  const companyId = useCompanyId();
  const [activeTab, setActiveTab] = useState('list');
  
  // Mock data
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-001',
      client: 'Acme Construction',
      amount: 15859.20,
      status: 'overdue',
      dueDate: '2025-08-08',
      items: [
        { description: 'Roofing materials', quantity: 1, unitPrice: 12000, total: 12000 },
        { description: 'Labour costs', quantity: 32, unitPrice: 120.60, total: 3859.20 }
      ]
    },
    {
      id: '2',
      number: 'INV-002',
      client: 'BuildCorp Ltd',
      amount: 8900.00,
      status: 'sent',
      dueDate: '2025-08-15',
      items: [
        { description: 'Electrical work', quantity: 1, unitPrice: 8900, total: 8900 }
      ]
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    client: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]
  });

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setNewInvoice(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.client || !newInvoice.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in client and due date",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app, this would call the accounting edge function
      toast({
        title: "Invoice Created",
        description: `Invoice for ${newInvoice.client} created successfully`,
      });
      
      // Reset form
      setNewInvoice({
        client: '',
        dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]
      });
      
      setActiveTab('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Invoice Management</h2>
        <Button onClick={() => setActiveTab('create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">All Invoices</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{invoice.number}</h3>
                        <Badge 
                          variant={
                            invoice.status === 'paid' ? 'default' : 
                            invoice.status === 'overdue' ? 'destructive' : 'secondary'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">£{invoice.amount.toLocaleString()}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={newInvoice.client}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Invoice Items</h4>
                  <Button onClick={addInvoiceItem} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Unit Price (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <Input
                          value={`£${item.total.toFixed(2)}`}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Total: £{calculateTotal().toFixed(2)}
                  </p>
                </div>
                <Button onClick={handleCreateInvoice}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
