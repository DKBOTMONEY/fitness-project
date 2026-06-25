import { Home, User, Apple, Dumbbell, Settings, Crown, Sun, Moon, Activity, LogOut, MessageSquare, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Activity, label: 'Running', href: '/dashboard/running' },
    { icon: Apple, label: 'Nutrition', href: '/dashboard/nutrition' },
    { icon: Dumbbell, label: 'Training', href: '/dashboard/workouts' },
    { icon: MessageSquare, label: 'LINE Chatbot', href: '/dashboard/line' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <aside className="hidden md:flex flex-col bg-card/50 backdrop-blur-xl border-r border-border w-20 lg:w-64 transition-all duration-300 z-20">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Dumbbell size={18} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg text-foreground hidden lg:block tracking-tight">Hundee</span>
      </div>
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-[inset_0_1px_3px_rgba(255,87,34,0.05)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="px-6 py-4 border-t border-border flex flex-col gap-4">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden lg:block font-bold text-sm">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        )}
        
        <Link
          href="/dashboard/subscription"
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
            pathname === '/dashboard/subscription'
              ? 'bg-primary/10 text-primary shadow-[inset_0_1px_3px_rgba(255,87,34,0.05)]'
              : 'text-primary hover:bg-primary/10'
          }`}
        >
          <Crown size={20} />
          <span className="hidden lg:block font-bold text-sm">Upgrade</span>
        </Link>

        <button
          onClick={() => window.dispatchEvent(new Event('open-bug-report'))}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          title="Report Issue"
          aria-label="Report Issue"
        >
          <AlertTriangle size={20} aria-hidden="true" />
          <span className="hidden lg:block font-bold text-sm">Report Issue</span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="hidden lg:block font-bold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

