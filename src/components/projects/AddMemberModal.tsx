'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usersApi } from '@/lib/api/users.api';
import { useAddMember } from '@/hooks/useProjects';
import type { User } from '@/types/auth.types';
import { Search, Check, Loader2, UserPlus, X } from 'lucide-react';

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  /** IDs of members already in the project so we can grey them out */
  existingMemberIds: string[];
}

export default function AddMemberModal({
  open,
  onClose,
  projectId,
  existingMemberIds,
}: AddMemberModalProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const addMember = useAddMember(projectId);

  // Debounced user search
  const searchUsers = useCallback(
    async (q: string) => {
      setSearching(true);
      try {
        const res = await usersApi.getAll({ search: q || undefined });
        const raw = res.data.data as any;
        const list: User[] = raw.users ?? raw.data ?? [];
        // Filter out already-existing members
        setUsers(list.filter((u) => !existingMemberIds.includes(u.id)));
      } catch {
        setUsers([]);
      } finally {
        setSearching(false);
      }
    },
    [existingMemberIds],
  );

  // Initial load & debounce
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => searchUsers(query), 300);
    return () => clearTimeout(timeout);
  }, [query, open, searchUsers]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelected([]);
      setUsers([]);
    }
  }, [open]);

  const toggleUser = (user: User) => {
    setSelected((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    setAdding(true);
    try {
      // Add them sequentially so each triggers an optimistic cache update
      for (const user of selected) {
        await addMember.mutateAsync(user.id);
      }
      onClose();
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Members
          </DialogTitle>
          <DialogDescription>
            Search and select team members to add to this project.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="member-search"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {selected.map((u) => (
              <Badge
                key={u.id}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <Avatar className="h-4 w-4">
                  <AvatarImage src={u.avatar} />
                  <AvatarFallback className="text-[8px]">
                    {u.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{u.name}</span>
                <button
                  type="button"
                  onClick={() => toggleUser(u)}
                  className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                  aria-label={`Remove ${u.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* User list */}
        <ScrollArea className="h-64 rounded-md border">
          {users.length === 0 && !searching ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">
                {query ? 'No users found' : 'Start typing to search users'}
              </p>
            </div>
          ) : (
            <div className="p-1">
              {users.map((user) => {
                const isSelected = selected.some((u) => u.id === user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user)}
                    className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 hover:bg-primary/15'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isSelected && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                      {user.role.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={adding}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || adding}
          >
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding…
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add {selected.length > 0 ? `(${selected.length})` : ''} Member
                {selected.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
