<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { contact, projects } from './data';
import { professionalProfile } from './profile';
import { downloadResumePdf } from './resumePdf';

const language = ref(localStorage.getItem('language') || 'es');
const darkMode = ref(localStorage.getItem('darkMode') === 'true');
const currentRoute = ref(window.location.hash.slice(1) || 'home');
const search = ref('');
const technology = ref('');
const featuredOnly = ref(false);
const mobileMenuOpen = ref(false);
const form = ref({ name: '', email: '', subject: '', message: '' });
const formError = ref('');
const demoDialog = ref(null);
const pendingDemo = ref(null);
let previousBodyOverflow = '';

const text = {
  es: {
    demoEyebrow: 'Demo académica', demoTitle: 'Antes de abrir la demo', demoWait: 'La demo se activa cuando la visitás. La primera carga puede tardar alrededor de un minuto.', demoTime: 'Tiempo de activación', demoTimeValue: '≈ 1 min', demoData: 'Datos de prueba · Sin compras reales', demoContinue: 'Abrir demo', demoCancel: 'Volver', demoClose: 'Cerrar aviso',
    home: 'Inicio', projects: 'Proyectos', about: 'Sobre mí', contact: 'Contacto',
    greeting: 'Hola, soy', role: 'Desarrollador full stack · Seguridad · IA',
    hero: 'Desarrollo productos web de punta a punta, integro IA y aplico una mirada de seguridad desde el código. Trabajo con JavaScript y PHP desde 2020, combinando programación, UX y criterio de producto.',
    viewProjects: 'Ver proyectos', talk: 'Hablemos', featured: 'Proyectos destacados',
    featuredIntro: 'Una selección curada de demos públicas y proyectos profesionales. El resto del catálogo separa claramente trabajos académicos y experiencias privadas.',
    allProjects: 'Ver todos los proyectos', skills: 'Tecnologías con las que trabajo',
    skillsIntro: 'Frontend, backend, datos, seguridad e inteligencia artificial: áreas que conecto para desarrollar y mejorar productos web.',
    availability: 'Disponible para nuevos desafíos',
    availabilityText: 'Trabajo remoto desde Buenos Aires. Me interesan oportunidades en desarrollo full stack, integración de IA y ciberseguridad.',
    myProjects: 'Mis proyectos', projectsIntro: 'Proyectos profesionales, demos públicas y trabajos académicos, con enlaces y alcance identificados para revisar cada experiencia con contexto.',
    search: 'Buscar por nombre o descripción', allTechnologies: 'Todas las tecnologías', onlyFeatured: 'Solo destacados',
    clear: 'Limpiar filtros', results: 'proyecto(s)', noResults: 'No se encontraron proyectos',
    adjust: 'Probá ajustar los filtros para ver más resultados.', details: 'Ver detalles',
    privateProject: 'Proyecto privado', featuredTag: 'Destacado', github: 'GitHub', demo: 'Ver proyecto',
    projectDescription: 'Descripción del proyecto', projectDetails: 'Detalles del proyecto',
    technologies: 'Tecnologías utilizadas', back: 'Volver a proyectos', aboutTitle: 'Sobre mí',
    aboutIntro: 'Soy Pedro Martín Méndez Carabán. Combino desarrollo full stack, investigación de seguridad e integración de IA para construir productos web con una mirada integral.',
    story: 'Mi recorrido', storyOne: 'Desde 2020 trabajo en proyectos web independientes. Actualmente soy programador en el equipo de VendoAlgo, donde desarrollé la plataforma desde cero y sigo participando en su evolución.',
    storyTwo: 'Mi recorrido también incluye UX, diseño, marketing y extensiones para navegadores. La investigación de vulnerabilidades y mis estudios de Abogacía suman una perspectiva sobre seguridad, privacidad y contexto de uso.',
    education: 'Formación', educationText: 'Tecnicatura Superior en Diseño y Programación Web — Escuela Da Vinci. Tesis pendiente.',
    contactTitle: 'Hablemos', contactIntro: '¿Tenés una idea, una oportunidad o querés conocer más sobre un proyecto? Elegí el canal que te resulte más cómodo.',
    sendMessage: 'Preparar un mensaje', response: 'Normalmente respondo dentro de las 24 horas.',
    name: 'Nombre', email: 'Email', subject: 'Asunto', message: 'Mensaje', send: 'Abrir correo',
    required: 'Completá todos los campos para preparar el mensaje.', emailLabel: 'Email directo',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Perfil profesional', locationLabel: 'Ubicación',
    remote: 'Disponible para trabajo remoto', faq: 'Preguntas frecuentes',
    faqOne: '¿Trabajás con equipos remotos?', faqOneAnswer: 'Sí. Estoy acostumbrado a colaborar con herramientas digitales, Git y comunicación asincrónica.',
    faqTwo: '¿Qué tipo de proyectos te interesan?', faqTwoAnswer: 'Desarrollo full stack, integración de IA, automatización y proyectos de ciberseguridad, además de productos web que resuelvan problemas reales.',
    workflowTitle: 'Cómo trabajo con IA', workflowText: 'Primero defino la estructura, las restricciones y el resultado esperado. Después uso IA para implementar, explorar alternativas y depurar; finalmente valido comportamiento, accesibilidad, diseño, seguridad y publicación.',
    footer: 'Portfolio de Pedro Méndez Carabán', tagline: 'Creo cosas que funcionan.', sourceCode: 'Ver código', liveDemo: 'Abrir demo', privateCode: 'Código privado', privateDemo: 'Demo privada', phpWarning: 'Demo académica desarrollada con Laravel/PHP. El servidor se activa al recibir visitas; la primera carga puede tardar alrededor de un minuto. Los datos son de prueba y pueden reiniciarse.', nodeWarning: 'Este proyecto necesita un servidor Node.js para funcionar; todavía no hay una demo pública configurada.', noDemo: 'Todavía no hay una demo pública configurada para este proyecto.',
    resumeDownload: 'Descargar CV (PDF)', resumeSummary: 'Desarrollador full stack con experiencia en productos web, integración de IA y seguridad de aplicaciones. Desarrollo desde el frontend hasta las APIs y el backend, con foco en experiencia de usuario, rendimiento y mantenibilidad.', resumeProjectsTitle: 'Proyectos seleccionados', resumeGitHub: 'GitHub', resumeSite: 'Portfolio', resumePage: 'Portfolio', projectCount: 'proyectos catalogados', publicEvidence: 'demos públicas revisables', stackLabel: 'Trabajo con', stackText: 'código · UX · IA', openToWork: 'Abierto a oportunidades',
    roleLabel: 'Mi responsabilidad', highlightsLabel: 'Qué entregué', outcomeLabel: 'Resultado', academicProjects: 'Proyectos académicos', professionalProjects: 'Proyectos profesionales y propios', currentSite: 'Estás viendo este proyecto', inDevelopment: 'En desarrollo', developmentNotice: 'Proyecto en desarrollo. La presentación pública estará disponible después del lanzamiento.',
  },
  en: {
    demoEyebrow: 'Academic demo', demoTitle: 'Before you open the demo', demoWait: 'The demo starts when you visit it. The first load may take about a minute.', demoTime: 'Startup time', demoTimeValue: '≈ 1 min', demoData: 'Sample data · No real purchases', demoContinue: 'Open demo', demoCancel: 'Go back', demoClose: 'Close notice',
    home: 'Home', projects: 'Projects', about: 'About me', contact: 'Contact',
    greeting: "Hi, I'm", role: 'Full-stack developer · Security · AI',
    hero: 'I build web products end to end, integrate AI and bring a security perspective to the code. Working with JavaScript and PHP since 2020, I combine development, UX and product judgment.',
    viewProjects: 'View projects', talk: "Let's talk", featured: 'Featured projects',
    featuredIntro: 'A curated selection of public demos and professional projects. The full catalog clearly separates academic work and private experience.',
    allProjects: 'View all projects', skills: 'Technologies I work with',
    skillsIntro: 'Frontend, backend, data, security and artificial intelligence: the areas I connect to build and improve web products.',
    availability: 'Available for new challenges',
    availabilityText: 'I work remotely from Buenos Aires and am open to opportunities in full-stack development, AI integration and cybersecurity.',
    myProjects: 'My projects', projectsIntro: 'Professional projects, public demos and academic work, with scope and links identified so each experience can be reviewed in context.',
    search: 'Search by name or description', allTechnologies: 'All technologies', onlyFeatured: 'Featured only',
    clear: 'Clear filters', results: 'project(s)', noResults: 'No projects found',
    adjust: 'Try adjusting the filters to see more results.', details: 'View details',
    privateProject: 'Private project', featuredTag: 'Featured', github: 'GitHub', demo: 'View project',
    projectDescription: 'Project description', projectDetails: 'Project details',
    technologies: 'Technologies used', back: 'Back to projects', aboutTitle: 'About me',
    aboutIntro: 'I am Pedro Martín Méndez Carabán. I combine full-stack development, security research and AI integration to build web products from a broad technical perspective.',
    story: 'My journey', storyOne: 'I have worked on independent web projects since 2020. I currently work as a developer on the VendoAlgo team, where I built the platform from scratch and continue to contribute to its development.',
    storyTwo: 'My background also includes UX, design, marketing and browser extensions. Vulnerability research and my law studies add a perspective on security, privacy and the context in which software is used.',
    education: 'Education', educationText: 'Higher Technical Program in Web Design and Programming — Da Vinci School. Thesis pending.',
    contactTitle: "Let's talk", contactIntro: 'Have an idea, an opportunity or want to learn more about a project? Choose the channel that works best for you.',
    sendMessage: 'Prepare a message', response: 'I usually reply within 24 hours.',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', send: 'Open email',
    required: 'Complete every field to prepare the message.', emailLabel: 'Direct email',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Professional profile', locationLabel: 'Location',
    remote: 'Available for remote work', faq: 'Frequently asked questions',
    faqOne: 'Do you work with remote teams?', faqOneAnswer: 'Yes. I am used to collaborating with digital tools, Git and asynchronous communication.',
    faqTwo: 'What kind of projects interest you?', faqTwoAnswer: 'Full-stack development, AI integration, automation and cybersecurity projects, as well as web products that solve real problems.',
    workflowTitle: 'How I work with AI', workflowText: 'I define the structure, constraints and expected outcome first. Then I use AI to implement, explore alternatives and debug; finally I validate behavior, accessibility, design, security and delivery.',
    footer: "Pedro Méndez Carabán's portfolio", tagline: 'I build things that work.', sourceCode: 'View source', liveDemo: 'Open demo', privateCode: 'Private code', privateDemo: 'Private demo', phpWarning: 'Academic demo built with Laravel/PHP. The server starts when visited; the first load may take about a minute. Data is for demonstration and may reset.', nodeWarning: 'This project needs a Node.js server to run; there is no public demo configured yet.', noDemo: 'There is no public demo configured for this project yet.',
    resumeDownload: 'Download CV (PDF)', resumeSummary: 'Full-stack developer experienced in web products, AI integration and application security. I work across frontend, APIs and backend, focusing on user experience, performance and maintainability.', resumeProjectsTitle: 'Selected projects', resumeGitHub: 'GitHub', resumeSite: 'Portfolio', resumePage: 'Portfolio', projectCount: 'cataloged projects', publicEvidence: 'reviewable public demos', stackLabel: 'Work across', stackText: 'code · UX · AI', openToWork: 'Open to opportunities',
    roleLabel: 'My responsibility', highlightsLabel: 'What I delivered', outcomeLabel: 'Outcome', academicProjects: 'Academic projects', professionalProjects: 'Professional and personal projects', currentSite: 'You are viewing this project', inDevelopment: 'In development', developmentNotice: 'Project in development. A public presentation will be available after launch.',
  },
};

const t = computed(() => text[language.value]);
const profile = computed(() => professionalProfile[language.value]);
const routeParts = computed(() => currentRoute.value.split('/').filter(Boolean));
const selectedProject = computed(() => projects.find((project) => project.slug === routeParts.value[1]));
const technologies = computed(() => [...new Set(projects.flatMap((project) => project.technologies))].sort());
const filteredProjects = computed(() => projects.filter((project) => {
  const query = search.value.toLowerCase().trim();
  const matchesSearch = !query || `${project.title} ${project.description}`.toLowerCase().includes(query);
  const matchesTechnology = !technology.value || project.technologies.includes(technology.value);
  return matchesSearch && matchesTechnology && (!featuredOnly.value || project.featured);
}).sort((a, b) => {
  if (a.academic !== b.academic) return a.academic ? 1 : -1;
  if (a.academic) return Number(b.startDate) - Number(a.startDate) || a.id - b.id;
  return (a.importance || 99) - (b.importance || 99);
}));
const professionalProjects = computed(() => projects
  .filter((project) => !project.academic)
  .sort((a, b) => (a.importance || 99) - (b.importance || 99)));
const academicProjects = computed(() => projects
  .filter((project) => project.academic)
  .sort((a, b) => Number(b.startDate) - Number(a.startDate) || a.id - b.id));
const featuredProjects = computed(() => professionalProjects.value.filter((project) => project.featured));
const resumeProjects = computed(() => professionalProjects.value.filter((project) => project.role || project.roleEn).slice(0, 3));

// A project may have public source without a hosted demo.
function projectUrl(project) {
  return project.currentSite || project.demoType === 'development' ? null : project.live || (!project.private && project.github) || null;
}

async function confirmDemoStart(event, project) {
  if (!project.live || project.demoType !== 'php') return;
  event.preventDefault();
  if (demoDialog.value.open) return;
  pendingDemo.value = project;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  await nextTick();
  demoDialog.value.showModal();
}

function closeDemoDialog() {
  demoDialog.value?.close();
}

function onDemoDialogClose() {
  pendingDemo.value = null;
  document.body.style.overflow = previousBodyOverflow;
}

function onDemoBackdrop(event) {
  if (event.target === demoDialog.value) closeDemoDialog();
}

function techClass(technologyName) {
  const normalized = technologyName.toLowerCase();
  if (normalized.includes('vue') || normalized.includes('nuxt')) return 'tech-vue';
  if (normalized.includes('javascript')) return 'tech-javascript';
  if (normalized.includes('typescript')) return 'tech-typescript';
  if (normalized.includes('html')) return 'tech-html';
  if (normalized.includes('css')) return 'tech-css';
  if (normalized.includes('php')) return 'tech-php';
  if (normalized.includes('laravel') || normalized.includes('blade')) return 'tech-laravel';
  if (normalized.includes('mysql') || normalized.includes('firebase')) return 'tech-data';
  if (normalized.includes('wordpress')) return 'tech-wordpress';
  return 'tech-neutral';
}

function navigate(route) {
  window.location.hash = route;
  currentRoute.value = route;
  mobileMenuOpen.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleLanguage() {
  language.value = language.value === 'es' ? 'en' : 'es';
}

function downloadResume() {
  downloadResumePdf({ language: language.value, profile: profile.value, text: t.value, contact, projects: resumeProjects.value });
}

function toggleTheme() {
  darkMode.value = !darkMode.value;
}

function submitContact() {
  formError.value = '';
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    formError.value = t.value.required;
    return;
  }
  const body = `${t.value.name}: ${form.value.name}\n${t.value.email}: ${form.value.email}\n\n${form.value.message}`;
  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(form.value.subject)}&body=${encodeURIComponent(body)}`;
}

function onHashChange() {
  currentRoute.value = window.location.hash.slice(1) || 'home';
}

watch(language, (value) => localStorage.setItem('language', value));
watch(darkMode, (value) => {
  localStorage.setItem('darkMode', String(value));
  document.documentElement.classList.toggle('dark', value);
});

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkMode.value);
  window.addEventListener('hashchange', onHashChange);
});
onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange);
  if (pendingDemo.value) document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="#home" @click.prevent="navigate('home')">Pedro Méndez Carabán</a>
        <button class="menu-button" type="button" aria-label="Abrir menú de navegación" :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = !mobileMenuOpen">☰</button>
        <nav :class="{ 'is-open': mobileMenuOpen }" class="site-nav" aria-label="Navegación principal">
          <a :class="{ active: currentRoute === 'home' }" href="#home" @click.prevent="navigate('home')">{{ t.home }}</a>
          <a :class="{ active: currentRoute === 'projects' || currentRoute.startsWith('project/') }" href="#projects" @click.prevent="navigate('projects')">{{ t.projects }}</a>
          <a :class="{ active: currentRoute === 'about' }" href="#about" @click.prevent="navigate('about')">{{ t.about }}</a>
          <a :class="{ active: currentRoute === 'contact' }" href="#contact" @click.prevent="navigate('contact')">{{ t.contact }}</a>
        </nav>
        <div class="nav-actions">
          <button class="icon-button" type="button" :title="language === 'es' ? 'Switch to English' : 'Cambiar a español'" @click="toggleLanguage">{{ language === 'es' ? 'EN' : 'ES' }}</button>
          <button class="icon-button" type="button" :title="darkMode ? 'Light mode' : 'Dark mode'" @click="toggleTheme">{{ darkMode ? '☀' : '☾' }}</button>
        </div>
      </div>
    </header>

    <main>
      <section v-if="currentRoute === 'home'" class="hero">
        <div class="container hero-content">
          <p class="eyebrow">{{ t.role }} <span class="eyebrow-dot"></span> Buenos Aires</p>
          <h1>{{ t.greeting }} <span>Pedro.</span><br><em>{{ t.tagline }}</em></h1>
          <p class="hero-copy">{{ t.hero }}</p>
          <div class="button-row">
            <button class="button button-download" type="button" @click="downloadResume">{{ t.resumeDownload }}</button>
            <a class="button button-light" href="#projects" @click.prevent="navigate('projects')">{{ t.viewProjects }}</a>
            <a class="button button-outline" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a>
          </div>
          <div class="hero-meta"><span>{{ projects.length }} {{ t.projectCount }}</span><span>{{ projects.filter((project) => project.live).length }} {{ t.publicEvidence }}</span><span>{{ t.stackLabel }}: {{ t.stackText }}</span></div>
        </div>
      </section>

      <template v-if="currentRoute === 'home'">
        <section class="section">
          <div class="container">
            <div class="section-heading section-heading-left"><p class="eyebrow">01 / {{ t.skills }}</p><h2>{{ t.skills }}</h2><p>{{ t.skillsIntro }}</p></div>
            <div class="skill-grid">
              <div v-for="area in profile.skills.slice(0, 4)" :key="area.title" class="skill-card"><strong>{{ area.title }}</strong><span>{{ area.items.slice(0, 3).join(' · ') }}</span></div>
            </div>
          </div>
        </section>
        <section class="section section-muted">
          <div class="container"><div class="section-heading section-heading-left"><p class="eyebrow">02 / {{ t.featured }}</p><h2>{{ t.featured }}</h2><p>{{ t.featuredIntro }}</p></div><div class="project-grid"><article v-for="project in featuredProjects" :key="project.id" class="project-card" :class="{ 'project-card-lead': project.id === 1 }"><div class="project-image"><img :src="project.image" :alt="project.title"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><div class="card-actions"><a class="button button-small" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ t.demo }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span></div></div></article></div><div class="center"><a class="button button-primary" href="#projects" @click.prevent="navigate('projects')">{{ t.allProjects }}</a></div></div>
        </section>
        <section class="section academic-preview"><div class="container"><div class="category-divider"><span>{{ t.academicProjects }}</span></div><div class="project-grid"><article v-for="project in academicProjects.slice(0, 3)" :key="project.id" class="project-card academic-card"><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="card-actions"><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ t.demo }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a class="text-link" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }} →</a></div></div></article></div></div></section>
        <section class="availability"><div class="container availability-inner"><div><p class="eyebrow">{{ t.availability }}</p><h2>{{ t.availability }}</h2><p>{{ t.availabilityText }}</p></div><a class="button button-light" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a></div></section>
      </template>

      <section v-else-if="currentRoute === 'projects'" class="section page-section">
        <div class="container"><div class="section-heading section-heading-left"><p class="eyebrow">03 / {{ t.projects }}</p><h1>{{ t.myProjects }}</h1><p>{{ t.projectsIntro }}</p></div><div class="filters"><input v-model="search" type="search" :placeholder="t.search"><select v-model="technology"><option value="">{{ t.allTechnologies }}</option><option v-for="item in technologies" :key="item" :value="item">{{ item }}</option></select><label><input v-model="featuredOnly" type="checkbox"> {{ t.onlyFeatured }}</label><button v-if="search || technology || featuredOnly" class="text-button" type="button" @click="search = ''; technology = ''; featuredOnly = false">{{ t.clear }}</button></div><p class="result-count">{{ filteredProjects.length }} {{ t.results }}</p><div v-if="filteredProjects.some((project) => !project.academic)" class="category-divider"><span>{{ t.professionalProjects }}</span></div><div v-if="filteredProjects.length" class="project-grid"><article v-for="project in filteredProjects.filter((item) => !item.academic)" :key="project.id" class="project-card"><div class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><div class="card-actions"><a class="button button-small" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ t.demo }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span></div></div></article></div><div v-else class="empty-state"><h2>{{ t.noResults }}</h2><p>{{ t.adjust }}</p></div><div v-if="filteredProjects.some((project) => project.academic)" class="category-divider"><span>{{ t.academicProjects }}</span></div><div class="project-grid"><article v-for="project in filteredProjects.filter((item) => item.academic)" :key="project.id" class="project-card academic-card"><div v-if="project.preview" class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><div class="card-actions"><a class="button button-small" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ t.demo }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span></div></div></article></div></div>
      </section>

      <section v-else-if="currentRoute === 'about'" class="section page-section cv-about">
        <div class="container">
          <header class="cv-intro"><p class="eyebrow">04 / {{ t.about }}</p><h1>{{ t.aboutTitle }}</h1><p class="cv-lead">{{ t.aboutIntro }}</p><button class="button button-primary" type="button" @click="downloadResume">{{ t.resumeDownload }}</button><p>{{ t.storyOne }}</p><p>{{ t.storyTwo }}</p></header>
          <div class="cv-layout">
            <div>
              <section class="cv-section" aria-labelledby="cv-experience-title">
                <h2 id="cv-experience-title">{{ profile.experienceTitle }}</h2>
                <div class="cv-timeline">
                  <article v-for="experience in profile.experience" :key="experience.role" class="cv-position">
                    <p class="cv-period">{{ experience.period }}</p><h3>{{ experience.role }}</h3><p class="cv-organization">{{ experience.organization }}</p>
                    <ul><li v-for="item in experience.items" :key="item">{{ item }}</li></ul>
                  </article>
                </div>
              </section>
              <section class="cv-section" aria-labelledby="cv-education-title">
                <h2 id="cv-education-title">{{ profile.educationTitle }}</h2>
                <article v-for="education in profile.education" :key="education.title" class="cv-education">
                  <p class="cv-period">{{ education.period }}</p><h3>{{ education.title }}</h3><p class="cv-organization">{{ education.institution }}</p><span class="cv-status">{{ education.status }}</span><p>{{ education.description }}</p>
                </article>
              </section>
              <section class="cv-section" aria-labelledby="cv-courses-title">
                <h2 id="cv-courses-title">{{ profile.coursesTitle }}</h2>
                <div v-for="course in profile.courses" :key="course.title" class="cv-course"><h3>{{ course.title }}</h3><p>{{ course.text }}</p></div>
              </section>
            </div>
            <aside class="cv-sidebar">
              <section class="info-panel"><h2>{{ profile.skillsTitle }}</h2><div v-for="area in profile.skills" :key="area.title" class="cv-skill-area"><h3>{{ area.title }}</h3><div class="tag-row"><span v-for="item in area.items" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div></div></section>
              <section class="info-panel"><h2>{{ profile.languagesTitle }}</h2><p>{{ profile.languages }}</p><div class="quote-box"><strong>{{ profile.strengthsTitle }}</strong><p>{{ profile.strengths }}</p></div></section>
              <section class="info-panel"><h2>{{ t.workflowTitle }}</h2><p>{{ t.workflowText }}</p></section>
            </aside>
          </div>
        </div>
      </section>

      <section v-else-if="currentRoute === 'contact'" class="section page-section"><div class="container"><div class="section-heading"><p class="eyebrow">{{ t.contact }}</p><h1>{{ t.contactTitle }}</h1><p>{{ t.contactIntro }}</p></div><div class="two-columns contact-layout"><div class="contact-form-panel"><h2>{{ t.sendMessage }}</h2><p class="muted">{{ t.response }}</p><form @submit.prevent="submitContact"><label>{{ t.name }}<input v-model="form.name" type="text" required></label><label>{{ t.email }}<input v-model="form.email" type="email" required></label><label>{{ t.subject }}<input v-model="form.subject" type="text" required></label><label>{{ t.message }}<textarea v-model="form.message" rows="5" required></textarea></label><p v-if="formError" class="form-error">{{ formError }}</p><button class="button button-primary" type="submit">{{ t.send }} ↗</button></form></div><div class="contact-info"><a class="contact-card" :href="`mailto:${contact.email}`"><strong>{{ t.emailLabel }}</strong><span>{{ contact.email }}</span></a><a class="contact-card" :href="`https://wa.me/${contact.whatsapp}`" target="_blank" rel="noopener noreferrer"><strong>{{ t.whatsappLabel }}</strong><span>{{ contact.phone }}</span></a><a class="contact-card" :href="contact.linkedin" target="_blank" rel="noopener noreferrer"><strong>{{ t.linkedinLabel }}</strong><span>LinkedIn ↗</span></a><div class="contact-card"><strong>{{ t.locationLabel }}</strong><span>{{ contact.location }} · {{ t.remote }}</span></div><div class="faq"><h2>{{ t.faq }}</h2><details><summary>{{ t.faqOne }}</summary><p>{{ t.faqOneAnswer }}</p></details><details><summary>{{ t.faqTwo }}</summary><p>{{ t.faqTwoAnswer }}</p></details></div></div></div></div></section>

      <section v-else-if="routeParts[0] === 'project' && selectedProject" class="section page-section"><div class="container project-detail"><div class="detail-main"><p class="eyebrow">{{ selectedProject.category }} · {{ selectedProject.startDate }}</p><h1>{{ selectedProject.title }}</h1><p class="lead">{{ selectedProject.shortDescription }}</p><img v-if="!selectedProject.academic || selectedProject.preview" :src="selectedProject.image" :alt="selectedProject.title"><h2>{{ t.projectDescription }}</h2><p>{{ selectedProject.description }}</p><div v-if="selectedProject.role || selectedProject.highlights || selectedProject.outcome" class="case-study"><div v-if="selectedProject.role"><p class="eyebrow">{{ t.roleLabel }}</p><p>{{ language === 'es' ? selectedProject.role : selectedProject.roleEn }}</p></div><div v-if="selectedProject.highlights"><p class="eyebrow">{{ t.highlightsLabel }}</p><ul><li v-for="highlight in (language === 'es' ? selectedProject.highlights : selectedProject.highlightsEn)" :key="highlight">{{ highlight }}</li></ul></div><div v-if="selectedProject.outcome"><p class="eyebrow">{{ t.outcomeLabel }}</p><p>{{ language === 'es' ? selectedProject.outcome : selectedProject.outcomeEn }}</p></div></div></div><aside class="info-panel"><h2>{{ t.projectDetails }}</h2><div class="tag-row large-tags"><span v-for="item in selectedProject.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><a v-if="selectedProject.github && !selectedProject.private" class="button button-secondary full-width" :href="selectedProject.github" target="_blank" rel="noopener noreferrer">{{ t.sourceCode }} ↗</a><a v-if="selectedProject.live" class="button button-primary full-width" :href="selectedProject.live" @click="confirmDemoStart($event, selectedProject)" :target="selectedProject.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ t.liveDemo }} ↗</a><div v-if="selectedProject.demoType === 'development'" class="project-notice"><strong>{{ t.inDevelopment }}</strong>{{ t.developmentNotice }}</div><div v-else-if="selectedProject.currentSite" class="project-notice">{{ t.currentSite }}</div><div v-else-if="selectedProject.demoType === 'private'" class="project-notice">{{ t.privateDemo }}<span>{{ t.privateCode }}</span></div><div v-else-if="selectedProject.demoType === 'php'" class="project-notice project-notice-warning">{{ t.phpWarning }}</div><div v-else-if="!selectedProject.live && selectedProject.demoType === 'node'" class="project-notice project-notice-warning">{{ t.nodeWarning }}</div><div v-else-if="!selectedProject.live" class="project-notice">{{ t.noDemo }}</div><a class="text-link back-link" href="#projects" @click.prevent="navigate('projects')">← {{ t.back }}</a></aside></div></section>
    </main>


    <dialog ref="demoDialog" class="demo-dialog" aria-labelledby="demo-dialog-title" aria-describedby="demo-dialog-description" @close="onDemoDialogClose" @click="onDemoBackdrop">
      <div class="demo-dialog-content">
        <div class="demo-dialog-top">
          <span class="demo-dialog-label"><span aria-hidden="true"></span>{{ t.demoEyebrow }}</span>
          <button class="demo-dialog-close" type="button" :aria-label="t.demoClose" @click="closeDemoDialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <p class="demo-dialog-project">{{ pendingDemo?.title }}</p>
        <h2 id="demo-dialog-title">{{ t.demoTitle }}</h2>
        <p id="demo-dialog-description" class="demo-dialog-description">{{ t.demoWait }}</p>
        <div class="demo-dialog-time">
          <span class="demo-dialog-clock" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          </span>
          <div><span>{{ t.demoTime }}</span><strong>{{ t.demoTimeValue }}</strong></div>
          <span class="demo-dialog-stack">Laravel / PHP</span>
        </div>
        <p class="demo-dialog-data">{{ t.demoData }}</p>
        <div class="demo-dialog-actions">
          <button type="button" class="button button-secondary" @click="closeDemoDialog">{{ t.demoCancel }}</button>
          <a v-if="pendingDemo" class="button button-primary" :href="pendingDemo.live" target="_blank" rel="noopener noreferrer" autofocus @click="closeDemoDialog">
            {{ t.demoContinue }} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </dialog>

    <footer class="site-footer"><div class="container footer-inner"><div><strong>{{ t.footer }}</strong><p>Vue · Vite · GitHub Pages</p></div><div class="footer-links"><a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub</a><a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a><a :href="`mailto:${contact.email}`">Email</a></div></div></footer>
  </div>
</template>
