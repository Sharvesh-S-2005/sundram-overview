"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      login(email, "customer", "mock-jwt-token");
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background gradients for premium feel */}
      <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md p-8 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl mb-4 shadow-lg shadow-white/10">
            <Shield className="text-black w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SUN-DRAM</h1>
          <p className="text-zinc-400 text-sm mt-2">Zero Trust Architecture Platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="admin@enterprise.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20 h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot password?</a>
            </div>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20 h-11"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 transition-all font-medium text-sm mt-2"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            Protected by Post-Quantum Cryptography
          </p>
        </div>
      </div>
    </div>
  );
}
