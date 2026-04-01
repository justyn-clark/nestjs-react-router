import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import {
  type StaticHandlerContext,
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router';
import { routes } from './routes.js';

export function createHandler() {
  const handler = createStaticHandler(routes);
  return handler;
}

export async function resolveContext(request: Request) {
  const handler = createHandler();
  const context = await handler.query(request);
  return { handler, context };
}

export function createRouter(
  handler: ReturnType<typeof createStaticHandler>,
  context: StaticHandlerContext
) {
  return createStaticRouter(handler.dataRoutes, context);
}

function getCssFiles(): string[] {
  try {
    const manifestPath = join(process.cwd(), '../web/dist/client/.vite/manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<
      string,
      { css?: string[] } | undefined
    >;
    const entry = manifest['src/entry-client.tsx'];
    return entry?.css || [];
  } catch {
    try {
      const assetsPath = join(process.cwd(), '../web/dist/client/assets');
      const files = readdirSync(assetsPath);
      const cssFile = files.find(
        (file) => file.startsWith('entry-client-') && file.endsWith('.css')
      );
      return cssFile ? [`assets/${cssFile}`] : [];
    } catch {
      return [];
    }
  }
}

export function pipeToNodeWritable(
  replyRaw: NodeJS.WritableStream,
  router: ReturnType<typeof createStaticRouter>,
  context: StaticHandlerContext,
  nonce?: string
) {
  const cssFiles = getCssFiles();
  const cssLinks = cssFiles
    .map((cssFile) => `<link rel="stylesheet" href="/static/${cssFile}">`)
    .join('');

  const html = renderToString(
    <StaticRouterProvider router={router} context={context} nonce={nonce} />
  );

  const clientScript = `<script ${nonce ? `nonce="${nonce}" ` : ''}type="module" src="/static/entry-client.js"></script>`;

  const document = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>RR7 + Nest</title>
      ${cssLinks}
    </head>
    <body>
      <div id="root">${html}</div>
      ${clientScript}
    </body>
    </html>`;

  replyRaw.write(document);
  replyRaw.end();
}
