'use client';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import ThemeToggle from './ThemeToggle';

export default function Topbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => dispatch(toggleSidebar())}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
