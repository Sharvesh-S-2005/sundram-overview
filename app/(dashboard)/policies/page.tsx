"use client";

import { useState } from "react";
import { usePolicyStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "network", label: "Network Policies" },
  { id: "ratelimit", label: "Rate Limiting" },
  { id: "threat", label: "Threat Detection" },
  { id: "payload", label: "Payload Inspection" },
  { id: "crypto", label: "Crypto & PQC" },
  { id: "identity", label: "Identity & Access" },
  { id: "service", label: "Service Comm" },
  { id: "behavior", label: "Behavior & Reputation" },
  { id: "mode", label: "Policy Mode" },
  { id: "observability", label: "Observability" },
  { id: "connection", label: "Connection Protection" },
  { id: "sidecar", label: "Sidecar Security" },
];

export default function PoliciesPage() {
  const { settings, updateSettings } = usePolicyStore();
  const [activeTab, setActiveTab] = useState("network");
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleToggle = (category: string, key: string) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [key]: !prev[category][key] }
    }));
  };

  const handleChange = (category: string, key: string, value: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col relative overflow-hidden">
      {showToast && (
        <div className="absolute top-4 right-8 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-2 bg-white text-black px-4 py-3 rounded-lg shadow-xl border border-white/20">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600" />
          </div>
          <span className="font-medium text-sm">Policies updated successfully</span>
        </div>
      )}

      <div className="p-8 pb-4 shrink-0">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8" />
          Zero Trust Policies
        </h2>
        <p className="text-zinc-400 mt-2">Configure distributed enforcement rules across all sidecars.</p>
      </div>

      <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 shrink-0 overflow-y-auto space-y-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id 
                  ? "bg-white text-black shadow-sm" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide pb-20">
          
          {/* A · Network Policies */}
          {activeTab === "network" && (
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Network Policies</CardTitle>
                <CardDescription>Control IP and geographic access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>IP Allow List (Comma separated)</Label>
                  <Input 
                    value={localSettings.network.allowList} 
                    onChange={(e) => handleChange("network", "allowList", e.target.value)} 
                    placeholder="192.168.1.1, 10.0.0.0/24" 
                    className="bg-zinc-900 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IP Deny List</Label>
                  <Input 
                    value={localSettings.network.denyList} 
                    onChange={(e) => handleChange("network", "denyList", e.target.value)} 
                    placeholder="203.0.113.0/24" 
                    className="bg-zinc-900 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Geo Blocking</Label>
                  <Input 
                    placeholder="e.g. RU, CN, KP" 
                    className="bg-zinc-900 border-white/10"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* B · Rate Limiting */}
          {activeTab === "ratelimit" && (
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Rate Limiting (Enhanced)</CardTitle>
                <CardDescription>Protect services from volumetric attacks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <Label className="text-white">Enable Rate Limiting</Label>
                    <p className="text-sm text-zinc-400">Globally enable or disable rate limiting across sidecars.</p>
                  </div>
                  <Switch checked={localSettings.rateLimit.enabled} onChange={() => handleToggle("rateLimit", "enabled")} />
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between">
                    <Label>Requests per Second</Label>
                    <span className="text-sm text-zinc-400">{localSettings.rateLimit.rps}</span>
                  </div>
                  <input type="range" min="10" max="10000" value={localSettings.rateLimit.rps} onChange={(e) => handleChange("rateLimit", "rps", parseInt(e.target.value))} className="w-full accent-white" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Burst Size</Label>
                    <span className="text-sm text-zinc-400">{localSettings.rateLimit.burst}</span>
                  </div>
                  <input type="range" min="10" max="20000" value={localSettings.rateLimit.burst} onChange={(e) => handleChange("rateLimit", "burst", parseInt(e.target.value))} className="w-full accent-white" />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Per-IP Enforcement (vs Global)</Label>
                  <Switch checked={localSettings.rateLimit.perIp} onChange={() => handleToggle("rateLimit", "perIp")} />
                </div>

                <div className="space-y-2">
                  <Label>Retry-After Behavior</Label>
                  <select 
                    value={localSettings.rateLimit.retryAfter}
                    onChange={(e) => handleChange("rateLimit", "retryAfter", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-white"
                  >
                    <option value="drop">Drop Silently</option>
                    <option value="429">Return 429 Too Many Requests</option>
                    <option value="tarpit">Tarpit (Delay Response)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* C · Threat Detection */}
          {activeTab === "threat" && (
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Threat Detection</CardTitle>
                <CardDescription>Configure WAF rules and automated responses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <div className="flex items-center justify-between">
                    <Label>SQL Injection Protection</Label>
                    <Switch checked={localSettings.threat.sqlInjection} onChange={() => handleToggle("threat", "sqlInjection")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Cross-Site Scripting (XSS)</Label>
                    <Switch checked={localSettings.threat.xss} onChange={() => handleToggle("threat", "xss")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Advanced Bot Protection</Label>
                    <Switch checked={localSettings.threat.bot} onChange={() => handleToggle("threat", "bot")} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>WAF Sensitivity</Label>
                    <select value={localSettings.threat.sensitivity} onChange={(e) => handleChange("threat", "sensitivity", e.target.value)} className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-white">
                      <option value="low">Low (Fewer False Positives)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Maximum Security)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-destructive">Action on Threat</Label>
                    <select value={localSettings.threat.action} onChange={(e) => handleChange("threat", "action", e.target.value)} className="flex h-9 w-full rounded-md border border-destructive/50 bg-destructive/10 px-3 py-1 text-sm text-white">
                      <option value="log">Monitor / Log Only</option>
                      <option value="block">Block Request</option>
                      <option value="rate">Rate Limit IP</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label>Auto-ban Malicious IPs</Label>
                    <Switch checked={localSettings.threat.autoBan} onChange={() => handleToggle("threat", "autoBan")} />
                  </div>
                  
                  {localSettings.threat.autoBan && (
                    <div className="space-y-2 pl-4 border-l-2 border-white/10">
                      <Label>Ban Duration</Label>
                      <select value={localSettings.threat.banDuration} onChange={(e) => handleChange("threat", "banDuration", e.target.value)} className="flex h-9 w-full max-w-[200px] rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-white">
                        <option value="1m">1 Minute</option>
                        <option value="5m">5 Minutes</option>
                        <option value="1h">1 Hour</option>
                        <option value="24h">24 Hours</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* E · Crypto / PQC */}
          {activeTab === "crypto" && (
            <Card className="border-purple-500/20 bg-zinc-950/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
              <CardHeader>
                <CardTitle className="text-purple-400">Cryptography & PQC</CardTitle>
                <CardDescription>Configure encryption standards and Post-Quantum cryptography.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* PQC Visualizer */}
                <div className="w-full p-6 bg-black/50 border border-white/5 rounded-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-8 gap-8">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 to-transparent opacity-80" />
                  
                  {/* Classical RSA */}
                  <div className="flex-1 flex flex-col items-center gap-4 relative z-10 w-full">
                    <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">Classical (RSA-2048)</div>
                    <div className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-red-500/10 opacity-50" />
                      <div className="absolute left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(239,68,68,0.2),transparent)] animate-[shimmer_2s_infinite]" />
                      <span className="font-mono text-xs text-zinc-500 line-through">4f8a9...b2c1</span>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 gap-1 mt-2">
                      <ShieldAlert className="w-3 h-3" /> Quantum Vulnerable
                    </Badge>
                  </div>

                  <div className="hidden md:flex flex-col items-center justify-center relative z-10 px-4">
                    <div className="h-full w-px bg-white/10 absolute top-0 bottom-0" />
                    <div className="bg-black px-2 py-1 border border-white/10 rounded-full z-10">
                      <Activity className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>

                  {/* Kyber-768 PQC */}
                  <div className="flex-1 flex flex-col items-center gap-4 relative z-10 w-full">
                    <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-2 flex items-center gap-2">
                      SUN-DRAM PQC
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    </div>
                    <div className="w-full h-12 bg-purple-950/30 border border-purple-500/50 rounded-lg flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                      <div className="absolute left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)] animate-[shimmer_1.5s_infinite]" />
                      <span className="font-mono text-xs text-purple-300 tracking-widest mix-blend-screen relative z-10">
                        KYBER-768::LOCKED
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 mt-2 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      <ShieldCheck className="w-3 h-3" /> Quantum Resistant
                    </Badge>
                  </div>
                  
                  <style jsx>{`
                    @keyframes shimmer {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                  `}</style>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <Label className="text-purple-400">Enable Post-Quantum Cryptography (Kyber-768)</Label>
                    <p className="text-sm text-zinc-400">Protect traffic against store-now-decrypt-later attacks.</p>
                  </div>
                  <Switch checked={localSettings.crypto.pqcEnabled} onChange={() => handleToggle("crypto", "pqcEnabled")} />
                </div>
                <div className="space-y-2 pt-2">
                  <Label>Data Encryption Standard</Label>
                  <select value={localSettings.crypto.encryption} onChange={(e) => handleChange("crypto", "encryption", e.target.value)} className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-white">
                    <option value="AES-GCM">AES-256-GCM</option>
                    <option value="ChaCha20">ChaCha20-Poly1305</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* F · Identity & Access Control */}
          {activeTab === "identity" && (
            <Card className="border-emerald-500/20 bg-zinc-950/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <CardHeader>
                <CardTitle className="text-emerald-400">Identity & Access Control</CardTitle>
                <CardDescription>Enforce Zero Trust identity boundaries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Require Authentication</Label>
                    <Switch checked={localSettings.identity.requireAuth} onChange={() => handleToggle("identity", "requireAuth")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>JWT Validation at Edge</Label>
                    <Switch checked={localSettings.identity.jwtValidation} onChange={() => handleToggle("identity", "jwtValidation")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Token Expiry Enforcement</Label>
                    <Switch checked={localSettings.identity.tokenExpiry} onChange={() => handleToggle("identity", "tokenExpiry")} />
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <Label>Allowed Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {["admin", "service", "internal", "customer", "viewer"].map(role => (
                      <label key={role} className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-md border border-white/10 cursor-pointer hover:bg-white/5">
                        <input 
                          type="checkbox" 
                          checked={localSettings.identity.allowedRoles.includes(role)}
                          onChange={(e) => {
                            const newRoles = e.target.checked 
                              ? [...localSettings.identity.allowedRoles, role]
                              : localSettings.identity.allowedRoles.filter((r: string) => r !== role);
                            handleChange("identity", "allowedRoles", newRoles);
                          }}
                          className="accent-white" 
                        />
                        <span className="text-sm font-mono text-zinc-300">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* G · Service Communication */}
          {activeTab === "service" && (
            <Card className="border-emerald-500/20 bg-zinc-950/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <CardHeader>
                <CardTitle className="text-emerald-400">Service Communication</CardTitle>
                <CardDescription>Micro-segmentation and service mesh policies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Interactive Architecture SVG Visualizer */}
                <div className="w-full py-8 bg-black/50 border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 to-transparent opacity-80" />
                  
                  <div className="flex items-center gap-12 sm:gap-24 relative z-10 w-full max-w-2xl px-8">
                    {/* Frontend Node */}
                    <div className="flex flex-col items-center gap-2 z-10">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center relative">
                        <div className="absolute -inset-1 border border-emerald-500/20 rounded-2xl animate-ping" style={{ animationDuration: '3s' }} />
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="text-xs font-mono text-zinc-300">Frontend</span>
                    </div>

                    {/* mTLS Line */}
                    <div className="flex-1 h-px bg-emerald-500/30 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 rounded-full">mTLS</div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(52,211,153,1)]" style={{ left: '0%', animation: 'slideRight 2s linear infinite' }} />
                    </div>

                    {/* API Node */}
                    <div className="flex flex-col items-center gap-2 z-10">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center relative">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      </div>
                      <span className="text-xs font-mono text-zinc-300">API Gateway</span>
                    </div>

                    {/* Denied Line */}
                    <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-destructive/30 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-2 py-0.5 text-[10px] font-mono text-destructive border border-destructive/30 rounded-full z-10">DENY</div>
                      <div className="w-1 h-1 rounded-full bg-destructive absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(239,68,68,1)]" style={{ left: '60%' }} />
                    </div>

                    {/* Database Node */}
                    <div className="flex flex-col items-center gap-2 z-10 opacity-50">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">Database</span>
                    </div>
                  </div>
                  
                  <style jsx>{`
                    @keyframes slideRight {
                      0% { left: 0%; opacity: 0; }
                      10% { opacity: 1; }
                      90% { opacity: 1; }
                      100% { left: 100%; opacity: 0; }
                    }
                  `}</style>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <Label>Deny Unknown Services</Label>
                    <p className="text-sm text-zinc-400">Block traffic from services not explicitly allowed.</p>
                  </div>
                  <Switch checked={localSettings.service.denyUnknown} onChange={() => handleToggle("service", "denyUnknown")} />
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <Label>Enforce Service Identity Header</Label>
                  <Switch checked={localSettings.service.enforceIdentity} onChange={() => handleToggle("service", "enforceIdentity")} />
                </div>
                <div className="space-y-2">
                  <Label>Allowed Service Paths</Label>
                  <textarea 
                    className="w-full bg-zinc-900 border border-white/10 rounded-md p-3 text-sm font-mono text-zinc-300 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="frontend -> backend&#10;api -> db"
                    defaultValue={"frontend -> backend\napi -> db\nauth-service -> cache"}
                  />
                  <p className="text-xs text-zinc-500">Define mTLS allowed communication paths.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* I · Policy Mode */}
          {activeTab === "mode" && (
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Deployment Mode</CardTitle>
                <CardDescription>Control how policies are applied globally.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                  localSettings.mode.type === "monitor" ? "border-white bg-white/5" : "border-white/10 bg-zinc-900/50"
                )}>
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={localSettings.mode.type === "monitor"} 
                    onChange={() => handleChange("mode", "type", "monitor")}
                    className="mt-1 accent-white" 
                  />
                  <div>
                    <h4 className="font-medium text-white">Monitor Mode</h4>
                    <p className="text-sm text-zinc-400">Policies are evaluated and logged, but no traffic is blocked. Use this for testing.</p>
                  </div>
                </label>
                
                <label className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                  localSettings.mode.type === "enforce" ? "border-destructive bg-destructive/10" : "border-white/10 bg-zinc-900/50"
                )}>
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={localSettings.mode.type === "enforce"} 
                    onChange={() => handleChange("mode", "type", "enforce")}
                    className="mt-1 accent-destructive" 
                  />
                  <div>
                    <h4 className="font-medium text-destructive">Enforce Mode</h4>
                    <p className="text-sm text-zinc-400">Policies are strictly enforced. Unauthorized traffic will be blocked.</p>
                  </div>
                </label>
              </CardContent>
            </Card>
          )}

          {/* J · Observability */}
          {activeTab === "observability" && (
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Observability Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Enable Telemetry</Label>
                  <Switch checked={localSettings.observability.telemetry} onChange={() => handleToggle("observability", "telemetry")} />
                </div>
                <div className="space-y-2">
                  <Label>Log Level</Label>
                  <select value={localSettings.observability.logLevel} onChange={(e) => handleChange("observability", "logLevel", e.target.value)} className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-white">
                    <option value="minimal">Minimal (Errors Only)</option>
                    <option value="standard">Standard (Warnings & Errors)</option>
                    <option value="verbose">Verbose (All Requests)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Data Retention</Label>
                  <select value={localSettings.observability.retention} onChange={(e) => handleChange("observability", "retention", e.target.value)} className="flex h-9 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-white">
                    <option value="7 days">7 Days</option>
                    <option value="30 days">30 Days</option>
                    <option value="90 days">90 Days</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback for empty tabs */}
          {["payload", "behavior", "connection", "sidecar"].includes(activeTab) && (
            <Card className="border-white/10 border-dashed bg-transparent">
              <CardContent className="p-12 text-center text-zinc-500">
                Advanced {TABS.find(t => t.id === activeTab)?.label} settings are available via the API or CLI configuration.
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Sticky Bottom Footer for Save Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-zinc-950/80 backdrop-blur-md flex justify-end px-8 z-10">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-white text-black hover:bg-zinc-200 min-w-[150px] font-medium"
        >
          {isSaving ? "Applying Rules..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}
