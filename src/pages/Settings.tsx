
import React, { useEffect, useState } from "react";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";

const LS = "as-settings";

type SettingsData = {
  companyId?: string;
  country?: string;
  industry?: string;
  targetMargin?: number;
  vatScheme?: "standard" | "flat-rate" | "cash-accounting";
  reverseCharge?: boolean;
  cis?: boolean;
};

const defaults: SettingsData = {
  companyId: "",
  country: "UK",
  industry: "construction",
  targetMargin: 20,
  vatScheme: "standard",
  reverseCharge: true,
  cis: true,
};

export default function Settings() {
  const [data, setData] = useState<SettingsData>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) setData({ ...defaults, ...(JSON.parse(raw) as SettingsData) });
    } catch {}
  }, []);

  function save() {
    localStorage.setItem(LS, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <ResponsiveLayout>
      <SEO title="Settings | UK Construction" description="Manage company, VAT/CIS, and defaults for quotes and tax." noindex />
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-muted-foreground">These settings pre-fill SmartOps, Quotes and Tax tabs.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Input 
              placeholder="Company ID" 
              value={data.companyId}
              onChange={(e) => setData({ ...data, companyId: e.target.value })} 
            />
            <Input 
              placeholder="Country" 
              value={data.country}
              onChange={(e) => setData({ ...data, country: e.target.value })} 
            />
            <Input 
              placeholder="Industry" 
              value={data.industry}
              onChange={(e) => setData({ ...data, industry: e.target.value })} 
            />
            <Input 
              type="number" 
              min={0} 
              max={90} 
              placeholder="Target margin %" 
              value={data.targetMargin}
              onChange={(e) => setData({ ...data, targetMargin: Number(e.target.value) })} 
            />
            <Select 
              value={data.vatScheme}
              onValueChange={(value) => setData({ ...data, vatScheme: value as SettingsData["vatScheme"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="VAT Scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard VAT</SelectItem>
                <SelectItem value="flat-rate">Flat-rate</SelectItem>
                <SelectItem value="cash-accounting">Cash accounting</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={data.reverseCharge ? "yes" : "no"}
              onValueChange={(value) => setData({ ...data, reverseCharge: value === "yes" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Reverse Charge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Reverse charge ON</SelectItem>
                <SelectItem value="no">Reverse charge OFF</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={data.cis ? "yes" : "no"}
              onValueChange={(value) => setData({ ...data, cis: value === "yes" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="CIS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">CIS ON</SelectItem>
                <SelectItem value="no">CIS OFF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-2 items-center">
            <Button onClick={save}>Save Settings</Button>
            {saved && <span className="text-muted-foreground">Saved ✓</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How these are used</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Company ID is used for SmartOps scans (temporary until onboarding).</li>
            <li>Country/Industry pre-fill Tender search filters.</li>
            <li>Target margin sets default for Quote generator.</li>
            <li>VAT scheme, Reverse charge and CIS pre-fill Tax advice.</li>
          </ul>
        </CardContent>
      </Card>
    </ResponsiveLayout>
  );
}
