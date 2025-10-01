import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';
import * as React from 'react';
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

export function pipeToNodeWritable(
  replyRaw: NodeJS.WritableStream,
  router: any,
  context: any,
  nonce?: string
) {
  const open = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>RR7 + Nest</title><link rel="stylesheet" href="/static/assets/entry-client-DhZV6wrq.css"></head><body><div id="root">`;
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
