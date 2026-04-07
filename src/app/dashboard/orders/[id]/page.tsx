"use client";

import { useEffect, useState } from "react";
import { Download, MessageSquare, CheckCircle, Clock, Check, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        console.error("Order not found", error);
        router.push("/dashboard/orders");
        return;
      }

      setOrder(data);
      setLoading(false);
    }
    
    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router, supabase]);

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{order.title}</h1>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-opacity-20 ${
              order.status === 'Pending' ? 'bg-accent-amber/20 text-accent-amber' :
              order.status === 'In Progress' ? 'bg-accent-cyan/20 text-accent-cyan' :
              order.status === 'Delivered' ? 'bg-accent-green/20 text-accent-green' : 'bg-gray-500/20 text-gray-500'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-foreground-muted mt-1">Order #{order.id.substring(0, 8).toUpperCase()} • Created on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-elevated hover:bg-border-subtle border border-border-subtle text-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors">
            Request Revision
          </button>
          <button className="bg-accent-green hover:bg-accent-green-light text-background text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2">
            <Check className="w-4 h-4" /> Approve & Complete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          {/* Progress Tracker */}
          <div className="bg-card border border-border-subtle rounded-lg p-6">
            <h3 className="text-sm font-medium text-foreground mb-6">Order Status</h3>
            <div className="relative">
              <div className="absolute left-[15px] top-[15px] bottom-[15px] w-0.5 bg-border-active"></div>
              
              <div className="flex gap-4 mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-accent-amber flex text-background items-center justify-center shrink-0 z-10"><CheckCircle className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Order Received</h4>
                  <p className="text-xs text-foreground-muted mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>

              {order.status !== 'Pending' && (
                <div className="flex gap-4 mb-6 relative">
                  <div className="w-8 h-8 rounded-full bg-accent-amber flex text-background items-center justify-center shrink-0 z-10"><CheckCircle className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Writer Assigned</h4>
                    <p className="text-xs text-foreground-muted mt-1">In progress</p>
                  </div>
                </div>
              )}

              {order.status === 'In Progress' && (
                <div className="flex gap-4 mb-6 relative">
                  <div className="w-8 h-8 rounded-full bg-background border-2 border-accent-cyan flex text-accent-cyan items-center justify-center shrink-0 z-10 animate-pulse"></div>
                  <div>
                    <h4 className="text-sm font-medium text-accent-cyan">Drafting Content</h4>
                    <p className="text-xs text-foreground-muted mt-1">Currently being written</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Area */}
          <div className="bg-card border border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center py-12 text-center">
            {order.status === 'Delivered' ? (
              <>
                 <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-green" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Your content is ready!</h3>
                <p className="text-sm text-foreground-muted mt-2 max-w-md">
                  Please review the deliverable and either request a revision or mark as complete.
                </p>
                <button className="mt-6 bg-accent-cyan hover:bg-accent-cyan-light text-background text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Deliverable
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-elevated rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-accent-amber" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Writer is working on your content</h3>
                <p className="text-sm text-foreground-muted mt-2 max-w-md">
                  The initial draft will appear here when it's ready. You will receive an email notification.
                </p>
                <button disabled className="mt-6 bg-elevated text-foreground-muted text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 cursor-not-allowed border border-border-subtle opacity-50">
                  <Download className="w-4 h-4" /> Download Deliverable
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border-subtle rounded-lg p-5">
            <h3 className="text-sm font-medium text-foreground border-b border-border-subtle pb-3 mb-3">Order Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Type:</dt>
                <dd className="font-medium text-foreground">{order.content_type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Words:</dt>
                <dd className="font-medium text-foreground">{order.word_count.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between flex-col">
                <dt className="text-foreground-muted mb-1">Target Audience:</dt>
                <dd className="font-medium text-foreground">{order.target_audience || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between flex-col pt-2 border-t border-border-subtle">
                <dt className="text-foreground-muted mb-1">Instructions:</dt>
                <dd className="text-foreground-muted text-xs leading-relaxed">{order.instructions || 'No instructions provided.'}</dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-card border border-border-subtle rounded-lg flex flex-col h-64">
             <div className="p-4 border-b border-border-subtle font-medium text-sm flex items-center gap-2 text-foreground">
               <MessageSquare className="w-4 h-4" />
               Direct Messages
             </div>
             <div className="flex-1 p-4 flex items-center justify-center text-center text-foreground-muted text-sm">
                Messaging becomes available once a writer is assigned.
             </div>
             <div className="p-3 border-t border-border-subtle bg-elevated flex gap-2">
               <input disabled type="text" placeholder="Type a message..." className="flex-1 bg-background border border-border-subtle text-xs rounded py-1.5 px-2 opacity-50 cursor-not-allowed" />
               <button disabled className="bg-elevated text-foreground-muted text-xs font-semibold px-3 py-1.5 rounded opacity-50 cursor-not-allowed">Send</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
