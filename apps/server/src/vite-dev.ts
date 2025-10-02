import { createServer as createViteServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { join } from 'path';

let vite: ViteDevServer | undefined;

export async function createViteDevServer() {
  if (vite) return vite;

  try {
    vite = await createViteServer({
      root: join(process.cwd(), '../web'),
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    });

    return vite;
  } catch (error) {
    console.error('Failed to create Vite dev server:', error);
    throw error;
  }
}

export async function closeViteDevServer() {
  if (vite) {
    await vite.close();
    vite = undefined;
  }
}
