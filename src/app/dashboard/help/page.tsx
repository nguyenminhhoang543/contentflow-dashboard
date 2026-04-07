"use client";

import { useState } from "react";
import { Search, ChevronDown, BookOpen, Video, MessageSquare, HelpCircle } from "lucide-react";

const faqs = [
  { q: "How long does it take to receive my content?", a: "Standard delivery is 2-3 business days. Rush orders (marked as such when placing) are delivered within 24 hours for an additional 30% fee." },
  { q: "How do I request a revision?", a: "Open your order and click the 'Request Revision' button. You can include detailed feedback. Revisions are unlimited and free within 14 days of delivery." },
  { q: "Can I choose specific writers?", a: "On our Pro and Enterprise plans, you can build a pool of preferred writers and request them for new orders. Your account manager can help set this up." },
  { q: "What file formats will my content be delivered in?", a: "Content is delivered as a Google Doc by default, with an option to download as DOCX, PDF, or plain text. HTML export is available on Business plans." },
  { q: "How does pricing work?", a: "Pricing is based on content type and word count. Use the Word Calculator to estimate your project cost before placing an order." },
  { q: "What is your refund policy?", a: "We offer a 100% satisfaction guarantee. If you are not happy after revisions, we will issue a full refund within 30 days." },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-accent-amber" /> Help Center
        </h1>
        <p className="text-sm text-foreground-muted mt-1">Find answers, guides, and tutorials</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
        <input type="text" placeholder="Search for help articles..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 bg-card border border-border-subtle text-sm rounded-lg py-3 px-4 text-foreground focus:outline-none focus:border-accent-amber transition-colors" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BookOpen,       label: "Docs & Guides",    color: "text-accent-amber" },
          { icon: Video,          label: "Video Tutorials",  color: "text-accent-cyan"  },
          { icon: MessageSquare,  label: "Live Chat",        color: "text-accent-green" },
        ].map(({ icon: Icon, label, color }) => (
          <button key={label}
            className="bg-card border border-border-subtle hover:border-accent-amber rounded-lg p-5 flex flex-col items-center gap-2 text-sm font-medium text-foreground transition-all hover:bg-elevated">
            <Icon className={`w-7 h-7 ${color}`} />
            {label}
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-card border border-border-subtle rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-medium text-foreground">Frequently Asked Questions</h2>
        </div>
        <ul className="divide-y divide-border-subtle">
          {filtered.length === 0 ? (
            <li className="px-6 py-8 text-center text-foreground-muted text-sm">No results found for "{search}"</li>
          ) : filtered.map((faq, i) => (
            <li key={i}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-elevated transition-colors"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-foreground-muted shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-foreground-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center text-sm text-foreground-muted py-4">
        Can't find what you need?{" "}
        <a href="/dashboard/contact" className="text-accent-cyan hover:underline">Contact our support team →</a>
      </div>
    </div>
  );
}
