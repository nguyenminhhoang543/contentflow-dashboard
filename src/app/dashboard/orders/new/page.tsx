"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const [formData, setFormData] = useState({
    type: "Blog Post",
    title: "",
    words: 1000,
    instructions: "",
    deadline: "",
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg("Not authenticated");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          title: formData.title,
          content_type: formData.type,
          word_count: formData.words,
          instructions: formData.instructions,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          status: 'Pending'
        });

      if (error) {
        const errorMessage = error.message || `Database Error Code: ${error.code}`;
        setErrorMsg(errorMessage || "An error occurred submitting your order. Did you run the SQL schema in Supabase?");
        setLoading(false);
        return;
      }
      
      router.push("/dashboard/orders");
    } catch (err: any) {
      setErrorMsg(err?.message || JSON.stringify(err) || "An unexpected application error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Create New Order</h1>
          <p className="text-sm text-foreground-muted mt-1">Fill out the details for your writing request</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === i ? 'bg-accent-amber text-background' : step > i ? 'bg-accent-green text-background' : 'bg-elevated text-foreground-muted'}`}>
              {step > i ? <Check className="w-4 h-4" /> : i}
            </span>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-accent-red/20 border border-accent-red text-accent-red p-4 rounded-md font-medium">
          {errorMsg}
        </div>
      )}

      <div className="bg-card border border-border-subtle rounded-lg p-6">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-medium text-foreground mb-4">1. Content Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Content Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber"
                >
                  <option>Blog Post</option>
                  <option>Article</option>
                  <option>Landing Page Copy</option>
                  <option>Press Release</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Topic / Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. 5 Benefits of Dark Mode in SaaS" 
                  className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber placeholder:text-border-active" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Word Count</label>
                <div className="flex gap-3">
                  {[500, 1000, 1500, 2000].map(w => (
                    <button 
                      key={w} 
                      onClick={() => setFormData({...formData, words: w})}
                      className={`flex-1 py-2 border rounded-md text-sm transition-colors ${formData.words === w ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan' : 'border-border-subtle hover:border-accent-cyan hover:text-foreground'}`}
                    >
                      {w} words
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-medium text-foreground mb-4">2. Specifications & Deadline</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Target Deadline</label>
                <input 
                  type="date" 
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Special Instructions Context</label>
                <textarea 
                  rows={5}
                  value={formData.instructions}
                  onChange={e => setFormData({...formData, instructions: e.target.value})}
                  placeholder="Provide context, tone of voice, link to brand guidelines, etc..." 
                  className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber placeholder:text-border-active resize-none" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-medium text-foreground mb-4">3. Review & Submit</h2>
            <div className="bg-elevated border border-border-subtle rounded-md p-4 mb-6">
              <h3 className="font-medium text-foreground mb-3 tracking-wide">{formData.title || "Untitled Order"}</h3>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <div><dt className="text-foreground-muted">Type:</dt><dd className="font-medium text-foreground">{formData.type}</dd></div>
                <div><dt className="text-foreground-muted">Words:</dt><dd className="font-medium text-foreground">{formData.words}</dd></div>
                <div><dt className="text-foreground-muted">Deadline:</dt><dd className="font-medium text-foreground">{formData.deadline || "Standard timeframe"}</dd></div>
                <div><dt className="text-foreground-muted">Estimated Price:</dt><dd className="font-medium text-accent-green">${(formData.words * 0.08).toFixed(2)}</dd></div>
              </dl>
            </div>
            {formData.instructions && (
              <div className="text-sm">
                <span className="text-foreground-muted block mb-1">Instructions</span>
                <p className="bg-background border border-border-subtle p-3 rounded">{formData.instructions}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-border-subtle flex justify-between">
          <button 
             onClick={prevStep}
             disabled={step === 1 || loading}
             className="px-4 py-2 border border-border-subtle text-foreground text-sm font-medium rounded-md hover:bg-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              disabled={step === 1 && !formData.title}
              className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-accent-green hover:bg-accent-green-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Submitting..." : "Submit Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
