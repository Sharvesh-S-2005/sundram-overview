import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  role: string | null;
  user: string | null;
  token: string | null;
  login: (email: string, role: string, token: string) => void;
  logout: () => void;
}

export interface Sidecar {
  id: string;
  name: string;
  description: string;
  region: string;
  env: string;
  deploymentType: string;
  status: 'active' | 'inactive';
  lastSeen: string;
  health: 'healthy' | 'degraded' | 'offline';
}

export interface SidecarState {
  sidecars: Sidecar[];
  addSidecar: (sidecar: Sidecar) => void;
  toggleStatus: (id: string) => void;
  deleteSidecar: (id: string) => void;
}

export interface PolicyState {
  settings: any;
  updateSettings: (newSettings: any) => void;
}

export interface BillingState {
  plan: string;
  credits: number;
  upgrade: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      token: null,
      login: (email, role, token) => set({ user: email, role, token }),
      logout: () => set({ user: null, role: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useSidecarStore = create<SidecarState>()(
  persist(
    (set) => ({
      sidecars: [],
      addSidecar: (sidecar) =>
        set((state) => ({ sidecars: [...state.sidecars, sidecar] })),
      toggleStatus: (id) =>
        set((state) => ({
          sidecars: state.sidecars.map((s) =>
            s.id === id
              ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
              : s
          ),
        })),
      deleteSidecar: (id) =>
        set((state) => ({
          sidecars: state.sidecars.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'sidecar-storage',
    }
  )
);

export const usePolicyStore = create<PolicyState>()(
  persist(
    (set) => ({
      settings: {
        network: { allowList: "", denyList: "", geoBlocking: [] },
        rateLimit: { enabled: true, rps: 100, burst: 200, perIp: true, retryAfter: "drop" },
        threat: { sqlInjection: true, xss: true, bot: true, sensitivity: "high", action: "block", autoBan: true, banDuration: "5m" },
        payload: { enabled: true, maxSize: "1MB", sensitiveData: true },
        crypto: { pqcEnabled: true, encryption: "AES-GCM" },
        identity: { requireAuth: true, jwtValidation: true, tokenExpiry: true, allowedRoles: ["admin", "service"] },
        service: { allowedServices: ["frontend->backend"], denyUnknown: true, enforceIdentity: true },
        behavior: { enabled: true, riskThreshold: 80, autoBlock: true },
        mode: { type: "enforce" },
        observability: { telemetry: true, logLevel: "standard", retention: "30 days" },
        connection: { maxConcurrent: 1000, perIpLimit: 50, dropSlow: true },
        sidecar: { tokenRotation: true, sessionExpiry: 24, forceReauth: false },
      },
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: 'policy-storage',
    }
  )
);

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      plan: "Basic",
      credits: 0,
      upgrade: () => set({ plan: "Pro", credits: 10 }),
    }),
    {
      name: 'billing-storage',
    }
  )
);
