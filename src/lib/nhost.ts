import { NhostClient } from '@nhost/nhost-js';

if (!import.meta.env.VITE_NHOST_SUBDOMAIN) {
  throw new Error('VITE_NHOST_SUBDOMAIN environment variable is required');
}

if (!import.meta.env.VITE_NHOST_REGION) {
  throw new Error('VITE_NHOST_REGION environment variable is required');
}

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION
});