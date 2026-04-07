import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Shield, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="h-20 border-b border-border-subtle flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2 text-accent-amber font-bold text-xl tracking-wide">
          <div className="w-8 h-8 rounded bg-accent-amber flex items-center justify-center text-background">
            <span className="font-black text-lg">CF</span>
          </div>
          ContentFlow
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-foreground-muted hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="text-foreground-muted hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/login" className="text-foreground hover:text-accent-amber transition-colors">Sign In</Link>
          <Link href="/login" className="bg-accent-amber hover:bg-accent-amber-light text-background px-5 py-2.5 rounded-md transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 lg:px-12 py-24 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-amber opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <span className="px-3 py-1 rounded-full border border-accent-cyan bg-accent-cyan/10 text-accent-cyan text-sm font-medium mb-6 animate-fade-in-up">
            v2.0 is now live for all agencies
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-foreground animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Premium content writing, <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-green">delivered at scale.</span>
          </h1>
          <p className="text-lg lg:text-xl text-foreground-muted max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            The ultimate client portal for high-volume content operations. Manage orders, track progress, and communicate with writers in one unified dark-mode dashboard.
          </p>
          <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link href="/login" className="bg-accent-amber hover:bg-accent-amber-light text-background px-8 py-4 rounded-lg font-medium text-lg transition-transform hover:scale-105 flex items-center gap-2">
              Start Your Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="bg-elevated border border-border-subtle hover:border-border-active text-foreground px-8 py-4 rounded-lg font-medium text-lg transition-colors">
              Book a Demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 lg:px-12 py-24 bg-sidebar border-y border-border-subtle">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">SaaS Dashboard Built for Speed</h2>
            <p className="text-foreground-muted text-lg">We stripped away the bloat to give you an interface inspired by premium DRM and developer tools. Fast, efficient, and gorgeously dark.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: "Lightning Fast Orders", desc: "Our 3-step order wizard calculates pricing and deadlines instantly as you type." },
              { icon: Shield, title: "Row Level Security", desc: "Powered by Supabase, ensuring your proprietary content stays locked to your account." },
              { icon: Globe, title: "Real-time Tracking", desc: "Watch orders move from Pending to Drafting to Delivered with live timeline updates." }
            ].map((f, i) => (
              <div key={i} className="bg-card border border-border-subtle p-8 rounded-xl hover:border-accent-cyan transition-colors">
                <div className="w-12 h-12 bg-elevated rounded-lg flex items-center justify-center mb-6 border border-border-subtle">
                  <f.icon className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{f.title}</h3>
                <p className="text-foreground-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 lg:px-12 py-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Trusted by leading marketing teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { quote: "ContentFlow revolutionized how our agency orders website copy. The dashboard looks incredible and works even better.", author: "Sarah Jenkins, CMO at TechGrowth" },
              { quote: "Finally, a content portal that isn't clunky. The dark mode helps me power through ordering 100+ articles a week.", author: "Dave Roberts, Head of SEO" }
            ].map((t, i) => (
              <div key={i} className="bg-elevated border border-border-subtle p-8 rounded-xl relative">
                <div className="text-4xl text-accent-amber opacity-20 absolute top-4 left-4">"</div>
                <p className="text-lg text-foreground mb-6 relative z-10 font-medium">"{t.quote}"</p>
                <div className="text-foreground-muted text-sm font-semibold">{t.author}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-sidebar py-12 text-center text-foreground-muted text-sm px-6">
        <p>&copy; {new Date().getFullYear()} ContentFlow. Designed with SIGMA styling.</p>
      </footer>
    </div>
  );
}
