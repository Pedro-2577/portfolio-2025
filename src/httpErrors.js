export const HTTP_ERROR_CODES = Object.freeze([403, 404, 500, 503]);

const publicRoutes = new Set(['home', 'projects', 'services', 'about', 'contact', 'precios', 'emprendimientos']);

export function resolveRouteStatus(route, projectSlugs = []) {
  route = normalizeRoute(route);
  if (publicRoutes.has(route)) return null;
  const parts = route.split('/').filter(Boolean);
  if (parts.length !== 2) return 404;
  if (parts[0] === 'project' && projectSlugs.includes(parts[1])) return null;
  if (parts[0] === 'error' && HTTP_ERROR_CODES.includes(Number(parts[1])) && String(Number(parts[1])) === parts[1]) return Number(parts[1]);
  return 404;
}

import { normalizeRoute } from './routes.js';

