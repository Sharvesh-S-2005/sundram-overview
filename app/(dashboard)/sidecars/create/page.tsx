"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSidecarStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Terminal, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function CreateSidecarPage() {
  const router = useRouter();
  const addSidecar = useSidecarStore((state) => state.addSidecar);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdData, setCreatedData] = useState<{ id: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Simulate API delay
    setTimeout(() => {
      const newId = `sc_${Math.random().toString(36).substring(2, 10)}`;
      const newToken = `tok_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      
      addSidecar({
        id: newId,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        region: formData.get("region") as string,
        env: formData.get("env") as string,
        deploymentType: formData.get("type") as string,
        status: "active",
        lastSeen: "Just now",
        health: "healthy",
      });

      setCreatedData({ id: newId, token: newToken });
      setIsSubmitting(false);
    }, 800);
  };

  const dockerCommand = createdData 
    ? `docker run -d --name sundram-sidecar \\
  -e SIDECAR_ID=${createdData.id} \\
  -e TOKEN=${createdData.token} \\
  -p 8080:8080 \\
  sundram/sidecar:latest`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/sidecars">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Sidecar</h2>
          <p className="text-zinc-400 mt-1">Deploy a new Zero Trust enforcement node.</p>
        </div>
      </div>

      {!createdData ? (
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>Configuration Details</CardTitle>
            <CardDescription>Enter the details for your new sidecar deployment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">App Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. Swiggy Payment Gateway" className="bg-zinc-900 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="env">Environment</Label>
                  <select 
                    id="env" 
                    name="env" 
                    className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <select 
                    id="region" 
                    name="region" 
                    className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white"
                  >
                    <option value="ap-south-1">ap-south-1 (Mumbai)</option>
                    <option value="us-east-1">us-east-1 (N. Virginia)</option>
                    <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Deployment Type</Label>
                  <select 
                    id="type" 
                    name="type" 
                    className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white"
                  >
                    <option value="docker">Docker Container</option>
                    <option value="kubernetes">Kubernetes DaemonSet</option>
                    <option value="binary">Linux Binary</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" name="description" placeholder="Protects the checkout microservice" className="bg-zinc-900 border-white/10" />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} className="bg-white text-black hover:bg-zinc-200">
                  {isSubmitting ? "Generating..." : "Generate Bootstrap Token"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-500/30 bg-emerald-950/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-emerald-400">Sidecar Created Successfully</CardTitle>
                <CardDescription>Use the command below to deploy your enforcement node.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-black/40 border border-white/5">
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Sidecar ID</span>
                <span className="font-mono text-sm text-zinc-300">{createdData.id}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Bootstrap Token</span>
                <span className="font-mono text-sm text-zinc-300 truncate block">{createdData.token}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deployment Command</Label>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-black border border-white/10 overflow-x-auto text-sm font-mono text-zinc-300">
                  <code>{dockerCommand}</code>
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-3 right-3 h-8 bg-white/10 hover:bg-white/20 text-white border-0"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                Run this command on your target server. The sidecar will automatically connect to the SUN-DRAM control plane.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href="/sidecars">
                <Button className="bg-white text-black hover:bg-zinc-200">
                  View All Sidecars
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
