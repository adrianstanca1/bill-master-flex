import React, { useEffect, useState } from "react";

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
    document.title = "Settings | UK Construction";
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
    <main className="container mx-auto grid gap-6 animate-fade-in">
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-text-secondary">These settings pre-fill SmartOps, Quotes and Tax tabs.</p>
      </header>

      <section className="card">
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Company ID" value={data.companyId}
            onChange={(e) => setData({ ...data, companyId: e.target.value })} />
          <input className="input" placeholder="Country" value={data.country}
            onChange={(e) => setData({ ...data, country: e.target.value })} />
          <input className="input" placeholder="Industry" value={data.industry}
            onChange={(e) => setData({ ...data, industry: e.target.value })} />
          <input className="input" type="number" min={0} max={90} placeholder="Target margin %" value={data.targetMargin}
            onChange={(e) => setData({ ...data, targetMargin: Number(e.target.value) })} />
          <select className="input" value={data.vatScheme}
            onChange={(e) => setData({ ...data, vatScheme: e.target.value as SettingsData["vatScheme"] })}>
            <option value="standard">Standard VAT</option>
            <option value="flat-rate">Flat-rate</option>
            <option value="cash-accounting">Cash accounting</option>
          </select>
          <select className="input" value={data.reverseCharge ? "yes" : "no"}
            onChange={(e) => setData({ ...data, reverseCharge: e.target.value === "yes" })}>
            <option value="yes">Reverse charge ON</option>
            <option value="no">Reverse charge OFF</option>
          </select>
          <select className="input" value={data.cis ? "yes" : "no"}
            onChange={(e) => setData({ ...data, cis: e.target.value === "yes" })}>
            <option value="yes">CIS ON</option>
            <option value="no">CIS OFF</option>
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="button" onClick={save}>Save Settings</button>
          {saved && <span className="text-text-secondary">Saved ✓</span>}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">How these are used</h2>
        <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
          <li>Company ID is used for SmartOps scans (temporary until onboarding).</li>
          <li>Country/Industry pre-fill Tender search filters.</li>
          <li>Target margin sets default for Quote generator.</li>
          <li>VAT scheme, Reverse charge and CIS pre-fill Tax advice.</li>
        </ul>
      </section>
    </main>
  );
}
