"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Server, ShieldCheck, Activity, CreditCard } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 pt-[20vh] animate-in fade-in duration-200" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full h-full flex flex-col bg-transparent" loop>
          <div className="flex items-center px-4 border-b border-white/10">
            <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Search policies, sidecars, or commands... (⌘K to close)" 
              className="flex-1 h-12 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none border-none text-sm ring-0"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide text-sm">
            <Command.Empty className="py-6 text-center text-zinc-500">No results found.</Command.Empty>

            <Command.Group heading="Suggestions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500">
              <Command.Item 
                onSelect={() => { router.push("/sidecars/create"); setOpen(false); }}
                className="flex items-center px-2 py-2.5 rounded-md cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
              >
                <Server className="w-4 h-4 mr-2" />
                Deploy New Sidecar
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/policies"); setOpen(false); }}
                className="flex items-center px-2 py-2.5 rounded-md cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Configure Threat Policies
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-white/5 my-2" />

            <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500">
              <Command.Item 
                onSelect={() => { router.push("/dashboard"); setOpen(false); }}
                className="flex items-center px-2 py-2.5 rounded-md cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard Overview
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/security-events"); setOpen(false); }}
                className="flex items-center px-2 py-2.5 rounded-md cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-destructive" />
                View Security Events
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/billing"); setOpen(false); }}
                className="flex items-center px-2 py-2.5 rounded-md cursor-pointer text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
