import React from 'react';
import type { RouteObject } from 'react-router';

export interface RouteModule {
  id?: string;
  path?: string;
  loader?: RouteObject['loader'];
  action?: RouteObject['action'];
  Component?: RouteObject['Component'];
  ErrorBoundary?: React.ComponentType;
}

export type AppRouteConfig = RouteObject[];

function getErrorElement(module: RouteModule) {
  return module.ErrorBoundary ? React.createElement(module.ErrorBoundary) : undefined;
}

export function layout(module: RouteModule, children: RouteObject[]): RouteObject {
  return {
    id: module.id,
    path: module.path,
    loader: module.loader,
    action: module.action,
    Component: module.Component,
    errorElement: getErrorElement(module),
    children,
  };
}

export function route(path: string, module: RouteModule): RouteObject {
  return {
    id: module.id,
    path,
    loader: module.loader,
    action: module.action,
    Component: module.Component,
    errorElement: getErrorElement(module),
  };
}

export function index(module: RouteModule): RouteObject {
  return {
    id: module.id,
    index: true,
    loader: module.loader,
    action: module.action,
    Component: module.Component,
    errorElement: getErrorElement(module),
  };
}
