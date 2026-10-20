// One registry for fragment aliases, direct URLs and generated GitHub Pages entries.
export const routeAliases = Object.freeze({
  home: ['home', 'inicio', 'in', 'i', 'h'],
  projects: ['projects', 'project', 'proyectos', 'proyecto', 'trabajos', 'proy', 'py'],
  services: ['services', 'service', 'servicios', 'servicio', 'gestion-de-tiendas', 'tiendas', 'sv', 's'],
  about: ['about', 'about-me', 'sobre-mi', 'sobremi', 'acerca-de-mi', 'perfil', 'profile', 'sm', 'a'],
  contact: ['contact', 'contacts', 'contacto', 'contactos', 'contactame', 'contactarme', 'ct', 'c'],
  emprendimientos: ['emprendimientos', 'emprendimiento', 'mis-emprendimientos', 'ventures', 'venture', 'emp', 'e'],
  precios: ['precios', 'precio', 'prices', 'price', 'pricing', 'tarifas', 'tarifa', 'presupuesto', 'presupuestos', 'cotizacion', 'cotizador', 'pr', 'p'],
});
for (const aliases of Object.values(routeAliases)) Object.freeze(aliases);

const aliases = new Map();
for (const [route, names] of Object.entries(routeAliases)) {
  for (const name of names) {
    if (aliases.has(name)) throw new Error('Duplicate route alias: ' + name);
    aliases.set(name, route);
  }
}

export const projectPrefixes = Object.freeze(['project', 'projects', 'proyecto', 'proyectos', 'p', 'proy', 'py']);

export function normalizeRoute(route) {
  if (typeof route !== 'string') return '';
  const raw = route.trim().replace(/^#/, '').replace(/^\/+|\/+$/g, '');
  if (!raw) return '';
  let parts;
  try {
    parts = raw.split('/').map(part => decodeURIComponent(part).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
  } catch {
    return raw;
  }
  // Decode once and keep malformed/unknown routes in the normal 404 flow.
  if (parts.some(part => !part || /[\\/\s?#\u0000-\u001f]/.test(part))) return raw;
  if (parts.length === 1) return aliases.get(parts[0]) || parts[0];
  if (parts.length === 2) {
    if (aliases.get(parts[0]) === 'services' && aliases.get(parts[1]) === 'precios') return 'precios';
    if (projectPrefixes.includes(parts[0])) return 'project/' + parts[1];
    if (parts[0] === 'error' || parts[0] === 'errores') return 'error/' + parts[1];
  }
  return parts.join('/');
}

export function routeFromLocation(location, base = '/') {
  const fragment = (location.hash || '').slice(1);
  if (fragment) return normalizeRoute(fragment) || 'home';
  const pathname = location.pathname || '/';
  if (pathname === base || pathname === base.replace(/\/$/, '')) return 'home';
  if (!pathname.startsWith(base)) return 'not-found';
  return normalizeRoute(pathname.slice(base.length)) || 'home';
}

export function staticRoutePaths(projectSlugs = []) {
  const paths = new Map();
  for (const [route, names] of Object.entries(routeAliases)) for (const name of names) paths.set(name, route);
  // The short /p/ alias means pricing; /p/<slug>/ remains a project route.
  paths.set('p', 'precios');
  for (const service of routeAliases.services) {
    for (const price of routeAliases.precios) paths.set(service + '/' + price, 'precios');
  }
  for (const slug of projectSlugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Unsafe project route: ' + slug);
    for (const prefix of projectPrefixes) paths.set(prefix + '/' + slug, 'project/' + slug);
  }
  for (const code of [403, 404, 500, 503]) {
    for (const prefix of ['error', 'errores']) paths.set(prefix + '/' + code, 'error/' + code);
  }
  return paths;
}
