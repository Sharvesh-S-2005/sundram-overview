"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, Activity } from "lucide-react";

const MOCK_THREATS = [
  { type: "WAF", msg: "SQLi attempt blocked from 45.22.11.90", icon: ShieldAlert, color: "text-destructive" },
  { type: "RATE", msg: "Rate limit triggered for 103.45.1.2", icon: AlertTriangle, color: "text-orange-500" },
  { type: "SYNC", msg: "Policy sync completed on sc_4fj9k", icon: Activity, color: "text-emerald-500" },
  { type: "BOT", msg: "Automated scraper blocked on /api/v1", icon: ShieldAlert, color: "text-destructive" },
  { type: "MESH", msg: "Unauthorized cross-service call dropped", icon: AlertTriangle, color: "text-orange-500" },
];

export function ThreatTicker() {
  const [events, setEvents] = useState<{ id: number; data: any }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const interval = setInterval(() => {
      const randomThreat = MOCK_THREATS[Math.floor(Math.random() * MOCK_THREATS.length)];
      const newEvent = { id: ++idCounter, data: randomThreat };
      
      setEvents((prev) => {
        const updated = [newEvent, ...prev];
        return updated.slice(0, 3); // Keep only last 3
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80 pointer-events-none">
      <AnimatePresence>
        {events.map((event) => {
          const Icon = event.data.icon;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-zinc-950/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl flex items-start gap-3 pointer-events-auto"
            >
              <div className="mt-0.5">
                <Icon className={`w-4 h-4 ${event.data.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-white mb-0.5">{event.data.type}</div>
                <div className="text-xs text-zinc-400 leading-snug">{event.data.msg}</div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
