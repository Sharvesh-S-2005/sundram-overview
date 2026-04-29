"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

const MOCK_AUDIT = [
  { id: 1, timestamp: "Just now", actor: "admin@enterprise.com", action: "Policy Updated", details: "Changed 'Threat Detection Sensitivity' from Medium to High" },
  { id: 2, timestamp: "2 hours ago", actor: "admin@enterprise.com", action: "Sidecar Created", details: "Created sidecar 'sc_8fj39k1l' for 'Swiggy Payment Gateway' in ap-south-1" },
  { id: 3, timestamp: "3 hours ago", actor: "system", action: "Rule Enforced", local: false, details: "Auto-banned IP 89.112.44.1 for 1 hour due to sustained bot activity" },
  { id: 4, timestamp: "1 day ago", actor: "devops@enterprise.com", action: "Login Success", details: "Authenticated via SSO (Okta)" },
  { id: 5, timestamp: "2 days ago", actor: "admin@enterprise.com", action: "Policy Updated", details: "Enabled PQC (Kyber-768) encryption for sidecar-to-sidecar communication" },
];

export default function AuditLogsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Audit Logs</h2>
        <p className="text-zinc-400 mt-2">Immutable record of all configuration changes and system access.</p>
      </div>

      <div className="bg-zinc-950/50 rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AUDIT.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-zinc-400 text-sm whitespace-nowrap">{log.timestamp}</TableCell>
                <TableCell className="font-medium text-white">{log.actor}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-zinc-300 border border-white/10 whitespace-nowrap">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
