
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calculator, PoundSterling, Info, AlertTriangle } from 'lucide-react';

interface TaxCalculation {
  grossIncome: number;
  vatAmount: number;
  netIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  corporationTax: number;
  takeHome: number;
  vatQuarterly: number;
  recommendations: string[];
}

export function TaxCalculator() {
  const [formData, setFormData] = useState({
    annualTurnover: '',
    businessType: 'sole-trader',
    vatScheme: 'standard',
    personalAllowance: '12570',
    expenses: '',
  });
  
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTax = async () => {
    const turnover = parseFloat(formData.annualTurnover) || 0;
    const expenses = parseFloat(formData.expenses) || 0;
    const personalAllowance = parseFloat(formData.personalAllowance) || 12570;

    if (turnover <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid annual turnover",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Basic UK tax calculations
      const profit = turnover - expenses;
      
      // VAT calculation (20% standard rate)
      const vatThreshold = 90000; // 2024/25 threshold
      const vatRequired = turnover > vatThreshold;
      const vatAmount = vatRequired ? turnover * 0.2 / 1.2 : 0; // VAT on turnover
      const netTurnover = turnover - vatAmount;
      
      // Income tax calculation
      let incomeTax = 0;
      let nationalInsurance = 0;
      let corporationTax = 0;
      
      if (formData.businessType === 'sole-trader') {
        // Sole trader calculations
        const taxableIncome = Math.max(0, profit - personalAllowance);
        
        // Income tax bands (2024/25)
        if (taxableIncome > 0) {
          if (taxableIncome <= 37700) {
            incomeTax = taxableIncome * 0.2; // Basic rate
          } else if (taxableIncome <= 125140) {
            incomeTax = 37700 * 0.2 + (taxableIncome - 37700) * 0.4; // Higher rate
          } else {
            incomeTax = 37700 * 0.2 + (125140 - 37700) * 0.4 + (taxableIncome - 125140) * 0.45; // Additional rate
          }
        }
        
        // National Insurance (Class 2 and Class 4)
        if (profit > 6515) { // Class 2 threshold
          nationalInsurance += 164.25; // Class 2 flat rate
        }
        if (profit > 12570) { // Class 4 threshold
          const class4Profit = Math.min(profit - 12570, 50270 - 12570);
          nationalInsurance += class4Profit * 0.09; // 9% on profits between £12,570 and £50,270
          
          if (profit > 50270) {
            nationalInsurance += (profit - 50270) * 0.02; // 2% on profits above £50,270
          }
        }
      } else {
        // Limited company - Corporation tax
        corporationTax = profit * 0.19; // 19% for small companies (under £250k)
        if (profit > 250000) {
          corporationTax = profit * 0.25; // 25% for large companies
        }
      }
      
      const totalTax = incomeTax + nationalInsurance + corporationTax;
      const takeHome = profit - totalTax;
      const vatQuarterly = vatAmount / 4;
      
      // Generate recommendations
      const recommendations = [];
      if (!vatRequired && turnover > 80000) {
        recommendations.push("Consider voluntary VAT registration as you're approaching the threshold");
      }
      if (expenses / turnover < 0.1) {
        recommendations.push("Review your business expenses - you might be missing legitimate deductions");
      }
      if (formData.businessType === 'sole-trader' && profit > 100000) {
        recommendations.push("Consider incorporating as a limited company for potential tax savings");
      }
      if (vatRequired) {
        recommendations.push("Remember to file VAT returns quarterly and keep detailed records");
      }
      
      const calculationResult: TaxCalculation = {
        grossIncome: turnover,
        vatAmount,
        netIncome: netTurnover,
        incomeTax,
        nationalInsurance,
        corporationTax,
        takeHome,
        vatQuarterly,
        recommendations
      };
      
      setCalculation(calculationResult);
      
      // Get AI advice if available
      try {
        const { data, error } = await supabase.functions.invoke('tax-bot', {
          body: {
            turnover12m: turnover,
            vatScheme: formData.vatScheme,
            reverseCharge: true,
            cis: true,
            notes: `Business type: ${formData.businessType}, Expenses: £${expenses}`
          }
        });
        
        if (!error && data?.advice) {
          setAiAdvice(data.advice);
        }
      } catch (aiError) {
        console.log('AI advice not available');
      }
      
      toast({
        title: "Tax Calculated",
        description: "Your tax calculation has been completed",
      });
      
    } catch (error) {
      console.error('Tax calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate tax. Please check your inputs.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculation = () => {
    setCalculation(null);
    setAiAdvice('');
    setFormData({
      annualTurnover: '',
      businessType: 'sole-trader',
      vatScheme: 'standard',
      personalAllowance: '12570',
      expenses: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">UK Tax Calculator</h1>
          <p className="text-muted-foreground">Calculate income tax, VAT, and National Insurance for construction businesses</p>
        </div>
        <Calculator className="h-8 w-8 text-primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="turnover">Annual Turnover (£) *</Label>
              <Input
                id="turnover"
                type="number"
                placeholder="150000"
                value={formData.annualTurnover}
                onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="expenses">Annual Expenses (£)</Label>
              <Input
                id="expenses"
                type="number"
                placeholder="25000"
                value={formData.expenses}
                onChange={(e) => handleInputChange('expenses', e.target.value)}
              />
            </div>

            <div>
              <Label>Business Type</Label>
              <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole-trader">Sole Trader</SelectItem>
                  <SelectItem value="limited-company">Limited Company</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>VAT Scheme</Label>
              <Select value={formData.vatScheme} onValueChange={(value) => handleInputChange('vatScheme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard VAT (20%)</SelectItem>
                  <SelectItem value="flat-rate">Flat Rate Scheme</SelectItem>
                  <SelectItem value="not-registered">Not VAT Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.businessType === 'sole-trader' && (
              <div>
                <Label htmlFor="allowance">Personal Allowance (£)</Label>
                <Input
                  id="allowance"
                  type="number"
                  value={formData.personalAllowance}
                  onChange={(e) => handleInputChange('personalAllowance', e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={calculateTax} disabled={isCalculating} className="flex-1">
                {isCalculating ? 'Calculating...' : 'Calculate Tax'}
              </Button>
              <Button variant="outline" onClick={resetCalculation}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {calculation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Tax Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Gross Income</Label>
                    <p className="text-lg font-semibold">£{calculation.grossIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">VAT</Label>
                    <p className="text-lg font-semibold text-orange-600">£{calculation.vatAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Income Tax</Label>
                    <p className="text-lg font-semibold">£{calculation.incomeTax.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">National Insurance</Label>
                    <p className="text-lg font-semibold">£{calculation.nationalInsurance.toLocaleString()}</p>
                  </div>
                  {calculation.corporationTax > 0 && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Corporation Tax</Label>
                      <p className="text-lg font-semibold">£{calculation.corporationTax.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="col-span-2 border-t pt-2">
                    <Label className="text-sm text-muted-foreground">Take Home</Label>
                    <p className="text-2xl font-bold text-green-600">£{calculation.takeHome.toLocaleString()}</p>
                  </div>
                </div>

                {calculation.vatAmount > 0 && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <Label className="text-sm font-medium text-blue-800">Quarterly VAT Payment</Label>
                    <p className="text-lg font-semibold text-blue-600">£{calculation.vatQuarterly.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {calculation?.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Info className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {calculation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {aiAdvice && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">AI Tax Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{aiAdvice}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• This calculator provides estimates based on 2024/25 UK tax rates</p>
            <p>• Actual tax liability may vary based on your specific circumstances</p>
            <p>• Consider CIS (Construction Industry Scheme) if working as a subcontractor</p>
            <p>• VAT registration is mandatory if turnover exceeds £90,000</p>
            <p>• Always consult with a qualified accountant for professional advice</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
