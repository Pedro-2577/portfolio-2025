<script setup>
import { computed } from 'vue';
import { professionalProfile } from './profile';

const props = defineProps({ language: { type: String, default: 'es' } });
const emit = defineEmits(['navigate']);
const copy = {
  es: {
    eyebrow: 'Mi recorrido',
    title: 'Experiencia profesional',
    intro: 'Trabajo en equipo y proyectos independientes.',
    fullProfile: 'Ver mi recorrido completo',
    expand: 'Ver mis aportes',
    collapse: 'Ocultar aportes',
    entries: [
      { match: 'VendoAlgo', title: 'VendoAlgo', summary: 'Participé en la construcción de la plataforma desde cero y sigo trabajando en su evolución junto al equipo.', route: 'project/vendoalgo', link: 'Ver el proyecto' },
      { match: 'Proyectos independientes', title: 'Trabajo freelance', summary: 'Desarrollo web para clientes, una extensión para Chrome y gestión de tiendas. En FumigAR me ocupo de la configuración y el acompañamiento de la operación.', route: 'projects', link: 'Ver mis proyectos', serviceLink: 'Gestión de tiendas y caso FumigAR', extensionLink: 'Ver mi extensión publicada' },
    ],
  },
  en: {
    eyebrow: 'My background',
    title: 'Professional experience',
    intro: 'Teamwork and independent projects.',
    fullProfile: 'View my full background',
    expand: 'See my contributions',
    collapse: 'Hide contributions',
    entries: [
      { match: 'VendoAlgo', title: 'VendoAlgo', summary: 'I helped build the platform from scratch and continue developing it with the team.', route: 'project/vendoalgo', link: 'View the project' },
      { match: 'Independent projects', title: 'Freelance work', summary: 'Client web development, a Chrome extension and store management. At FumigAR, I handle configuration and ongoing operational support.', route: 'projects', link: 'View my projects', serviceLink: 'Store management and the FumigAR case', extensionLink: 'View my published extension' },
    ],
  },
};
const t = computed(() => copy[props.language] || copy.es);
const experience = computed(() => {
  const profile = professionalProfile[props.language] || professionalProfile.es;
  return t.value.entries.flatMap((entry) => {
    const record = profile.experience.find((item) => item.organization.startsWith(entry.match));
    return record ? [{ ...entry, ...record }] : [];
  });
});
</script>

<template>
  <section id="portfolio-playground" class="experience-preview" tabindex="-1" aria-labelledby="experience-preview-title">
    <div class="container experience-preview-grid">
      <header class="experience-preview-intro">
        <p class="eyebrow">{{ t.eyebrow }}</p>
        <h2 id="experience-preview-title">{{ t.title }}</h2>
        <p class="experience-preview-description">{{ t.intro }}</p>
        <a class="text-link experience-full-profile" href="#about" @click.prevent="emit('navigate', 'about')">{{ t.fullProfile }} <span aria-hidden="true">↗</span></a>
      </header>
      <div class="experience-preview-list">
        <article v-for="entry in experience" :key="entry.match" class="experience-preview-entry">
          <p class="experience-preview-period">{{ entry.period }}</p>
          <h3>{{ entry.title }}</h3>
          <p class="experience-preview-role">{{ entry.role }}</p>
          <p class="experience-preview-summary">{{ entry.summary }}</p>
          <details class="experience-preview-details">
            <summary><span class="contributions-closed">{{ t.expand }}</span><span class="contributions-open">{{ t.collapse }}</span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg></summary>
            <ul><li v-for="item in entry.items" :key="item">{{ item }}</li></ul>
          </details>
          <div class="experience-preview-links">
  <a class="text-link experience-project-link" :href="'#' + entry.route" @click.prevent="emit('navigate', entry.route)">{{ entry.link }} <span aria-hidden="true">↗</span></a>
            <a v-if="entry.extensionLink" class="text-link experience-project-link" href="#project/widget-horas-insightful" @click.prevent="emit('navigate', 'project/widget-horas-insightful')">{{ entry.extensionLink }} <span aria-hidden="true">↗</span></a>
            <a v-if="entry.serviceLink" class="text-link experience-project-link" href="#services" @click.prevent="emit('navigate', 'services')">{{ entry.serviceLink }} <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-preview { padding-block: var(--space-12); border-bottom: 1px solid var(--line); scroll-margin-top: 96px; }
.experience-preview:focus { outline: none; }
.experience-preview-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--grid-gap); align-items: start; }
.experience-preview-intro { grid-column: 1 / span 4; }
.experience-preview-intro h2 { margin: 0 0 20px; color: var(--ink); font-size: clamp(2.1rem, 4vw, 3.3rem); line-height: 1.05; letter-spacing: -.055em; overflow-wrap: normal; }
.experience-preview-description { max-width: 32ch; margin: 0 0 24px; color: var(--muted); font-size: 1rem; line-height: 1.65; }
.experience-full-profile { display: inline-block; padding-block: 6px; color: var(--ink); font-size: .85rem; font-weight: 600; line-height: 1.5; }
.experience-preview-list { grid-column: 6 / span 7; min-width: 0; }
.experience-preview-entry { padding: 24px 0; border-top: 1px solid var(--line); }
.experience-preview-entry:first-child { padding-top: 0; border-top: 0; }
.experience-preview-entry:last-child { padding-bottom: 0; }
.experience-preview-period { margin: 0 0 12px; color: var(--muted); font-size: .75rem; line-height: 1.5; }
.experience-preview-entry h3 { margin: 0 0 6px; color: var(--ink); font-size: clamp(1.3rem, 2vw, 1.6rem); line-height: 1.2; letter-spacing: -.025em; }
.experience-preview-role { margin: 0; color: var(--ink); font-size: .9rem; line-height: 1.55; }
.experience-preview-summary { margin: 14px 0 12px; color: var(--muted); font-size: .95rem; line-height: 1.65; }
.experience-preview-details { margin: 0 0 12px; padding: 0; border: 0; }
.experience-preview-details summary { display: flex; align-items: center; gap: 10px; width: fit-content; min-height: 44px; padding: 6px 0; color: var(--ink); font-size: .82rem; font-weight: 600; cursor: pointer; list-style: none; }
.experience-preview-details summary::-webkit-details-marker { display: none; }
.experience-preview-details summary::marker { content: ''; }
.experience-preview-details summary svg { width: 18px; height: 18px; flex: 0 0 18px; transition: transform .2s ease; }
.experience-preview-details[open] summary svg { transform: rotate(45deg); }
.contributions-open, .experience-preview-details[open] .contributions-closed { display: none; }
.experience-preview-details[open] .contributions-open { display: inline; }
.experience-preview-details ul { display: grid; gap: 10px; margin: 8px 0 18px; padding-left: 18px; color: var(--muted); font-size: .88rem; line-height: 1.65; }
.experience-preview-links { display: flex; flex-wrap: wrap; gap: 8px 20px; }
.experience-project-link { display: inline-block; padding-block: 6px; color: var(--ink); font-size: .82rem; font-weight: 600; line-height: 1.5; }
.experience-preview :is(a, summary):focus-visible { outline: 2px solid #749b2e; outline-offset: 4px; border-radius: 2px; }
@media (max-width: 960px) {
 .experience-preview-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
 .experience-preview-intro { grid-column: 1 / span 3; }
 .experience-preview-list { grid-column: 4 / span 5; }
}
@media (max-width: 700px) {
 .experience-preview-grid { grid-template-columns: minmax(0, 1fr); row-gap: 28px; }
 .experience-preview-intro, .experience-preview-list { grid-column: 1; }
 .experience-preview-intro h2 { max-width: 18ch; }
 .experience-preview-description { max-width: none; margin-bottom: 12px; }
 .experience-preview-list { border-top: 1px solid var(--line); padding-top: 24px; }
}
@media (prefers-reduced-motion: reduce) { .experience-preview-details summary svg { transition: none; } }
</style>
