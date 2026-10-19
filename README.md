# Portfolio de Pedro Méndez Carabán

Portfolio público con Vue 3 y Vite: experiencia profesional, casos técnicos, proyectos, servicios y CV generado en español e inglés.

[Ver portfolio](https://pedro-2577.github.io/portfolio-2025/)

## Desarrollo

Requiere Node.js 22.12 o posterior. La CI usa Node 22.

```bash
npm ci
npm run dev
```

La versión publicada es una SPA estática con rutas por fragmento. No requiere PHP ni una base de datos. La fuente Laravel anterior se conserva como referencia; no forma parte del servidor de GitHub Pages.

## Comprobaciones

```bash
npm test
npm run check:source
npm run audit:dependencies
npm run build
npm run check:build
npx playwright install chromium
npm run test:e2e
```

Los tests de navegador necesitan primero el build. Playwright levanta automáticamente un servidor local de preview; no prueba ni modifica las tiendas reales.

- **Node test runner:** rutas y errores, integridad del catálogo y sus recursos, preferencias, estructura y contenido del PDF, exclusión de artefactos Laravel de la publicación.
- **Playwright / Chromium:** navegación, casos técnicos con teclado, filtros, idioma y tema, descargas reales ES/EN, rutas desconocidas, almacenamiento bloqueado y vista móvil. Los accesos externos se bloquean durante estos tests.
- **Artefacto:** revisión de las políticas HTML y de los archivos que van a publicarse.
- **Dependencias:** npm audit y actualizaciones semanales propuestas por Dependabot.

Los informes de navegador se guardan en playwright-report/ y test-results/, excluidos de Git. En CI se conservan siete días cuando falla una comprobación.

## Organización y decisiones

- src/App.vue coordina las rutas, idioma, tema y páginas.
- src/data.js contiene el catálogo y sus evidencias; src/profile.js es la fuente profesional del sitio y del CV.
- src/ProjectTechnicalCase.vue presenta los casos de VendoAlgo.
- src/resumePdf.js genera un PDF local sin enviar datos a un servidor.
- src/preferences.js admite únicamente preferencias conocidas y tolera almacenamiento inaccesible.
- src/storeServices.js y src/ServiceEstimator.vue contienen el recorrido de servicios.
- vite.config.js genera el 404 y configura la publicación; build/security.mjs aplica las políticas de producción y excluye los antiguos archivos públicos de Laravel.

Se mantienen las rutas por fragmento para funcionar en GitHub Pages sin reescrituras del servidor. El formulario de contacto abre el cliente de correo con el contenido codificado; el sitio no almacena ni envía consultas a un backend propio.

## CI y publicación

Los PR y las ramas codex ejecutan el mismo workflow de calidad que main. El despliegue sólo consume el artefacto después de superar tests, auditoría de dependencias, build, validación del artefacto y recorridos de navegador.

El build tiene permisos de lectura. Los permisos de Pages y OIDC están limitados al trabajo de despliegue. Una comprobación configurada en CI no implica por sí sola una regla de protección de ramas: esa configuración pertenece a la administración de GitHub.

## Seguridad y límites

Ver [alcance y controles de seguridad](docs/security-and-quality.md). La revisión es proporcional a una web estática y no constituye una garantía de ausencia de vulnerabilidades.

No se incluyen credenciales ni datos privados de VendoAlgo en los casos publicados. La seguridad del código privado de ese producto no queda validada por los tests de este repositorio.
