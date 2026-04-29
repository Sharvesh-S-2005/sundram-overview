"use client";

import { useState } from "react";
import { useBillingStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const { plan, credits, upgrade } = useBillingStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Razorpay payment modal
    setTimeout(() => {
      upgrade();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Billing & Plans</h2>
        <p className="text-zinc-400 mt-2">Manage your SUN-DRAM subscription and compute credits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={cn(
          "relative overflow-hidden transition-all",
          plan === "Basic" ? "border-white/50 bg-white/5" : "border-white/10"
        )}>
          {plan === "Basic" && <div className="absolute top-0 left-0 w-full h-1 bg-white" />}
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <div className="text-3xl font-bold mt-2">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
            <CardDescription className="mt-2">For individuals exploring Zero Trust.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-500" /> Up to 2 Sidecars</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-500" /> Standard WAF Rules</li>
              <li className="flex items-center gap-2 text-zinc-600"><Check className="w-4 h-4" /> No PQC Encryption</li>
              <li className="flex items-center gap-2 text-zinc-600"><Check className="w-4 h-4" /> 24-hour log retention</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan === "Basic" ? "secondary" : "outline"} disabled={plan === "Basic"}>
              {plan === "Basic" ? "Current Plan" : "Downgrade"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={cn(
          "relative overflow-hidden transition-all border-emerald-500/30 bg-emerald-950/10",
          plan === "Pro" ? "ring-2 ring-emerald-500" : ""
        )}>
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">POPULAR</div>
          <CardHeader>
            <CardTitle className="text-emerald-400">Pro</CardTitle>
            <div className="text-3xl font-bold mt-2 text-white">$49<span className="text-lg text-emerald-500/70 font-normal">/mo</span></div>
            <CardDescription className="mt-2">For growing microservice architectures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 20 Sidecars</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced WAF & Bot Protection</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Post-Quantum Cryptography</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 30-day log retention</li>
            </ul>
          </CardContent>
          <CardFooter>
            {plan === "Pro" ? (
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled>
                Active Plan
              </Button>
            ) : (
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing via Razorpay..." : "Upgrade to Pro"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="border-white/10 opacity-80 hover:opacity-100 transition-opacity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Enterprise <Shield className="w-4 h-4" /></CardTitle>
            <div className="text-3xl font-bold mt-2 text-white">Custom</div>
            <CardDescription className="mt-2">Mission-critical security deployments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Unlimited Sidecars</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Custom Rulesets & ML Models</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Dedicated Support SLA</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> 1-year log retention</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-white text-black hover:bg-zinc-200">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="border-white/10 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle>Compute Credits</CardTitle>
                <CardDescription>Credits are consumed by advanced data inspection features.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-black rounded-lg border border-white/5">
              <div>
                <div className="text-sm text-zinc-500 mb-1">Available Credits</div>
                <div className="text-4xl font-bold text-white">{credits}</div>
              </div>
              <Button variant="outline" className="border-white/20 hover:bg-white/10">
                <CreditCard className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
