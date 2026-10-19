# Seguridad y calidad del portfolio estático

Fecha de revisión: 19 de octubre de 2026.
Alcance: código Vue/Vite, configuración del build, artefacto de GitHub Pages, dependencias npm y automatización de calidad. No incluye auditoría de VendoAlgo ni de sus integraciones privadas.

## Contexto y límites de confianza

El navegador recibe HTML, CSS, JavaScript, imágenes y fuentes. src/main.js monta Vue y configura una pantalla de recuperación para errores de componentes.

Entradas: fragmento de URL, preferencias locales, búsqueda y filtros, formulario de contacto y selecciones del estimador. Los datos profesionales, enlaces y textos se mantienen en el repositorio.

Salidas: contenido escapado por Vue, navegación interna, enlaces externos con destinos definidos por la aplicación, un mailto con texto codificado, una consulta de WhatsApp y un PDF generado localmente.

No hay login, cookies de sesión de aplicación, carga de archivos ni endpoint propio de recepción de mensajes en la versión Pages. Por eso no se añadieron autenticación, rate limiting o infraestructura de servidor que el producto no utiliza. La fuente Laravel antigua no es el runtime publicado.

## Controles implementados

- Preferencias limitadas a idiomas soportados y tema booleano; fallos o valores corruptos de localStorage no bloquean el sitio.
- Rutas de proyectos resueltas contra el catálogo; rutas no reconocidas muestran recuperación 404.
- Interpolación de Vue para textos; los mensajes de contacto se codifican en la URL. El sitio no incorpora HTML proporcionado por visitantes.
- Pestañas externas con noopener y noreferrer, comprobadas en los recorridos de navegador.
- CSP de producción: scripts del mismo origen, sin unsafe-eval ni scripts inline; objetos y frames deshabilitados; destinos de formularios deshabilitados. CSS inline se admite porque la interfaz usa estilos dinámicos. Las fuentes de Bunny son una dependencia externa explícita.
- Política de referencia strict-origin-when-cross-origin.
- El build excluye public/index.php, public/.htaccess y el antiguo public/build del artefacto; la fuente original se conserva.
- Logs, sesiones y cachés generados de Laravel se retiran del árbol actual y se ignoran; check:source evita que vuelvan a versionarse. Esto no reescribe el historial.
- Herramientas de build en una rama mantenida de Vite y dependencias de test bloqueadas en package-lock.json.
- npm audit revisa también herramientas de desarrollo; no se interpreta un aviso de una herramienta como prueba de explotación del sitio.
- CI con lectura por defecto, sin credenciales persistentes en checkout, y permisos de publicación limitados al job de despliegue.

## Qué comprueban los tests

Node: contratos del catálogo, archivos de preview, URL HTTPS de datos mantenidos, rutas, preferencias, PDF bilingüe y estructura de referencias PDF. La prueba de exclusión usa una carpeta temporal y verifica que se conservan los recursos vigentes.

Playwright: recorridos sobre el build local en Chromium, con perfiles de escritorio y móvil, teclado, filtros, preferencias, CV real, errores y CSP. El 404 real se sirve en una URL inexistente anidada para comprobar la carga de sus recursos y la vuelta al inicio; también se comprueba la recuperación sin JavaScript. Los tests de generación cubren bases en la raíz y en /portfolio-2025/. No ejecuta compras, envíos, mensajes ni peticiones a demos o servicios externos.

check:build inspecciona index.html y 404.html y rechaza ejecutables PHP, logs, claves, mapas y directorios de runtime en dist.

Antes de publicar, todas las comprobaciones deben completarse. Los fallos impiden que el workflow de deploy consuma el artefacto.

## Límites y mantenimiento

- Las directivas CSP basadas en meta no sustituyen cabeceras del servidor. GitHub Pages no permite configurar aquí HSTS, X-Frame-Options o frame-ancestors; no se presentan como controles aplicados.
- Una prueba con viewport móvil Chromium no equivale a validar todos los dispositivos o navegadores.
- Los enlaces y fuentes externos pueden cambiar o fallar. Los tests de CI son deliberadamente independientes de esos servicios.
- El sitio debe mantener textos extraíbles y enlaces claros; prerenderizado y metadatos sociales son mejoras independientes aún por abordar.
- Una revisión sin hallazgos no garantiza seguridad futura. Dependabot propone actualizaciones semanales y los cambios deben superar las mismas comprobaciones.
- No se realizó una limpieza del historial Git ni una auditoría de la antigua aplicación Laravel desplegada como servidor.

## Referencias

- [CSP en meta y directivas admitidas](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).
- [Ramas mantenidas de Vite](https://vite.dev/releases).
- [Pruebas sobre un servidor local con Playwright](https://playwright.dev/docs/test-webserver).

## Rutas de publicación y recuperación

GitHub Actions obtiene la ruta actual del sitio con actions/configure-pages y la pasa al build y a Playwright mediante PORTFOLIO_BASE_PATH. Al configurar un dominio propio, el siguiente despliegue obtiene la nueva base sin deducirla de la URL que escribió un visitante. En desarrollo local la base predeterminada es /.

El 404 incluye una base absoluta antes de sus recursos y un enlace de recuperación a la raíz del sitio. Esta revisión reprodujo y corrigió el fallo anterior: en una dirección inexistente con varios niveles, la base relativa buscaba los recursos y el inicio dentro de la carpeta inexistente.
