"use client";

import { useState, useEffect } from "react";
import { Download, History } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const STATUS_FILTER = ["All", "Delivered"];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchHistory() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["Delivered"])
        .order("created_at", { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const totalWords = orders.reduce((s, o) => s + (o.word_count || 0), 0);
  const totalSpend = orders.reduce((s, o) => s + (o.word_count || 0) * 0.08, 0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <History className="w-6 h-6 text-accent-amber" /> Order History
          </h1>
          <p className="text-sm text-foreground-muted mt-1">All your completed and delivered orders</p>
        </div>
        <button
          onClick={() => alert("Export as CSV coming soon.")}
          className="flex items-center gap-2 bg-elevated border border-border-subtle hover:bg-border-subtle text-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Orders",   value: orders.length,                              accent: "text-foreground"    },
          { label: "Total Words",    value: totalWords.toLocaleString() + " words",     accent: "text-accent-cyan"   },
          { label: "Total Spend",    value: "$" + totalSpend.toFixed(2),                accent: "text-accent-green"  },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border-subtle rounded-lg p-5">
            <p className="text-xs text-foreground-muted uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border-subtle rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-foreground-muted">
          <thead className="bg-elevated border-b border-border-subtle text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-foreground">Title</th>
              <th className="px-6 py-4 text-foreground">Type</th>
              <th className="px-6 py-4 text-foreground">Words</th>
              <th className="px-6 py-4 text-foreground">Price</th>
              <th className="px-6 py-4 text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-foreground-muted">Loading history…</td></tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <History className="w-10 h-10 text-foreground-muted opacity-30 mx-auto mb-3" />
                  <p className="text-foreground-muted">No delivered orders yet.</p>
                  <Link href="/dashboard/orders/new" className="mt-3 inline-block text-accent-cyan hover:underline text-sm">Place your first order →</Link>
                </td>
              </tr>
            ) : (
              orders.map(o => (
                <tr key={o.id} className="hover:bg-elevated transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground max-w-[220px] truncate">{o.title}</td>
                  <td className="px-6 py-4">{o.content_type}</td>
                  <td className="px-6 py-4">{(o.word_count || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-accent-green font-medium">${((o.word_count || 0) * 0.08).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/orders/${o.id}`} className="text-accent-cyan hover:underline">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
