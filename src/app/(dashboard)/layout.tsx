"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ThemeToggle from "@/components/layout/ThemeToggle";
import NotificationPanel from "@/components/notifications/NotificationPanel";
import { cn } from "@/lib/utils";
import { useAppDispatch, useUser } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import type { Role } from "@/types/auth.types";
import {
  BarChart3,
  Bell,
  CheckSquare,
  ChevronDown,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_CONFIG: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Team", href: "/team", icon: Users },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  PROJECT_MANAGER: [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Team", href: "/team", icon: Users },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  TEAM_MEMBER: [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

const ROLE_BADGE: Record<Role, { label: string; color: string }> = {
  ADMIN: { label: "Admin", color: "bg-purple-600" },
  PROJECT_MANAGER: { label: "Project Manager", color: "bg-blue-600" },
  TEAM_MEMBER: { label: "Team Member", color: "bg-primary" },
};

function SidebarContent({
  navItems,
  pathname,
  onNavClick,
  onLogout,
  role,
  user,
}: {
  navItems: NavItem[];
  pathname: string;
  onNavClick?: () => void;
  onLogout: () => void;
  role: Role;
  user: { name?: string; email?: string; avatar?: string } | null;
}) {
  const badge = ROLE_BADGE[role];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-sidebar-border shrink-0">
        <Link href="/" className="block" onClick={onNavClick}>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            <span className="text-primary">Task</span>{" "}
            <span className="text-secondary">Flow</span>
          </h2>
          {badge && (
            <span
              className={cn(
                "inline-block mt-1 text-[0.625rem] text-white px-2 py-0.5 rounded-full font-medium",
                badge.color
              )}
            >
              {badge.label}
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={onNavClick}
                >
                  <item.icon className="size-[1.125rem] shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="shrink-0" />

      <div className="p-3 shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="size-[1.125rem]" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role: Role = user?.role ?? "TEAM_MEMBER";

  const handleLogout = async () => {
    await dispatch(logout() as any);
    router.push("/login");
  };

  const navItems = useMemo(
    () => NAV_CONFIG[role] ?? NAV_CONFIG.TEAM_MEMBER,
    [role]
  );
  const badge = ROLE_BADGE[role];

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 border-r-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            navItems={navItems}
            pathname={pathname}
            onNavClick={() => setSidebarOpen(false)}
            onLogout={handleLogout}
            role={role}
            user={user}
          />
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:flex flex-col h-full w-64 xl:w-72 bg-card border-r border-border shrink-0 transition-all duration-300">
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          onLogout={handleLogout}
          role={role}
          user={user}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="shrink-0 bg-card border-b border-border px-4 sm:px-5 py-3 flex items-center justify-between gap-4 h-16 w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate hidden sm:block">
              {badge?.label} Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle />

            <NotificationPanel />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 outline-none cursor-pointer">
                  <Avatar className={cn("size-8 sm:size-9", badge?.color)}>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback
                      className={cn(
                        "text-white font-bold text-xs sm:text-sm",
                        badge?.color
                      )}
                    >
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-foreground leading-tight truncate max-w-[120px]">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[0.625rem] text-muted-foreground">
                      {user?.email || ""}
                    </p>
                  </div>
                  <ChevronDown className="hidden sm:block size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <KeyRound className="size-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleLogout()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 bg-slate-50/50 dark:bg-background/95">
          {children}
        </main>
      </div>
    </div>
  );
}
