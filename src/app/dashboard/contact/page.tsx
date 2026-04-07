"use client";

import { useState } from "react";
import { MessageSquare, Mail, HelpCircle, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const [form, setForm] = useState({
    subject: "",
    priority: "Normal",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject: form.subject,
        priority: form.priority,
        message: form.message,
        status: "Open"
      });
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-accent-green" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Ticket Submitted Successfully</h2>
        <p className="text-sm text-foreground-muted mb-8">
          Thank you for reaching out. A member of our support team will get back to you within 24 hours.
        </p>
        <button 
          onClick={() => { setSuccess(false); setForm({subject: "", priority:"Normal", message:""}); }}
          className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
             Contact Support
          </h1>
          <p className="text-sm text-foreground-muted mt-1">We're here to help you get the most out of ContentFlow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 flex flex-col gap-4">
           <div className="bg-card border border-border-subtle rounded-lg p-5">
             <div className="w-10 h-10 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-3">
               <Mail className="w-5 h-5 text-accent-cyan" />
             </div>
             <h3 className="font-medium text-foreground text-sm">Email Us</h3>
             <p className="text-xs text-foreground-muted mt-1 mb-2">For general inquiries and billing.</p>
             <a href="mailto:support@contentflow.io" className="text-sm font-medium text-accent-cyan hover:underline">support@contentflow.io</a>
           </div>

           <div className="bg-card border border-border-subtle rounded-lg p-5">
             <div className="w-10 h-10 bg-accent-amber/10 rounded-full flex items-center justify-center mb-3">
               <MessageSquare className="w-5 h-5 text-accent-amber" />
             </div>
             <h3 className="font-medium text-foreground text-sm">Live Chat</h3>
             <p className="text-xs text-foreground-muted mt-1 mb-2">Available Mon-Fri, 9am - 5pm EST.</p>
             <button className="text-sm font-medium text-foreground border border-border-subtle bg-elevated px-4 py-1.5 rounded hover:bg-border-subtle transition-colors">Start Chat</button>
           </div>
        </div>

        <div className="col-span-2 bg-card border border-border-subtle rounded-lg p-6">
          <h2 className="text-lg font-medium text-foreground mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-accent-amber"/> Create a Ticket</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Subject</label>
              <input 
                required
                type="text" 
                value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
                placeholder="Briefly describe your issue" 
                className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Priority</label>
              <select 
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}
                className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber"
              >
                <option>Low - General Question</option>
                <option>Normal - Issue with an order</option>
                <option>High - Billing / Error</option>
                <option>Urgent - Application Breakdown</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Message</label>
              <textarea 
                required
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                placeholder="Please provide as much detail as possible..." 
                className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber resize-none" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2.5 rounded-md transition-colors text-sm flex justify-center items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
