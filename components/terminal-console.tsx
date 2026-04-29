"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LOG_LINES = [
  "> INFO: Establishing mTLS connection with sidecar_4fj9k...",
  "> SUCCESS: Handshake verified via PQC (Kyber-768).",
  "> INFO: Syncing updated WAF ruleset (v4.2.1)...",
  "> SUCCESS: Ruleset pushed to 12 active nodes.",
  "> WARN: Dropped malformed packet from 192.168.1.15.",
  "> INFO: Rotating bootstrap tokens for environment: production.",
  "> SUCCESS: Rotation complete. 0 nodes disconnected.",
];

export function TerminalConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    let lineIndex = 0;
    setLogs(["> SUN-DRAM Control Plane v2.4.0 initialized."]);
    
    const interval = setInterval(() => {
      if (lineIndex < LOG_LINES.length) {
        setLogs((prev) => [...prev, LOG_LINES[lineIndex]]);
        lineIndex++;
      } else {
        // Randomly repeat some lines
        const randomLine = LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)];
        setLogs((prev) => [...prev, randomLine]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-40 bg-zinc-950/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white p-3 rounded-full shadow-2xl transition-all",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Terminal className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-sm",
              isMaximized ? "inset-4" : "bottom-6 left-6 w-[500px] h-[300px]"
            )}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider">SUNDRAM_CLI</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMaximized(!isMaximized)} className="text-zinc-500 hover:text-white transition-colors">
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "leading-relaxed",
                  log.includes("SUCCESS") ? "text-emerald-400" :
                  log.includes("WARN") ? "text-orange-400" :
                  "text-zinc-300"
                )}>
                  {log}
                </div>
              ))}
              <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
                <span>_</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
