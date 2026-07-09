"use client";

import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";
import { BarChart3, Home, Inbox, Settings, Users } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", active: true },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Inbox, label: "Inbox", active: false },
  { icon: Users, label: "Team", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const stats = [
  { label: "Revenue", value: "$12.4k", change: "+12%" },
  { label: "Users", value: "2,847", change: "+8%" },
  { label: "Active", value: "1,203", change: "+3%" },
];

export function DemoDashboard() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  const textOnAccent = textColorForBg(accent);

  if (colors.length === 0) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        "bg-white/[0.03]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-xs font-semibold tracking-tight text-foreground/80">Dashboard</span>
        <div className="flex gap-1.5">
          {stats.slice(0, 2).map((s) => (
            <span key={s.label} className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] tabular-nums text-muted-foreground">
              {s.value}
            </span>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-36 flex-col gap-0.5 p-3 sm:flex" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition-all duration-150",
                "active:scale-[0.97]",
              )}
              style={{
                backgroundColor: item.active ? accent + "15" : "transparent",
                color: item.active ? accent : "rgba(255,255,255,0.4)",
              }}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-white/[0.03] p-3 text-center">
                <div className="text-[10px] sm:text-xs text-muted-foreground/60">{s.label}</div>
                <div className="mt-1 text-sm font-semibold tabular-nums text-foreground/90">{s.value}</div>
                <div className="mt-0.5 text-[10px] tabular-nums" style={{ color: accent }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Activity bar */}
          <div>
            <div className="mb-2 text-[10px] font-medium text-muted-foreground/50">Activity</div>
            <div className="flex items-end gap-1.5 h-16">
              {Array.from({ length: 12 }).map((_, i) => {
                const h = 20 + Math.random() * 60;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i % 3 === 0 ? accent : accent + "40",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* CTA button */}
          <button
            className={cn(
              "w-full rounded-lg py-2 text-center text-xs font-medium transition-all duration-150",
              "active:scale-[0.97]",
            )}
            style={{ backgroundColor: accent, color: textOnAccent }}
          >
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
