"use client";

import { CreditCard, Download, FileText } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Billing & Invoices</h1>
          <p className="text-sm text-foreground-muted mt-1">Manage your active plans, usage, and billing history</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-card to-elevated border border-accent-amber rounded-lg p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-accent-amber rounded-full mix-blend-overlay opacity-10 filter blur-xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-accent-amber text-xs font-bold uppercase tracking-wider">Current Plan</span>
                <h2 className="text-2xl font-semibold text-foreground mt-1">SaaS Pro Tier</h2>
                <p className="text-sm text-foreground-muted mt-2">$299.00 / month • Renews on May 1, 2026</p>
              </div>
              <button onClick={() => alert("Billing integration is coming soon in Phase 3.")} className="bg-accent-amber text-background px-4 py-2 text-sm font-medium rounded-md hover:bg-accent-amber-light transition-colors">
                Upgrade Plan
              </button>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground-muted">Word Usage this Month</span>
                <span className="text-foreground font-medium">12,450 / 20,000 words</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full bg-accent-amber w-[62%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border-subtle rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center text-foreground font-medium">
              Payment History
            </div>
            <table className="w-full text-left text-sm text-foreground-muted">
              <thead className="bg-elevated border-b border-border-subtle text-xs uppercase tracking-wider text-foreground">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-elevated transition-colors">
                    <td className="px-6 py-4">Apr {i * 5}, 2026</td>
                    <td className="px-6 py-4 font-medium text-foreground">$299.00</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-green/20 text-accent-green">Paid</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent-cyan hover:underline flex items-center justify-end gap-1 w-full">
                        <Download className="w-4 h-4" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-card border border-border-subtle rounded-lg p-5">
            <h3 className="text-sm font-medium text-foreground border-b border-border-subtle pb-3 mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 bg-elevated p-3 rounded-lg border border-border-subtle mb-4">
              <div className="w-12 h-8 bg-background border border-border-subtle rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-foreground-muted" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Visa ending in 4242</div>
                <div className="text-xs text-foreground-muted">Expires 12/28</div>
              </div>
            </div>
            <button onClick={() => alert("Payment logic is coming soon in Phase 3.")} className="w-full border border-border-subtle text-foreground text-sm py-2 rounded hover:bg-elevated transition-colors">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
