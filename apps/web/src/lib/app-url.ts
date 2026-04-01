function getRequestOrigin(request: Request) {
  return new URL(request.url).origin;
}

export function getAppOrigin(request: Request) {
  if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
    return getRequestOrigin(request);
  }

  if (typeof process !== 'undefined' && process.env.APP_INTERNAL_ORIGIN) {
    return process.env.APP_INTERNAL_ORIGIN;
  }

  if (typeof process !== 'undefined' && process.env.PORT) {
    const url = new URL(request.url);
    return `${url.protocol}//127.0.0.1:${process.env.PORT}`;
  }

  return getRequestOrigin(request);
}

export function appUrl(pathname: string, request: Request) {
  return new URL(pathname, `${getAppOrigin(request)}/`).toString();
}
