'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usersApi } from '@/lib/api/users.api';
import type { User } from '@/types/auth.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDebounce } from '@/hooks/useDebounce';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => void;
  isLoading?: boolean;
}

export default function AddMemberDialog({ open, onClose, onSubmit, isLoading }: AddMemberDialogProps) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setUsers([]);
      return;
    }
    setSearching(true);
    usersApi.getAll({ search: debouncedSearch })
      .then((r) => {
        setUsers(r.data.data.users);
      })
      .catch(() => setUsers([]))
      .finally(() => setSearching(false));
  }, [debouncedSearch]);

  const handleSelect = (user: User) => {
    onSubmit(user.id);
    setSearch('');
    setUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Search by name or email to find a team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {users.length > 0 && (
            <div className="space-y-1 max-h-[200px] overflow-y-auto border rounded-md">
              {users.map((user) => (
                <button
                  key={user.id}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-muted transition-colors text-left"
                  onClick={() => handleSelect(user)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searching && (
            <p className="text-xs text-muted-foreground text-center">Searching...</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
