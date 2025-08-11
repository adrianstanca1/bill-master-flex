
import React, { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Project { id: string; name: string; company_id: string; }
interface Variation { id: string; project_id: string; title: string; total: number; status: string; created_at: string; }

const Variations: React.FC = () => {
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [form, setForm] = useState({ projectId: "", title: "", total: "" });

  useEffect(() => {
    const init = async () => {
      const { data: companies } = await supabase.from("companies").select("id, name").order("created_at", { ascending: true });
      const id = companies?.[0]?.id || null;
      setCompanyId(id);
    };
    init();
  }, []);

  const load = async (company: string) => {
    const { data: ps } = await supabase.from("projects").select("id, name, company_id").eq("company_id", company).order("created_at", { ascending: false });
    setProjects((ps || []) as Project[]);
    const { data: vs, error } = await supabase
      .from("variations")
      .select("id, project_id, title, total, status, created_at")
      .order("created_at", { ascending: false });
    if (!error && vs) setVariations(vs as Variation[]);
  };

  useEffect(() => { if (companyId) load(companyId); }, [companyId]);

  const add = async () => {
    if (!form.projectId || !form.title.trim()) return;
    const { data, error } = await supabase
      .from("variations")
      .insert({ project_id: form.projectId, title: form.title.trim(), total: Number(form.total || 0), status: "proposed", items: [] })
      .select("id, project_id, title, total, status, created_at")
      .single();
    if (error) return toast({ title: "Could not create variation", description: error.message, variant: "destructive" });
    setVariations([data as Variation, ...variations]);
    setForm({ projectId: "", title: "", total: "" });
    toast({ title: "Variation created" });
  };

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Variations & Change Orders",
    description: "Create and manage variations/change orders",
  }), []);

  return (
    <ResponsiveLayout>
      <SEO title="Variations & Change Orders | UK Construction" description="Create and manage variations/change orders." jsonLd={jsonLd} />
      <h1 className="sr-only">Variations & Change Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Variation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-3">
            <Select value={form.projectId} onValueChange={(v) => setForm((s) => ({ ...s, projectId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
            <Input placeholder="Total (£)" type="number" inputMode="decimal" value={form.total} onChange={(e) => setForm((s) => ({ ...s, total: e.target.value }))} />
          </div>
          <Button onClick={add}>Add Variation</Button>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>All Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {variations.map((v) => (
                <li key={v.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{v.title}</div>
                    <div className="text-sm text-muted-foreground">£{(v.total ?? 0).toFixed(2)} • {new Date(v.created_at).toLocaleDateString()} • {v.status}</div>
                  </div>
                </li>
              ))}
              {variations.length === 0 && <div className="text-sm text-muted-foreground">No variations yet.</div>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default Variations;
