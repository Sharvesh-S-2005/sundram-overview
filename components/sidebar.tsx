"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Server, 
  ShieldCheck, 
  Activity, 
  FileText, 
  CreditCard,
  LogOut
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sidecars", href: "/sidecars", icon: Server },
  { name: "Policies", href: "/policies", icon: ShieldCheck },
  { name: "Security Events", href: "/security-events", icon: Activity },
  { name: "Audit Logs", href: "/audit-logs", icon: FileText },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className={cn("flex h-full w-64 flex-col text-zinc-300 transition-all duration-300", className || "bg-zinc-950 border-r border-white/10")}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-white tracking-wide">SUN-DRAM</span>
      </div>

      <nav className="flex-1 space-y-1 px-4 mt-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">Logged in as</span>
            <span className="text-sm font-medium text-white truncate max-w-[150px]">{user || "user@enterprise.com"}</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
