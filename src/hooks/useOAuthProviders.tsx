import { useEffect, useState } from "react";

type Provider = "google" | "github" | "apple";

export function useOAuthProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

        if (!url || !key) throw new Error("Missing Supabase env vars");

        const res = await fetch(`${url}/auth/v1/settings`, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const external = data?.external ?? {};

          const active: Provider[] = [];
          if (external.google?.enabled) active.push("google");
          if (external.github?.enabled) active.push("github");
          if (external.apple?.enabled) active.push("apple");
          setProviders(active);
        } else {
          // If settings can't be fetched, enable all providers by default
          setProviders(["google", "github", "apple"]);
        }
      } catch (err) {
        console.warn("Unable to determine OAuth providers, defaulting to all", err);
        setProviders(["google", "github", "apple"]);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  const enabledProviders = {
    google: providers.includes("google"),
    github: providers.includes("github"),
    apple: providers.includes("apple"),
  } as const;

  const validateProvider = (provider: Provider) => enabledProviders[provider];

  return { providers, enabledProviders, loading, validateProvider };
}