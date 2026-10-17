# Error states

- Unknown hash routes and missing project slugs render a bilingual 404 view with recovery actions.
- Existing pricing aliases (`#precios`, `#/precios`, `#services/precios`) remain valid.
- Vue application errors use the 500 recovery view. Error details stay in the developer console.
- `#error/403`, `#error/404`, `#error/500`, and `#error/503` are labeled design previews. The preview selector is shown only on these routes.
- GitHub Pages serves the generated `dist/404.html` for missing physical paths. It retains HTTP 404, loads the same versioned app assets and includes an HTML fallback before JavaScript runs.
- Recovery from a missing physical path navigates to the canonical site base. It does not leave the browser on the missing path.
- The SPA's hash routes are client-side views and do not change the host's HTTP response status. The 403 and 503 previews do not implement authorization or simulate service downtime.
- Error views use noindex, support light/dark themes, keyboard navigation and reduced-motion preferences.

Validation: `node --test tests/httpErrors.test.js`, production build, published route/status and recovery checks.
