'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@taskflow.dev', password: 'demo1234' },
  manager: { email: 'manager@taskflow.dev', password: 'demo1234' },
  member: { email: 'member@taskflow.dev', password: 'demo1234' },
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector(s => s.auth);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(loginThunk(values));
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Welcome back!');
      router.push('/');
    } else {
      toast.error(result.payload as string ?? 'Login failed');
    }
  };

  const fillDemo = (type: 'admin' | 'manager' | 'member') => {
    setValue('email', DEMO_CREDENTIALS[type].email);
    setValue('password', DEMO_CREDENTIALS[type].password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
            TF
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to TaskFlow</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team and projects
          </p>
        </div>

        {/* Demo buttons */}
        <div className="space-y-2">
          <p className="text-center text-xs text-muted-foreground font-medium">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => fillDemo('admin')} className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950">
              Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => fillDemo('manager')} className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950">
              PM
            </Button>
            <Button variant="outline" size="sm" onClick={() => fillDemo('member')} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950">
              Member
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-background p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
