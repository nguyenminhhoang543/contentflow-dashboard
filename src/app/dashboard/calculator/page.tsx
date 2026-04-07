"use client";

import { useState } from "react";
import { Calculator, DollarSign, Clock } from "lucide-react";

const contentTypes = [
  { name: "Blog Post",          pricePerWord: 0.08, turnaround: "2-3 days" },
  { name: "Website Copy",       pricePerWord: 0.12, turnaround: "3-5 days" },
  { name: "Email Sequence",     pricePerWord: 0.10, turnaround: "2 days"   },
  { name: "Product Description",pricePerWord: 0.06, turnaround: "24 hours" },
  { name: "Press Release",      pricePerWord: 0.14, turnaround: "1-2 days" },
  { name: "Social Media Batch", pricePerWord: 0.15, turnaround: "1 day"    },
];

export default function CalculatorPage() {
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [wordCount, setWordCount] = useState(1000);
  const [quantity, setQuantity] = useState(1);

  const unitPrice  = contentType.pricePerWord * wordCount;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-accent-amber" />
          Word Calculator
        </h1>
        <p className="text-sm text-foreground-muted mt-1">Estimate your order cost before placing it</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-card border border-border-subtle rounded-lg p-6 space-y-5">
          <h2 className="text-base font-medium text-foreground">Configure Your Order</h2>

          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Content Type</label>
            <select
              value={contentType.name}
              onChange={e => setContentType(contentTypes.find(c => c.name === e.target.value)!)}
              className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber"
            >
              {contentTypes.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-2">Word Count: <span className="text-foreground font-semibold">{wordCount.toLocaleString()}</span></label>
            <input
              type="range" min={100} max={5000} step={100}
              value={wordCount}
              onChange={e => setWordCount(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-xs text-foreground-muted mt-1">
              <span>100</span><span>5,000</span>
            </div>
            <div className="flex gap-2 mt-3">
              {[500, 1000, 1500, 2000, 3000].map(w => (
                <button key={w} onClick={() => setWordCount(w)}
                  className={`flex-1 py-1 border rounded text-xs transition-colors ${wordCount === w ? 'border-accent-amber text-accent-amber bg-accent-amber/10' : 'border-border-subtle text-foreground-muted hover:border-accent-amber'}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Quantity (pieces)</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-elevated border border-border-subtle rounded text-foreground hover:bg-border-subtle transition-colors font-bold">
                -
              </button>
              <span className="text-foreground font-semibold text-lg w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(50, quantity + 1))}
                className="w-8 h-8 bg-elevated border border-border-subtle rounded text-foreground hover:bg-border-subtle transition-colors font-bold">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-accent-amber/40 rounded-lg p-6">
            <h2 className="text-base font-medium text-foreground mb-4">Price Estimate</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Content Type</span>
                <span className="text-foreground font-medium">{contentType.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Rate</span>
                <span className="text-foreground font-medium">${contentType.pricePerWord.toFixed(2)} / word</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Word Count</span>
                <span className="text-foreground font-medium">{wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Quantity</span>
                <span className="text-foreground font-medium">× {quantity}</span>
              </div>
              <div className="border-t border-border-subtle pt-3 flex justify-between text-base">
                <span className="text-foreground-muted">Unit Price</span>
                <span className="text-foreground font-semibold">${unitPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-elevated rounded-lg p-4 flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 text-accent-amber" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted">Total Estimate</p>
                <p className="text-3xl font-bold text-accent-amber">${totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground-muted mb-5">
              <Clock className="w-4 h-4 text-accent-cyan" />
              Estimated turnaround: <span className="text-accent-cyan font-medium">{contentType.turnaround}</span>
            </div>

            <a href="/dashboard/orders/new"
              className="block w-full bg-accent-amber hover:bg-accent-amber-light text-background font-semibold py-2.5 rounded-md text-center text-sm transition-colors">
              Place This Order →
            </a>
          </div>

          <div className="bg-card border border-border-subtle rounded-lg p-4 text-xs text-foreground-muted">
            <p className="font-medium text-foreground mb-1">💡 Volume Discounts</p>
            <p>Orders over 10,000 words get 10% off. Orders over 25,000 words get 20% off. Contact us for custom enterprise pricing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
