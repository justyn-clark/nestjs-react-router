import * as React from 'react';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { routes } from './routes';

export function createHandler() {
  const handler = createStaticHandler(routes);
  return handler;
}

export async function resolveContext(request: Request) {
  const handler = createHandler();
  const context = await handler.query(request);
  return { handler, context };
}

export function createRouter(handler: any, context: any) {
  return createStaticRouter(handler.dataRoutes, context);
}

function getCssFiles(): string[] {
  try {
    const manifestPath = join(process.cwd(), '../web/dist/client/.vite/manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const entry = manifest['src/entry-client.tsx'];
    return entry?.css || [];
  } catch (error) {
    try {
      const assetsPath = join(process.cwd(), '../web/dist/client/assets');
      const files = readdirSync(assetsPath);
      const cssFile = files.find((file: string) => file.startsWith('entry-client-') && file.endsWith('.css'));
      return cssFile ? [`assets/${cssFile}`] : [];
    } catch (fallbackError) {
      return [];
    }
  }
}

export function pipeToNodeWritable(
  replyRaw: NodeJS.WritableStream,
  router: any,
  context: any,
  nonce?: string
) {

  const cssFiles = getCssFiles();
  const cssLinks = cssFiles.map(cssFile =>
    `<link rel="stylesheet" href="/static/${cssFile}">`
  ).join('');

  const open = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>RR7 + Nest</title>${cssLinks}</head><body><div id="root">`;
  const hydrationData = JSON.stringify(context);
  const close = `</div><script>window.__staticRouterHydrationData = JSON.parse(${JSON.stringify(hydrationData)});</script><script ${nonce ? `nonce="${nonce}"` : ''} type="module" src="/static/entry-client.js"></script></body></html>`;
  replyRaw.write(open);
  const { pipe } = renderToPipeableStream(
    <StaticRouterProvider router={router} context={context} />,
    {
      onAllReady() {
        pipe(replyRaw);
        replyRaw.write(close);
      },
      onError(err) {
        console.error(err);
      },
    }
  );
}
