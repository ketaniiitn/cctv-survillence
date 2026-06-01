const items = ["Overview", "Conversion", "Heatmap", "Anomalies"];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/55 px-5 py-6 lg:block">
      <div className="mb-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400 text-lg font-black text-slate-950">
          SI
        </div>
        <p className="mt-4 text-sm font-semibold text-white">Store store_1</p>
        <p className="text-xs text-slate-500">Retail operations command center</p>
      </div>
      <nav className="space-y-2">
        {items.map((item, index) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={`block rounded-md px-3 py-2.5 text-sm font-medium transition ${
              index === 0
                ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}
