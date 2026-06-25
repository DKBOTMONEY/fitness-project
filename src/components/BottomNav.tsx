import { Home, Apple, Dumbbell, LogOut, MessageSquare, AlertTriangle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Apple, label: 'Food', href: '/dashboard/nutrition' },
    { icon: Dumbbell, label: 'Workout', href: '/dashboard/workouts' },
    { icon: MessageSquare, label: 'LINE Bot', href: '/dashboard/line' },
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
    <nav className="md:hidden fixed bottom-0 w-full h-16 bg-background/95 backdrop-blur-md border-t border-border flex justify-around items-center z-50 px-2 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${
              isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground'
            }`}
          >
            <Icon size={22} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={() => window.dispatchEvent(new Event('open-bug-report'))}
        className="flex flex-col items-center justify-center w-16 h-full gap-1 text-muted-foreground cursor-pointer"
      >
        <AlertTriangle size={22} className="stroke-2" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-wide">Report</span>
      </button>
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center w-16 h-full gap-1 text-red-500"
      >
        <LogOut size={22} className="stroke-2" />
        <span className="text-[10px] font-medium tracking-wide">Logout</span>
      </button>
    </nav>
  );
}

