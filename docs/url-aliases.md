# Direcciones del portfolio

Las direcciones directas y los fragmentos (`#`) usan el mismo registro de alias en `src/routes.js`. El idioma visual conserva la preferencia del visitante: escribir una ruta en español no cambia el idioma seleccionado.

| Vista | Direcciones aceptadas (sin la barra inicial) |
| --- | --- |
| Inicio | `home`, `inicio`, `in`, `i`, `h` |
| Proyectos | `projects`, `project`, `proyectos`, `proyecto`, `trabajos`, `p`, `proy`, `py` |
| Gestión de tiendas | `services`, `service`, `servicios`, `servicio`, `gestion-de-tiendas`, `tiendas`, `sv`, `s` |
| Sobre mí | `about`, `about-me`, `sobre-mi`, `sobremi`, `acerca-de-mi`, `perfil`, `profile`, `sm`, `a` |
| Contacto | `contact`, `contacts`, `contacto`, `contactos`, `contactame`, `contactarme`, `ct`, `c` |
| Emprendimientos | `emprendimientos`, `emprendimiento`, `mis-emprendimientos`, `ventures`, `venture`, `emp`, `e` |
| Precios | `precios`, `precio`, `prices`, `price`, `pricing`, `tarifas`, `tarifa`, `presupuesto`, `presupuestos`, `cotizacion`, `cotizador`, `pr` |

Ejemplos: `/servicios/`, `/s`, `/#servicio`, `/sobre-mi`, `/proyectos/vendoalgo/` y `/#proyecto/vendoalgo`.

Los detalles de proyectos aceptan los prefijos `project`, `projects`, `proyecto`, `proyectos`, `p`, `proy` y `py`, seguidos del identificador existente del proyecto. Los nombres de proyectos no se traducen ni se inventan: un identificador desconocido sigue mostrando 404.

Cualquier alias de servicios seguido de cualquier alias de precios abre la vista de precios: `/servicios/precios`, `/s/tarifas`, `/#services/pricing`.

Las muestras de errores conservan `error/403`, `error/404`, `error/500`, `error/503`, y también aceptan `errores` como prefijo.

En GitHub Pages cada dirección directa tiene su propio `index.html`, generado durante el build. Así los alias conocidos cargan con HTTP 200, con recursos relativos al directorio base correcto, y los enlaces desconocidos conservan la página 404. No se requieren reglas de servidor ni scripts inline. Pages puede agregar una barra final a la dirección al servir el directorio.

Para agregar una vista o alias, actualizar el registro compartido y sus pruebas; no duplicar listas en el componente de Vue ni en la generación de páginas.
