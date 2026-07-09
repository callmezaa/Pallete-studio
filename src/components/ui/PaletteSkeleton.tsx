"use client";

export function PaletteSkeleton() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-balance">Palette</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            <div className="h-32 rounded-t-xl bg-white/[0.06]" />
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-white/[0.06]" />
                <div className="h-3 w-10 rounded bg-white/[0.04]" />
              </div>
              {[0.7, 0.55, 0.4].map((w, j) => (
                <div key={j} className="h-3 rounded bg-white/[0.04]" style={{ width: `${w * 100}%` }} />
              ))}
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 rounded-lg bg-white/[0.06]" />
                <div className="h-8 w-8 rounded-lg bg-white/[0.06]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
