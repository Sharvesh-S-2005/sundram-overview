"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { TerminalConsole } from "@/components/terminal-console";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token && pathname !== "/login") {
      router.push("/login");
    }
  }, [mounted, token, pathname, router]);

  // Don't render layout until mounted to prevent hydration mismatch with local storage
  if (!mounted) {
    return <div className="min-h-screen bg-black flex items-center justify-center" />;
  }

  // If no token, return null while redirecting
  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white relative">
      <CommandPalette />
      <TerminalConsole />
      
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <Sidebar className="z-10 bg-zinc-950/60 backdrop-blur-2xl border-r border-white/5" />
      
      <main className="flex-1 overflow-y-auto z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
