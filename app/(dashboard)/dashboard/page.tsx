"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ShieldAlert, ShieldCheck, Server, Globe } from "lucide-react";
import { motion, animate } from "framer-motion";
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const requestData = [
  { time: "00:00", legitimate: 4000, attack: 0 },
  { time: "04:00", legitimate: 4500, attack: 0 },
  { time: "08:00", legitimate: 4200, attack: 0 },
  { time: "10:00", legitimate: 4400, attack: 20000 },
  { time: "12:00", legitimate: 4800, attack: 145000 }, // Massive DDoS Spike
  { time: "14:00", legitimate: 4600, attack: 120000 },
  { time: "16:00", legitimate: 4100, attack: 65000 },
  { time: "20:00", legitimate: 4500, attack: 5000 },
  { time: "24:00", legitimate: 4000, attack: 0 },
];

const blockData = [
  { name: "Mon", Allowed: 4000, Blocked: 240 },
  { name: "Tue", Allowed: 3000, Blocked: 139 },
  { name: "Wed", Allowed: 20000, Blocked: 980 },
  { name: "Thu", Allowed: 27800, Blocked: 3908 },
  { name: "Fri", Allowed: 18900, Blocked: 4800 },
  { name: "Sat", Allowed: 23900, Blocked: 3800 },
  { name: "Sun", Allowed: 14900, Blocked: 4300 },
];

function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.floor(v)),
    });
    return controls.stop;
  }, [value]);

  return <>{displayValue.toLocaleString()}{suffix}</>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-zinc-400 mt-2">Overview of your SUN-DRAM Zero Trust network.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-white/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sidecars</CardTitle>
            <Server className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold">
                <AnimatedNumber value={12} />
              </motion.div>
            )}
            <p className="text-xs text-zinc-500 mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:border-destructive/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Blocked Requests</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-destructive">
                <AnimatedNumber value={355} suffix="K" />
              </motion.div>
            )}
            <p className="text-xs text-zinc-500 mt-1">+850% (Volumetric Attack Absorbed)</p>
          </CardContent>
        </Card>
        
        <Card className="hover:border-white/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-20" /> : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold">
                <AnimatedNumber value={390} suffix="K" />
              </motion.div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Processed across all regions</p>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-400/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-destructive animate-pulse">
                CRITICAL
              </motion.div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Active DDoS mitigation in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Abstract Glowing Threat Map Simulator */}
        <Card className="col-span-1 md:col-span-3 border-white/10 hover:border-white/20 transition-colors relative overflow-hidden bg-black h-[250px]">
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover opacity-10" style={{ filter: 'invert(1)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Live Threat Geography</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 w-full h-full">
             {/* Simulating pulsing threat locations */}
             <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-destructive rounded-full animate-ping opacity-75" />
             <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-destructive rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]" />

             <div className="absolute top-[40%] left-[70%] w-2 h-2 bg-orange-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />
             <div className="absolute top-[40%] left-[70%] w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]" />

             <div className="absolute top-[60%] left-[80%] w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '2.5s' }} />
             <div className="absolute top-[60%] left-[80%] w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)]" />
          </CardContent>
        </Card>

        {/* DDoS Mitigation Simulator Graph */}
        <Card className="col-span-1 md:col-span-2 border-white/10 hover:border-white/20 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              DDoS Attack Mitigation Status
            </CardTitle>
            <CardDescription>Real-time traffic absorption. Notice the stable legitimate traffic line despite volumetric attacks.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? <Skeleton className="w-full h-full" /> : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={requestData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }} 
                      itemStyle={{ color: '#fff' }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="attack" name="Blocked L7 Attack Traffic" stroke="#ef4444" fillOpacity={1} fill="url(#colorAttack)" animationDuration={1500} />
                    <Area type="monotone" dataKey="legitimate" name="Allowed Valid Traffic" stroke="#10b981" fillOpacity={1} fill="url(#colorLegit)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border-white/10 hover:border-white/20 transition-colors">
          <CardHeader>
            <CardTitle>Traffic Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? <Skeleton className="w-full h-full" /> : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={blockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }} cursor={{ fill: '#ffffff05' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Allowed" fill="#ffffff" radius={[4, 4, 0, 0]} animationDuration={1500} />
                    <Bar dataKey="Blocked" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
