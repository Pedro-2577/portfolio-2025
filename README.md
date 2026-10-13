# Portfolio 2025 - Vue + Vite

La versión pública del portfolio es una aplicación estática construida con Vue 3 y Vite. Se publica automáticamente en GitHub Pages, por lo que no requiere PHP, Composer, base de datos ni un servidor que pueda suspenderse por inactividad.

La implementación Laravel/TALL Stack original permanece en el historial del repositorio como referencia técnica.

## Características

- Vue 3 + Vite, sin backend obligatorio.
- Deploy automático y gratuito con GitHub Actions y GitHub Pages.
- Diseño responsive para móvil, tablet y escritorio.
- Modo oscuro e idioma español/inglés persistidos en `localStorage`.
- Catálogo con búsqueda, filtro por tecnología y filtro de destacados.
- Proyectos privados visibles como experiencia sin exponer código ni enlaces internos.
- Contacto directo por email, WhatsApp, LinkedIn y GitHub.
- Formulario `mailto:` que funciona sin servidor propio.
- Rutas con hash para que los detalles funcionen correctamente en GitHub Pages.

## Tecnologías

- Vue 3
- Vite
- JavaScript
- CSS
- GitHub Actions

## Instalación local

### Requisitos

- Node.js 20 o superior
- NPM
- Git

```bash
git clone https://github.com/Pedro-2577/portfolio-2025.git
cd portfolio-2025
npm install
npm run dev
```

La aplicación estará disponible en la URL que indique Vite, normalmente `http://localhost:5173`.

Para generar la versión de producción:

```bash
npm run build
```

## Publicación

Cada push a `main` ejecuta `.github/workflows/deploy-pages.yml`, compila la aplicación y la publica en GitHub Pages. En la configuración del repositorio hay que seleccionar **Settings → Pages → GitHub Actions** como fuente de publicación.

La URL esperada es:

`https://pedro-2577.github.io/portfolio-2025/`

## Estructura pública

- `index.html`: entrada de Vite.
- `src/App.vue`: navegación, vistas y estado de la aplicación.
- `src/data.js`: proyectos y datos de contacto.
- `src/style.css`: estilos responsive y tema oscuro.
- `public/favicon.svg`: favicon.
- `.github/workflows/deploy-pages.yml`: build y deploy.

Los archivos Laravel, Blade, Livewire y PHP se conservan como referencia histórica de la versión anterior, pero no son necesarios para publicar la versión estática.
