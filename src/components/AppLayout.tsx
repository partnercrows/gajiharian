import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Layers,
  Settings as SettingsIcon,
  Wallet,
} from "lucide-react";
import { useInvoiceStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { to: "/editor", label: "Editor Gaji", icon: FileText, exact: false },
  { to: "/drafts", label: "Draft Proyek", icon: FolderOpen, exact: false },
  { to: "/templates", label: "Template", icon: Layers, exact: false },
  { to: "/settings", label: "Pengaturan", icon: SettingsIcon, exact: false },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const saveDraft = useInvoiceStore((s) => s.saveDraft);
  const companyName = useInvoiceStore((s) => s.companyName);

  // Auto-save every 30s
  useEffect(() => {
    const id = setInterval(() => saveDraft(), 30000);
    return () => clearInterval(id);
  }, [saveDraft]);

  return (
    <div className="flex min-h-screen w-full bg-background no-print">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground shrink-0">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
          <div className="grid place-items-center h-9 w-9 rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-base truncate">Gajian Harianku</div>
            <div className="text-[11px] text-sidebar-foreground/60 truncate">Payroll Invoice</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-soft"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 text-[11px] text-sidebar-foreground/50 border-t border-sidebar-border">
          v1.0 · 100% data lokal
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 border-b bg-surface flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Workspace</div>
            <div className="font-semibold truncate">{companyName}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            All changes saved locally
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
