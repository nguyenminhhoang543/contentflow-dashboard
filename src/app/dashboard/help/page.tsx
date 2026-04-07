"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen, MessageCircle, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadFaqs() {
      const { data } = await supabase.from("faqs").select("*");
      setFaqs(data || []);
      setLoading(false);
    }
    loadFaqs();
  }, [supabase]);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      <div className="bg-gradient-to-r from-card to-elevated border border-border-subtle rounded-lg p-10 text-center">
        <h1 className="text-3xl font-semibold text-foreground mb-3">How can we help you?</h1>
        <p className="text-foreground-muted mb-8 max-w-lg mx-auto">Skip the wait. Search our documentation or browse the frequently asked questions below.</p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for articles, billing, or technical issues..."
            className="w-full pl-12 pr-4 py-3 bg-background border border-border-active rounded-md text-foreground focus:outline-none focus:border-accent-amber shadow-sm transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { title: "Getting Started", icon: BookOpen, desc: "Setup your account and profile" },
          { title: "Order Process", icon: FileText, desc: "How to request and approve content" },
          { title: "Contact Support", icon: MessageCircle, desc: "Talk to a real human", link: "/dashboard/contact" },
        ].map((item, i) => (
          <a key={i} href={item.link || "#"} className="bg-card hover:bg-elevated border border-border-subtle hover:border-border-active rounded-lg p-5 flex flex-col items-center text-center transition-all">
             <div className="w-12 h-12 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-4">
               <item.icon className="w-6 h-6 text-accent-cyan" />
             </div>
             <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
             <p className="text-xs text-foreground-muted mt-1">{item.desc}</p>
          </a>
        ))}
      </div>

      <div className="bg-card border border-border-subtle rounded-lg p-6">
        <h2 className="text-lg font-medium text-foreground mb-6">Frequently Asked Questions</h2>
        
        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-accent-cyan" /></div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center p-8 text-foreground-muted text-sm border border-dashed border-border-subtle rounded">
            No FAQs found matching your search.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-border-subtle rounded-md overflow-hidden bg-background">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-elevated transition-colors"
                >
                  <span className="font-medium text-sm text-foreground">{faq.question}</span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-foreground-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-foreground-muted shrink-0" />}
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 text-sm text-foreground-muted border-t border-border-subtle leading-relaxed bg-elevated/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
