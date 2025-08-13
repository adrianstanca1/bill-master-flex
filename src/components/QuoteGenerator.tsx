
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { Plus, Trash2, Calculator, FileText, Send } from 'lucide-react';

const itemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

const formSchema = z.object({
  title: z.string().min(1, 'Quote title is required'),
  client: z.object({
    name: z.string().min(1, 'Client name is required'),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
  }),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  validUntil: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function QuoteGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<string>('');
  const { toast } = useToast();
  const companyId = useCompanyId();

  const { control, register, watch, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      client: { name: '', email: '', address: '' },
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      validUntil: '',
      notes: 'This quote is valid for 30 days from the date of issue.',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const values = watch();

  const calculateTotal = () => {
    return values.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsGenerating(true);
      
      const total = calculateTotal();
      const quoteData = {
        company_id: companyId || 'guest',
        title: data.title,
        items: data.items,
        total,
        status: 'draft' as const
      };

      if (companyId) {
        // Save to database if authenticated
        const { error } = await supabase
          .from('quotes')
          .insert(quoteData);

        if (error) throw error;
      }

      // Generate quote text
      const quoteText = generateQuoteText(data, total);
      setGeneratedQuote(quoteText);

      toast({
        title: "Quote Generated",
        description: companyId ? "Quote saved and generated successfully" : "Quote generated (sign in to save)",
      });

    } catch (error: any) {
      console.error('Error generating quote:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quote",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuoteText = (data: FormValues, total: number) => {
    const today = new Date().toLocaleDateString('en-GB');
    const validUntil = data.validUntil ? new Date(data.validUntil).toLocaleDateString('en-GB') : 
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');

    return `
QUOTATION

Date: ${today}
Valid Until: ${validUntil}
Quote Reference: QUO-${Date.now().toString().slice(-6)}

TO:
${data.client.name}
${data.client.address || ''}
${data.client.email || ''}

FROM:
Your Company Name
Your Address
Your Contact Details

DESCRIPTION OF WORKS:
${data.title}

ITEMS:
${data.items.map((item, index) => 
  `${index + 1}. ${item.description} - Qty: ${item.quantity} x £${item.unitPrice.toFixed(2)} = £${(item.quantity * item.unitPrice).toFixed(2)}`
).join('\n')}

TOTAL: £${total.toFixed(2)}

${data.notes || ''}

Thank you for your inquiry. We look forward to working with you.
    `.trim();
  };

  const handleNewQuote = () => {
    reset();
    setGeneratedQuote('');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedQuote], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${values.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Quote Downloaded",
      description: "Quote has been downloaded as a text file",
    });
  };

  if (generatedQuote) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Generated Quote</h1>
          <div className="flex gap-2">
            <Button onClick={handleNewQuote} variant="outline">
              New Quote
            </Button>
            <Button onClick={handleDownload}>
              <FileText className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
              {generatedQuote}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quote Generator</h1>
          <p className="text-muted-foreground">Create professional quotes for your construction projects</p>
        </div>
        <Calculator className="h-8 w-8 text-primary" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quote Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quote Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Kitchen Extension Work"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  {...register('validUntil')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                {...register('client.name')}
                placeholder="Client company or person name"
                className={errors.client?.name ? 'border-red-500' : ''}
              />
              {errors.client?.name && <p className="text-red-500 text-sm mt-1">{errors.client.name.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...register('client.email')}
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Input
                  id="clientAddress"
                  {...register('client.address')}
                  placeholder="Client address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Quote Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  {index === 0 && <Label className="text-sm">Description</Label>}
                  <Input
                    {...register(`items.${index}.description`)}
                    placeholder="Description of work"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <Label className="text-sm">Quantity</Label>}
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    placeholder="1.00"
                  />
                </div>
                <div className="col-span-3">
                  {index === 0 && <Label className="text-sm">Unit Price (£)</Label>}
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  £{calculateTotal().toFixed(2)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register('notes')}
              placeholder="Terms and conditions, payment details, etc."
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleNewQuote}>
            Reset
          </Button>
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Quote
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
