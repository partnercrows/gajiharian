import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Layers,
  Settings as SettingsIcon,
  HelpCircle,
  Wallet,
  Sun,
  Moon,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useInvoiceStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "light" | "dark" | "reading";

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem("gajiharian-theme");
    if (stored === "dark" || stored === "reading" || stored === "light") return stored;
  } catch {}
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "reading");
  if (theme === "dark") root.classList.add("dark");
  else if (theme === "reading") root.classList.add("reading");
  try { localStorage.setItem("gajiharian-theme", theme); } catch {}
}

const THEME_ICONS: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, reading: BookOpen };
const THEME_NEXT: Record<Theme, Theme> = { light: "dark", dark: "reading", reading: "light" };
const THEME_LABEL: Record<Theme, string> = { light: "Terang", dark: "Gelap", reading: "Membaca" };

function getStoredSidebar(): boolean {
  try { return localStorage.getItem("gajiharian-sidebar") === "collapsed"; } catch {}
  return false;
}

const nav = [
  { to: "/", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { to: "/editor", label: "Editor Gaji", icon: FileText, exact: false },
  { to: "/drafts", label: "Draft Proyek", icon: FolderOpen, exact: false },
  { to: "/templates", label: "Template", icon: Layers, exact: false },
  { to: "/settings", label: "Pengaturan", icon: SettingsIcon, exact: false },
  { to: "/help", label: "Bantuan", icon: HelpCircle, exact: false },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getStoredSidebar);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const saveDraft = useInvoiceStore((s) => s.saveDraft);
  const companyName = useInvoiceStore((s) => s.companyName);

  // Apply theme synchronously on mount & change to avoid flash during navigation
  useLayoutEffect(() => {
    applyTheme(theme);
    return () => {
      // Cleanup on unmount: remove all theme classes to prevent carry-over
      document.documentElement.classList.remove("dark", "reading");
    };
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => THEME_NEXT[prev]);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("gajiharian-sidebar", next ? "collapsed" : "expanded"); } catch {}
      return next;
    });
  }, []);

  // Auto-save every 30s
  useEffect(() => {
    const id = setInterval(() => saveDraft(), 30000);
    return () => clearInterval(id);
  }, [saveDraft]);

  const ThemeIcon = THEME_ICONS[theme];

  return (
    <div className="flex min-h-screen w-full bg-background no-print">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar text-sidebar-foreground shrink-0 transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex items-center h-16 border-b border-sidebar-border",
            sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-5",
          )}
        >
          {sidebarCollapsed ? (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60"
              title="Buka sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          ) : (
            <>
              <div className="grid place-items-center h-9 w-9 rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base truncate">Gaji Harian</div>
                <div className="text-[11px] text-sidebar-foreground/60 truncate">Payroll Invoice</div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 shrink-0 ml-auto"
                title="Tutup sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <TooltipProvider delayDuration={300}>
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const link = (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    sidebarCollapsed && "justify-center px-2",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-soft"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.to}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return link;
            })}
          </TooltipProvider>
        </nav>
        {!sidebarCollapsed && (
          <div className="px-5 py-4 text-[11px] text-sidebar-foreground/50 border-t border-sidebar-border">
            © 2026 Gaji Harian · All Rights Reserved
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 border-b bg-surface flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Workspace</div>
              <div className="font-semibold truncate">{companyName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            Semua perubahan tersimpan lokal
            <button
              onClick={cycleTheme}
              className="ml-2 p-1 rounded hover:bg-accent transition-colors"
              title={`Tema: ${THEME_LABEL[theme]}`}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}