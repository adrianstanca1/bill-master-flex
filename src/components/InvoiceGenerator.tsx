import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { computeTotals, type VATMode, type InvoiceData } from '@/lib/invoice-calc';
import { format } from 'date-fns';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceTotals } from './InvoiceTotals';
import { InvoicePreview } from './InvoicePreview';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

const itemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

const formSchema = z.object({
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    address: z.string().min(1, 'Company address is required'),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    vatNumber: z.string().optional().or(z.literal('')),
    regNumber: z.string().optional().or(z.literal('')),
  }),
  client: z.object({
    name: z.string().min(1, 'Client name is required'),
    address: z.string().min(1, 'Client address is required'),
    contact: z.string().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
  }),
  invoice: z.object({
    number: z.string().min(1, 'Invoice number is required'),
    date: z.string().min(1, 'Invoice date is required'),
    dueDate: z.string().optional().or(z.literal('')),
    reference: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
  }),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  vatMode: z.enum(['STANDARD_20','REVERSE_CHARGE_20','NO_VAT']),
  discountPercent: z.number().min(0).max(100).default(0),
  retentionPercent: z.number().min(0).max(100).default(0),
  // CIS options - simplified
  cisEnabled: z.boolean().default(false).optional(),
  cisPercent: z.number().min(0).max(100).default(20).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

function loadDefaults(): Partial<FormValues> {
  if (typeof window === 'undefined') return getInitialDefaults();
  
  const saved = localStorage.getItem('as-invoice-defaults');
  if (saved) {
    try { 
      return JSON.parse(saved); 
    } catch {
      return getInitialDefaults();
    }
  }
  return getInitialDefaults();
}

function getInitialDefaults(): Partial<FormValues> {
  const today = format(new Date(), 'yyyy-MM-dd');
  return {
    company: {
      name: 'AS Cladding & Roofing Ltd',
      address: 'Your Address Line 1\nCity, Postcode\nUnited Kingdom',
      email: 'info@example.com',
      phone: '+44 1234 567890',
      vatNumber: 'GB123456789',
      regNumber: '12345678',
    },
    client: {
      name: '',
      address: '',
      contact: '',
      email: '',
    },
    invoice: {
      number: 'INV-0001',
      date: today,
      dueDate: '',
      reference: '',
      notes: 'Payment terms: 30 days net\nBank details: Sort Code 12-34-56, Account 12345678',
    },
    items: [
      { description: 'Labour and materials', quantity: 1, unitPrice: 0 },
    ],
    vatMode: 'STANDARD_20' as VATMode,
    discountPercent: 0,
    retentionPercent: 0,
    cisEnabled: false,
    cisPercent: 20,
  };
}

export function InvoiceGenerator() {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  
  const defaults = loadDefaults();
  const { control, register, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults as FormValues
  });

  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: 'items' 
  });
  
  const values = watch();
  const totals = computeTotals(values as InvoiceData);

  function saveDefaults() {
    localStorage.setItem('as-invoice-defaults', JSON.stringify(values));
    toast({
      title: "Defaults saved",
      description: "Your default values have been saved locally.",
    });
  }

function handlePreview() {
  setShowPreview(true);
}

async function handleSaveBackend() {
  try {
    const settings = JSON.parse(localStorage.getItem('as-settings') || '{}');
    const companyId = settings?.companyId;
    if (!companyId) {
      toast({ title: "Missing company", description: "Set a company ID in Settings first.", variant: "destructive" });
      return;
    }
    const body = {
      endpoint: "invoices",
      companyId,
      client: values.client,
      number: values.invoice.number,
      dueDate: values.invoice.dueDate,
      items: values.items,
      reverseVAT: values.vatMode === 'REVERSE_CHARGE_20',
      retentionApplied: (values.retentionPercent || 0) > 0,
    };
    const { data, error } = await supabase.functions.invoke("accounting", { body });
    if (error) throw error as any;
    toast({ title: "Invoice saved", description: `ID: ${ (data as any)?.invoiceId || 'created' }` });
  } catch (e: any) {
    console.error(e);
    toast({ title: "Failed to save invoice", description: e?.message || String(e), variant: "destructive" });
  }
}

function handleClosePreview() {
  setShowPreview(false);
}

  if (showPreview) {
    return (
      <InvoicePreview 
        data={values as InvoiceData}
        totals={totals}
        onClose={handleClosePreview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvoiceForm
              register={register}
              fields={fields}
              append={append}
              remove={remove}
              control={control}
              onSaveDefaults={saveDefaults}
              onPreview={handlePreview}
              onSaveBackend={handleSaveBackend}
            />
          </div>
          <div className="lg:col-span-1">
            <InvoiceTotals 
              totals={totals}
              vatMode={values.vatMode}
              register={register}
              setValue={setValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
