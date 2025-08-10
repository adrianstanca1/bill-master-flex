import React, { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  company_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
}

interface Project {
  id: string;
  company_id: string;
  name: string;
  client?: string | null;
  location?: string | null;
}

const CRM: React.FC = () => {
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newClient, setNewClient] = useState({ name: "", email: "" });
  const [newProject, setNewProject] = useState({ name: "", client: "", location: "" });

  useEffect(() => {
    const init = async () => {
      const { data: companies } = await supabase.from("companies").select("id, name").order("created_at", { ascending: true });
      const id = companies?.[0]?.id || null;
      setCompanyId(id);
    };
    init();
  }, []);

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      const { data: cs, error: ce } = await supabase.from("clients").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
      if (!ce && cs) setClients(cs);
      const { data: ps, error: pe } = await supabase.from("projects").select("id, company_id, name, client, location").eq("company_id", companyId).order("created_at", { ascending: false });
      if (!pe && ps) setProjects(ps as Project[]);
    };
    load();
  }, [companyId]);

  const saveClient = async () => {
    if (!companyId || !newClient.name.trim()) return;
    const { data, error } = await supabase.from("clients").insert({
      company_id: companyId,
      name: newClient.name.trim(),
      email: newClient.email || null,
    }).select("*").single();
    if (error) return toast({ title: "Could not save client", description: error.message, variant: "destructive" });
    setClients([data as Client, ...clients]);
    setNewClient({ name: "", email: "" });
    toast({ title: "Client added", description: "Client saved successfully" });
  };

  const saveProject = async () => {
    if (!companyId || !newProject.name.trim()) return;
    const { data, error } = await supabase.from("projects").insert({
      company_id: companyId,
      name: newProject.name.trim(),
      client: newProject.client || null,
      location: newProject.location || null,
      meta: {},
    }).select("id, company_id, name, client, location").single();
    if (error) return toast({ title: "Could not save project", description: error.message, variant: "destructive" });
    setProjects([data as Project, ...projects]);
    setNewProject({ name: "", client: "", location: "" });
    toast({ title: "Project added", description: "Project saved successfully" });
  };

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Client & Project CRM",
    description: "Mini-CRM for clients and projects",
  }), []);

  return (
    <main>
      <SEO title="Client & Project CRM | UK Construction" description="Manage clients and projects in a simple mini-CRM." jsonLd={jsonLd} />
      <h1 className="sr-only">Client & Project CRM</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Client name" value={newClient.name} onChange={(e) => setNewClient((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Email" value={newClient.email} onChange={(e) => setNewClient((s) => ({ ...s, email: e.target.value }))} />
              <Button onClick={saveClient} disabled={!companyId}>Add</Button>
            </div>
            <ul className="space-y-2">
              {clients.map((c) => (
                <li key={c.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.email || "No email"}</div>
                  </div>
                </li>
              ))}
              {clients.length === 0 && <div className="text-sm text-muted-foreground">No clients yet.</div>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-3">
              <Input placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Client (name)" value={newProject.client} onChange={(e) => setNewProject((s) => ({ ...s, client: e.target.value }))} />
              <Input placeholder="Location" value={newProject.location} onChange={(e) => setNewProject((s) => ({ ...s, location: e.target.value }))} />
            </div>
            <Button onClick={saveProject} disabled={!companyId}>Add Project</Button>
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.client || "No client"} {p.location ? `• ${p.location}` : ""}</div>
                  </div>
                </li>
              ))}
              {projects.length === 0 && <div className="text-sm text-muted-foreground">No projects yet.</div>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CRM;
