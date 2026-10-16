// Brand hex values from Simple Icons, consulted 2026-10-16.
// https://github.com/simple-icons/simple-icons/blob/develop/data/simple-icons.json
// Adobe product colors: Simple Icons 13.0.0, sourced there from Adobe Creative Cloud.
// https://github.com/simple-icons/simple-icons/blob/13.0.0/_data/simple-icons.json
// Generic concepts without a distinct brand keep the neutral tag style.
const colors = {
  "adobeillustrator": "#FF9A00",
  "adobephotoshop": "#31A8FF",
  "adobepremierepro": "#9999FF",
  "owasp": "#000000",
  "alpinejs": "#8BC0D0",
  "bootstrap": "#7952B3",
  "css": "#663399",
  "express": "#0A0A0A",
  "firebase": "#DD2C00",
  "git": "#F03C2E",
  "github": "#181717",
  "githubpages": "#222222",
  "html5": "#E34F26",
  "javascript": "#F7DF1E",
  "json": "#000000",
  "laravel": "#FF2D20",
  "mysql": "#4479A1",
  "nodejs": "#5FA04E",
  "nuxt": "#00DC82",
  "php": "#777BB4",
  "pwa": "#5A0FC8",
  "quasar": "#050A14",
  "react": "#61DAFB",
  "sass": "#CC6699",
  "sqlite": "#003B57",
  "tailwindcss": "#06B6D4",
  "typescript": "#3178C6",
  "vite": "#9135FF",
  "vuejs": "#4FC08D",
  "wordpress": "#21759B"
};

const aliases = {
  illustrator: 'adobeillustrator',
  photoshop: 'adobephotoshop',
  premierepro: 'adobepremierepro',
  owasptop10: 'owasp',
  html: 'html5',
  css3: 'css',
  blade: 'laravel',
  tailwind: 'tailwindcss',
};

export function technologyStyle(name) {
  const key = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
  const color = colors[aliases[key] || key];
  return color ? { '--tech-color': color } : null;
}
