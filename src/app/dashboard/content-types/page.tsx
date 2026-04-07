export default function ContentTypesPage() {
  const types = [
    { name: "Blog Post", desc: "Long-form informational articles", price: "$0.08 / word", time: "2-3 days", icon: "📝" },
    { name: "Website Copy", desc: "Conversion-focused landing pages", price: "$0.12 / word", time: "3-5 days", icon: "💻" },
    { name: "Email Sequences", desc: "Engaging drip campaigns", price: "$0.10 / word", time: "2 days", icon: "✉️" },
    { name: "Product Descriptions", desc: "For e-commerce catalogs", price: "$0.06 / word", time: "24 hours", icon: "🛒" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Content Types</h1>
          <p className="text-sm text-foreground-muted mt-1">Configure available content formats & pricing options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map(t => (
          <div key={t.name} className="bg-card border border-border-subtle rounded-lg p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <h3 className="font-semibold text-foreground text-lg">{t.name}</h3>
              </div>
              <div className="w-10 h-5 bg-accent-green rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 bg-background rounded-full ml-auto"></div>
              </div>
            </div>
            <p className="text-sm text-foreground-muted mb-6 flex-1">{t.desc}</p>
            <div className="flex justify-between items-center bg-elevated p-3 rounded border border-border-subtle text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-foreground-muted">Estimated Turnaround</span>
                <span className="font-medium text-foreground">{t.time}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-foreground-muted">Base Price</span>
                <span className="font-medium text-foreground">{t.price}</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-background border border-border-subtle hover:border-accent-amber text-sm font-medium py-2 rounded transition-colors text-foreground">
              Configure Settings
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
