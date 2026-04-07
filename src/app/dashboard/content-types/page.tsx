"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ContentTypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadCatalog() {
      const { data } = await supabase
        .from("content_catalog")
        .select("*")
        .order("price_per_word", { ascending: false });
      
      setTypes(data || []);
      setLoading(false);
    }
    loadCatalog();
  }, [supabase]);

  if (loading) {
     return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Content Types</h1>
          <p className="text-sm text-foreground-muted mt-1">Configure available content formats & pricing options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map(t => (
          <div key={t.id} className="bg-card border border-border-subtle rounded-lg p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <h3 className="font-semibold text-foreground text-lg">{t.name}</h3>
              </div>
              <div className="w-10 h-5 bg-accent-green rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 bg-background rounded-full ml-auto"></div>
              </div>
            </div>
            <p className="text-sm text-foreground-muted mb-6 flex-1">{t.description}</p>
            <div className="flex justify-between items-center bg-elevated p-3 rounded border border-border-subtle text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-foreground-muted">Estimated Turnaround</span>
                <span className="font-medium text-foreground">{t.turnaround_time}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-foreground-muted">Base Price</span>
                <span className="font-medium text-foreground">${Number(t.price_per_word).toFixed(2)} / word</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-background border border-border-subtle hover:border-accent-amber text-sm font-medium py-2 rounded transition-colors text-foreground">
              Configure Settings
            </button>
          </div>
        ))}
        {types.length === 0 && (
          <div className="col-span-2 text-center py-10 text-foreground-muted text-sm">
            Please run FINAL_SCHEMA_PHASE2.sql in Supabase to seed the content catalog.
          </div>
        )}
      </div>
    </div>
  );
}
