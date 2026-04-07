"use client";

import { useEffect, useState } from "react";
import { Download, CreditCard, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadBilling() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setInvoices(data || []);
      setLoading(false);
    }
    loadBilling();
  }, [supabase]);

  if (loading) {
     return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  const simulatePayment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    alert("In a real app, this opens Stripe Checkout. Generating a mock invoice instead.");
    
    const { data } = await supabase.from("invoices").insert({
      user_id: user.id,
      amount: 80.00,
      status: "Paid"
    }).select().single();

    if (data) {
      setInvoices([data, ...invoices]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground">Billing & Plans</h1>
        <p className="text-sm text-foreground-muted mt-1">Manage your active plans, payment methods, and invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="col-span-2 bg-card border border-border-subtle rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-foreground">Current Plan</h2>
              <span className="px-3 py-1 bg-accent-amber/20 text-accent-amber text-xs font-bold rounded-full uppercase tracking-wide">Pro Tier</span>
            </div>
            <p className="text-3xl font-bold text-foreground my-4">$299<span className="text-sm font-normal text-foreground-muted">/month</span></p>
            <p className="text-sm text-foreground-muted mb-6">Your plan renews on <span className="font-medium text-foreground">May 1, 2026</span></p>

            <div className="bg-elevated p-4 rounded-md mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground-muted">Included Words (Monthly)</span>
                <span className="font-medium text-foreground">8,450 / 10,000</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-accent-amber" style={{ width: "84.5%" }}></div>
              </div>
              <p className="text-xs text-foreground-muted mt-2 text-right">1,550 words remaining</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => alert("Upgrade flows are not fully configured yet.")} className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm">
              Upgrade Plan
            </button>
            <button className="bg-background border border-border-subtle hover:border-accent-red text-foreground text-sm font-medium py-2 px-6 rounded-md transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="col-span-1 bg-card border border-border-subtle rounded-lg p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Payment Method</h2>
          
          <div className="bg-elevated border border-border-subtle rounded-md p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-accent-cyan" />
              <span className="font-medium text-foreground">•••• 4242</span>
            </div>
            <p className="text-sm text-foreground-muted pl-8">Expires 12/28</p>
          </div>

          <button onClick={simulatePayment} className="w-full bg-background border border-border-subtle hover:border-accent-cyan text-foreground text-sm font-medium py-2 rounded-md transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Invoice History</h2>
        <div className="bg-card border border-border-subtle rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-elevated border-b border-border-subtle text-foreground-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice Number</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground-muted">No billing history found. Click "Update Payment Method" to generate a mock invoice.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-elevated/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">INV-{inv.id.substring(0,6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-foreground-muted">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-foreground">${Number(inv.amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${inv.status === 'Paid' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-amber/20 text-accent-amber'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent-cyan hover:underline inline-flex items-center gap-1"><Download className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
