"use client";

import { useState } from "react";
import { MessageSquare, Mail, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ subject: "", priority: "Normal", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-accent-green" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Ticket Submitted!</h2>
        <p className="text-foreground-muted text-sm max-w-sm">
          We've received your request and will get back to you within 4 business hours.
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ subject: "", priority: "Normal", message: "" }); }}
          className="mt-4 border border-border-subtle text-foreground text-sm px-4 py-2 rounded-md hover:bg-elevated transition-colors">
          Submit Another Ticket
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-accent-amber" /> Contact Support
        </h1>
        <p className="text-sm text-foreground-muted mt-1">Our team is here to help you 7 days a week</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, title: "Live Chat",     desc: "Average reply: 5 min",       color: "text-accent-green"  },
          { icon: Mail,          title: "Email Support", desc: "Reply within 4 hours",        color: "text-accent-cyan"   },
          { icon: Clock,         title: "Support Hours", desc: "Mon-Sun 7am – 11pm ICT",      color: "text-accent-amber"  },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-card border border-border-subtle rounded-lg p-4 flex items-center gap-3">
            <Icon className={`w-8 h-8 ${color} shrink-0`} />
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-foreground-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border-subtle rounded-lg p-6 space-y-5">
        <h2 className="text-base font-medium text-foreground">Submit a Support Ticket</h2>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Subject</label>
          <input type="text" required placeholder="Brief description of your issue"
            value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber placeholder:text-border-active" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Priority</label>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
            className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber">
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Message</label>
          <textarea required rows={5} placeholder="Describe your issue in detail..."
            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber placeholder:text-border-active resize-none" />
        </div>

        <div className="flex justify-end">
          <button type="submit"
            className="bg-accent-amber hover:bg-accent-amber-light text-background font-semibold text-sm px-6 py-2.5 rounded-md transition-colors">
            Send Ticket
          </button>
        </div>
      </form>
    </div>
  );
}
