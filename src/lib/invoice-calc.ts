export type VATMode = 'STANDARD_20' | 'REVERSE_CHARGE_20' | 'NO_VAT';

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  company: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
    vatNumber?: string;
    regNumber?: string;
  };
  client: {
    name: string;
    address: string;
    contact?: string;
    email?: string;
  };
  invoice: {
    number: string;
    date: string; // ISO
    dueDate?: string; // ISO
    reference?: string;
    notes?: string;
  };
  items: LineItem[];
  vatMode: VATMode;
  discountPercent?: number; // applied to subtotal
  retentionPercent?: number; // applied at the end
  // CIS (Construction Industry Scheme) optional deduction
  cisEnabled?: boolean; // when true, apply cisPercent to cisTaxableBase (or netAfterDiscount if not provided)
  cisPercent?: number; // typically 20%
  cisTaxableBase?: number; // if omitted, defaults to netAfterDiscount
}

export interface Totals {
  subtotal: number;
  discount: number;
  netAfterDiscount: number;
  vatRate: number;
  vatAmount: number;
  totalBeforeRetention: number;
  retention: number;
  // CIS
  cisBase: number;
  cisPercent: number;
  cisDeduction: number;
  totalDue: number;
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeTotals(data: InvoiceData): Totals {
  const subtotal = round2(data.items.reduce((s, it) => s + (it.quantity || 0) * (it.unitPrice || 0), 0));
  const discountPercent = Math.max(0, Math.min(100, data.discountPercent || 0));
  const discount = round2(subtotal * (discountPercent / 100));
  const netAfterDiscount = round2(subtotal - discount);

  let vatRate = 0;
  if (data.vatMode === 'STANDARD_20') vatRate = 0.20;
  if (data.vatMode === 'REVERSE_CHARGE_20') vatRate = 0;
  if (data.vatMode === 'NO_VAT') vatRate = 0;

  const vatAmount = round2(netAfterDiscount * vatRate);
  const totalBeforeRetention = round2(netAfterDiscount + vatAmount);

  const retentionPercent = Math.max(0, Math.min(100, data.retentionPercent || 0));
  const retention = round2(totalBeforeRetention * (retentionPercent / 100));

  // CIS deduction (does not affect VAT)
  const cisEnabled = !!data.cisEnabled;
  const cisPercent = cisEnabled ? Math.max(0, Math.min(100, data.cisPercent ?? 20)) : 0;
  const cisBase = cisEnabled ? round2(data.cisTaxableBase ?? netAfterDiscount) : 0;
  const cisDeduction = cisEnabled ? round2(cisBase * (cisPercent / 100)) : 0;

  const totalDue = round2(totalBeforeRetention - retention - cisDeduction);

  return {
    subtotal,
    discount,
    netAfterDiscount,
    vatRate,
    vatAmount,
    totalBeforeRetention,
    retention,
    // CIS
    cisBase,
    cisPercent,
    cisDeduction,
    totalDue,
  };
}

export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function getVATLabel(mode: VATMode): string {
  switch (mode) {
    case 'STANDARD_20':
      return 'Standard VAT (20%)';
    case 'REVERSE_CHARGE_20':
      return 'Reverse Charge (20%)';
    case 'NO_VAT':
      return 'No VAT (0%)';
    default:
      return 'No VAT (0%)';
  }
}