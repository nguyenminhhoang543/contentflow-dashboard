import { Download, MessageSquare, CheckCircle, Clock, Check } from "lucide-react";

export default function OrderDetailPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">SEO Optimized Landing Page</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-cyan bg-opacity-20 text-accent-cyan">
              In Progress
            </span>
          </div>
          <p className="text-sm text-foreground-muted mt-1">Order #ORD-20261 • Created on Apr 5, 2026</p>
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
                  <p className="text-xs text-foreground-muted mt-1">Apr 5, 2026 10:30 AM</p>
                </div>
              </div>

              <div className="flex gap-4 mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-accent-amber flex text-background items-center justify-center shrink-0 z-10"><CheckCircle className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Writer Assigned</h4>
                  <p className="text-xs text-foreground-muted mt-1">Apr 5, 2026 2:15 PM</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-background border-2 border-accent-cyan flex text-accent-cyan items-center justify-center shrink-0 z-10 animate-pulse"></div>
                <div>
                  <h4 className="text-sm font-medium text-accent-cyan">Drafting Content</h4>
                  <p className="text-xs text-foreground-muted mt-1">In progress. Expected by Apr 8</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Area */}
          <div className="bg-card border border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center py-12 text-center">
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
          </div>
        </div>

        {/* Sidebar info */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border-subtle rounded-lg p-5">
            <h3 className="text-sm font-medium text-foreground border-b border-border-subtle pb-3 mb-3">Order Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Type:</dt>
                <dd className="font-medium text-foreground">Landing Page</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Words:</dt>
                <dd className="font-medium text-foreground">1,500</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Keywords:</dt>
                <dd className="font-medium text-foreground text-right w-1/2">SaaS, B2B Marketing, Automation</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Tone:</dt>
                <dd className="font-medium text-foreground">Professional</dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-card border border-border-subtle rounded-lg flex flex-col h-64">
             <div className="p-4 border-b border-border-subtle font-medium text-sm flex items-center gap-2 text-foreground">
               <MessageSquare className="w-4 h-4" />
               Direct Messages
             </div>
             <div className="flex-1 p-4 overflow-y-auto">
               {/* Chat log mock */}
               <div className="bg-elevated p-3 rounded-lg rounded-tl-none text-sm text-foreground mb-3 max-w-[85%] self-start">
                  Hello! I'm Alice, your assigned writer. Does the target audience include enterprise CTOs?
               </div>
               <div className="bg-border-active p-3 rounded-lg rounded-tr-none text-sm text-background mb-3 max-w-[85%] ml-auto">
                  Yes, specifically VP and C-level engineering leaders. Let's make the ROI very clear.
               </div>
             </div>
             <div className="p-3 border-t border-border-subtle bg-elevated flex gap-2">
               <input type="text" placeholder="Type a message..." className="flex-1 bg-background border border-border-subtle text-xs rounded py-1.5 px-2 focus:outline-none" />
               <button className="bg-accent-amber text-background text-xs font-semibold px-3 py-1.5 rounded">Send</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
