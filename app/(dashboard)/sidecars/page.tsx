"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSidecarStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { BadgeCheck, ShieldAlert, Plus, Server, Cpu, MemoryStick, Activity, Network } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function SidecarsPage() {
  const { sidecars, toggleStatus } = useSidecarStore();
  const [loading, setLoading] = useState(true);
  const [selectedSidecar, setSelectedSidecar] = useState<any | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Sidecars</h2>
          <p className="text-zinc-400 mt-2">Manage your distributed Zero Trust enforcement nodes.</p>
        </div>
        <Link href="/sidecars/create">
          <Button className="bg-white text-black hover:bg-zinc-200 gap-2">
            <Plus className="w-4 h-4" />
            Create Sidecar
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : sidecars.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-dashed border-white/20 rounded-xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Server className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No sidecars deployed</h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6">
            Get started by deploying your first SUN-DRAM sidecar to protect your microservices.
          </p>
          <Link href="/sidecars/create">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Create your first Sidecar
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="bg-zinc-950/50 rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>App Name</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <motion.tbody variants={tableVariants} initial="hidden" animate="show" className="[&_tr:last-child]:border-0">
              {sidecars.map((sc) => (
                <motion.tr 
                  variants={rowVariants} 
                  key={sc.id} 
                  className="border-b border-white/10 transition-colors hover:bg-white/5 group cursor-pointer"
                  onClick={() => setSelectedSidecar(sc)}
                >
                  <TableCell className="font-mono text-xs text-zinc-400">{sc.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium text-white group-hover:text-emerald-400 transition-colors">{sc.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-zinc-300 border border-white/10">
                      {sc.env}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-400">{sc.region}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {sc.health === "healthy" ? (
                        <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-destructive" />
                      )}
                      <span className="capitalize text-sm text-zinc-300">{sc.health}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        sc.status === "active" ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-zinc-600"
                      )} />
                      <span className="capitalize text-sm text-zinc-300">{sc.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleStatus(sc.id)}
                      className={cn(
                        "h-8 border-white/10 transition-colors",
                        sc.status === "active" 
                          ? "hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30" 
                          : "hover:bg-emerald-400/20 hover:text-emerald-400 hover:border-emerald-400/30"
                      )}
                    >
                      {sc.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </motion.tbody>
          </Table>
        </div>
      )}

      {/* Sidecar Details Drawer */}
      <Sheet open={!!selectedSidecar} onOpenChange={(open) => !open && setSelectedSidecar(null)}>
        <SheetContent className="w-[500px] sm:w-[600px] border-l border-white/10 p-0 overflow-hidden flex flex-col">
          {selectedSidecar && (
            <>
              <div className="p-6 border-b border-white/10 bg-zinc-950/50">
                <SheetHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <SheetTitle className="text-2xl">{selectedSidecar.name}</SheetTitle>
                      <SheetDescription className="font-mono text-xs mt-1">Node ID: {selectedSidecar.id}</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <div className="flex gap-2 mt-4">
                  <span className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300 capitalize">{selectedSidecar.env}</span>
                  <span className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300">{selectedSidecar.region}</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-400 capitalize flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {selectedSidecar.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400">CPU Usage</span>
                      <Cpu className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">14.2%</div>
                    <div className="w-full bg-black h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400">Memory</span>
                      <MemoryStick className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">128 MB</div>
                    <div className="w-full bg-black h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-white">Active Connections</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-4xl font-bold text-white tracking-tighter">1,248</div>
                    <div className="text-sm text-emerald-400 flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Live
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4 h-12 items-end opacity-50">
                    {Array(20).fill(0).map((_, i) => (
                      <div key={i} className="flex-1 bg-white rounded-t-sm" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Recent Node Logs</h4>
                  <div className="bg-black border border-white/10 rounded-lg p-4 font-mono text-xs space-y-2 text-zinc-400 h-48 overflow-y-auto">
                    <div className="text-emerald-500/80">[INFO] Syncing WAF ruleset (v4.2.1) from control plane...</div>
                    <div className="text-emerald-500/80">[OK] Ruleset applied in 12ms</div>
                    <div>[WARN] Rate limit threshold approached for 10.0.0.15</div>
                    <div>[INFO] PQC Handshake established with sc_7x89asdf</div>
                    <div>[INFO] Dropped connection from untrusted origin (RU)</div>
                    <div className="text-emerald-500/80">[OK] Memory garbage collection complete</div>
                    <div>[INFO] Telemetry exported successfully</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
