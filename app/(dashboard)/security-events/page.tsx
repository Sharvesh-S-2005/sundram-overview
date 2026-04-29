"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, AlertTriangle, AlertCircle, ScanLine, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_EVENTS = [
  { id: 1, timestamp: "2 mins ago", type: "WAF", reason: "SQL injection detected", ip: "45.22.11.90", path: "/api/users/login", risk: 98, severity: "critical" },
  { id: 2, timestamp: "15 mins ago", type: "Rate Limit", reason: "Rate limit exceeded (Burst)", ip: "103.45.1.2", path: "/api/products", risk: 65, severity: "warning" },
  { id: 3, timestamp: "1 hour ago", type: "Bot Protection", reason: "Automated browser pattern", ip: "89.112.44.1", path: "/checkout", risk: 85, severity: "high" },
  { id: 4, timestamp: "2 hours ago", type: "Service Mesh", reason: "Unauthorized service identity", ip: "10.0.4.15", path: "auth -> db", risk: 90, severity: "critical" },
  { id: 5, timestamp: "5 hours ago", type: "Access", reason: "Expired JWT token", ip: "192.168.1.45", path: "/api/dashboard", risk: 20, severity: "info" },
];

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

// Generates a random hex string
const generateHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

function PacketInspector() {
  const [packets, setPackets] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial packets
    const initial = Array(15).fill(0).map((_, i) => ({
      id: i,
      hex: `${generateHex()} ${generateHex()} ${generateHex()}`,
      status: Math.random() > 0.8 ? "threat" : "clean",
      offset: Math.random() * 100
    }));
    setPackets(initial);

    // Stream new packets
    const interval = setInterval(() => {
      setPackets(prev => {
        const newPacket = {
          id: Date.now(),
          hex: `${generateHex()} ${generateHex()} ${generateHex()}`,
          status: Math.random() > 0.8 ? "threat" : "clean",
          offset: Math.random() * 100
        };
        return [newPacket, ...prev.slice(0, 14)];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-48 bg-zinc-950 rounded-xl border border-white/10 overflow-hidden relative mb-8 flex shadow-inner">
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      {/* Scanner laser effect */}
      <div className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] z-10 opacity-70" 
           style={{ animation: 'scan 3s linear infinite' }} />

      <div className="w-1/3 border-r border-white/5 bg-black/40 p-4 flex flex-col justify-center relative">
        <div className="flex items-center gap-2 mb-2">
          <ScanLine className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-widest uppercase">Deep Packet Inspection</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">Real-time Layer 7 payload analysis engine active.</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] text-zinc-400 font-mono">CLEAN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] text-zinc-400 font-mono">THREAT INTERCEPTED</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 font-mono text-xs overflow-hidden relative">
        <motion.div className="flex flex-col gap-2">
          <AnimatePresence>
            {packets.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 rounded",
                  p.status === "clean" ? "text-emerald-500/70 bg-emerald-500/5" : "text-destructive bg-destructive/10 font-bold"
                )}
              >
                <span>[PAYLOAD] 0x{p.hex}</span>
                {p.status === "clean" ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                ) : (
                  <span className="flex items-center gap-2 text-[10px] text-destructive">
                    <ShieldAlert className="w-3 h-3" />
                    BLOCKED
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}

export default function SecurityEventsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Security Events</h2>
        <p className="text-zinc-400 mt-2">Real-time threat monitoring and incident response logs.</p>
      </div>

      {!loading && <PacketInspector />}

      <div className="flex gap-4">
        <select className="bg-zinc-900 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Warning</option>
        </select>
        <select className="bg-zinc-900 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
        <select className="bg-zinc-900 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none">
          <option>All Event Types</option>
          <option>WAF Blocks</option>
          <option>Rate Limiting</option>
          <option>Bot Protection</option>
          <option>Service Mesh</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <div className="bg-zinc-950/50 rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Target Path</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead className="text-right">Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <motion.tbody variants={tableVariants} initial="hidden" animate="show" className="[&_tr:last-child]:border-0">
              {MOCK_EVENTS.map((event) => (
                <motion.tr variants={rowVariants} key={event.id} className="border-b border-white/10 transition-colors hover:bg-white/5">
                  <TableCell className="text-zinc-400 text-sm">{event.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {event.severity === "critical" && <ShieldAlert className="w-4 h-4 text-destructive" />}
                      {event.severity === "high" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {event.severity === "warning" && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                      {event.severity === "info" && <AlertCircle className="w-4 h-4 text-zinc-500" />}
                      <span className="capitalize text-sm text-zinc-300">{event.severity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">{event.type}</TableCell>
                  <TableCell className="text-zinc-300">{event.reason}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">{event.path}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">{event.ip}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold",
                      event.risk > 80 ? "bg-destructive/20 text-destructive" : 
                      event.risk > 50 ? "bg-orange-500/20 text-orange-400" : 
                      "bg-zinc-800 text-zinc-400"
                    )}>
                      {event.risk}/100
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </motion.tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
