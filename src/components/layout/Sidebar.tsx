'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { cn } from '@/utils/cn';
import { useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  CheckSquare,
  ChevronLeft,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  const router = useRouter();
  const { sidebarOpen } = useAppSelector(s => s.ui);
  const { user } = useAppSelector(s => s.auth);

  const handleLogout = () => {
    qc.clear();
    dispatch(logout());
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {sidebarOpen && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              TF
            </div>
            <span className="font-semibold tracking-tight">TaskFlow</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="ml-auto"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform duration-300', !sidebarOpen && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                !sidebarOpen && 'justify-center px-2',
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn('border-t p-3', !sidebarOpen && 'flex justify-center')}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
