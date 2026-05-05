import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config } from 'dotenv';

export interface LoadEnvOptions {
  cwd?: string;
  path?: string;
}

let loadedPath: string | undefined;
let hasLoaded = false;

function isWorkspaceBoundary(dir: string) {
  return (
    existsSync(join(dir, 'pnpm-workspace.yaml')) ||
    existsSync(join(dir, 'turbo.json')) ||
    existsSync(join(dir, '.git'))
  );
}

function findEnvFile(startDir: string) {
  let dir = startDir;

  while (true) {
    const envPath = join(dir, '.env');

    if (existsSync(envPath)) {
      return envPath;
    }

    if (isWorkspaceBoundary(dir)) {
      return undefined;
    }

    const parent = dirname(dir);

    if (parent === dir) {
      return undefined;
    }

    dir = parent;
  }
}

export function loadEnv(options: LoadEnvOptions = {}) {
  if (hasLoaded) {
    return loadedPath;
  }

  hasLoaded = true;

  const explicitPath = options.path || process.env.DOTENV_CONFIG_PATH;

  if (explicitPath) {
    config({ path: explicitPath, quiet: true });
    loadedPath = explicitPath;
    return loadedPath;
  }

  const envPath = findEnvFile(options.cwd || process.cwd());

  if (envPath) {
    config({ path: envPath, quiet: true });
    loadedPath = envPath;
  }

  return loadedPath;
}
