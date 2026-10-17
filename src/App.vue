<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { contact, projects } from './data';
import { storeServiceCopy, storeExamples, bookingUrl } from './storeServices';
import ServiceEstimator from './ServiceEstimator.vue';
import PortfolioWorkbench from './PortfolioWorkbench.vue';
import { vReveal, usePortfolioMotion } from './portfolioMotion';
import { professionalProfile } from './profile';
import { downloadResumePdf } from './resumePdf';
import { technologyStyle } from './technologyColors';

const assetBase = import.meta.env.BASE_URL;

const language = ref(localStorage.getItem('language') || 'es');
const darkMode = ref(localStorage.getItem('darkMode') === 'true');
const currentRoute = ref(window.location.hash.slice(1) || 'home');
const showServicePrices = computed(() => ['precios', '/precios', 'services/precios'].includes(currentRoute.value));
const isServiceRoute = computed(() => currentRoute.value === 'services' || showServicePrices.value);
usePortfolioMotion(currentRoute);
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
    home: 'Inicio', projects: 'Proyectos', services: 'Gestión de tiendas', about: 'Sobre mí', contact: 'Contacto',
    portraitRole: 'Desarrollador full stack · Buenos Aires', proofLabel: 'Trabajo actual', proofStatus: 'Plataforma de e-commerce en producción', proofCopy: 'Construcción desde cero y evolución continua dentro de un equipo.', proofPoints: ['Frontend, backend y APIs', 'Diseño, UX y producto', 'IA y automatización aplicadas'],
    greeting: 'Hola, soy', role: 'Desarrollador full stack · Seguridad · IA',
    hero: 'Soy desarrollador full stack en VendoAlgo, donde construí la plataforma desde cero junto a un equipo y sigo impulsando su evolución. Trabajo entre frontend, backend, APIs y experiencia de usuario; integro IA y automatización cuando resuelven una necesidad real, con una mirada atenta a la seguridad.',
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
    contactTitle: 'Contactame', contactIntro: 'Si tenés una tienda, una idea o una tarea que querés delegar, elegí cómo te resulta más cómodo contactarme. Leo y respondo yo.', contactPersonal: 'Vas a hablar directamente conmigo, Pedro.', contactBook: 'Coordinar un Meet de 30 minutos', contactBookEyebrow: 'SI PREFERÍS CONVERSAR', contactBookText: 'Elegí un horario disponible y nos conectamos por Google Meet.', contactWhatsappTitle: 'Escribime por WhatsApp', contactWhatsappText: 'Para una consulta corta o para empezar por un mensaje.', contactEmailTitle: 'Mandame un correo', contactEmailText: 'Ideal para explicar con más detalle qué necesitás.', contactLinkedinTitle: 'Conectemos en LinkedIn', contactLinkedinText: 'Mirá mi experiencia profesional y escribime por ahí.', contactScheduleHint: 'Ver horarios disponibles', contactWhatsAppMessage: 'Hola Pedro, vi tu portfolio y quería consultarte sobre tus servicios.', contactGuideTitle: '¿Qué me podés contar?', contactGuideIntro: 'Con un poco de contexto puedo orientarte mejor:', contactGuideOne: 'Qué vende tu negocio o qué proyecto estás pensando', contactGuideTwo: 'Qué tarea, problema o proceso querés resolver', contactGuideThree: 'Qué herramientas o sistemas usás hoy, si aplica', contactFormNote: 'Al abrir el correo, vas a poder revisar el mensaje antes de enviarlo.',
    sendMessage: 'Mandame un correo con contexto', response: 'Al abrir el correo, vas a poder revisar el mensaje antes de enviarlo.',
    name: 'Nombre', email: 'Email', subject: 'Asunto', message: 'Mensaje', send: 'Abrir correo',
    required: 'Completá todos los campos para preparar el mensaje.', emailLabel: 'Email directo',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Perfil profesional', locationLabel: 'Ubicación',
    remote: 'Disponible para trabajo remoto', faq: 'Preguntas frecuentes',
    faqOne: '¿Trabajás con equipos remotos?', faqOneAnswer: 'Sí. Estoy acostumbrado a colaborar con herramientas digitales, Git y comunicación asincrónica.',
    faqTwo: '¿Qué tipo de proyectos te interesan?', faqTwoAnswer: 'Desarrollo full stack, integración de IA, automatización y proyectos de ciberseguridad, además de productos web que resuelvan problemas reales.',
    workflowTitle: 'Cómo trabajo con IA', workflowText: 'Primero defino la estructura, las restricciones y el resultado esperado. Después uso IA para implementar, explorar alternativas y depurar; finalmente valido comportamiento, accesibilidad, diseño, seguridad y publicación.',
    footer: 'Portfolio de Pedro Méndez Carabán', tagline: 'Construyo y hago evolucionar productos web.', sourceCode: 'Ver código', liveDemo: 'Abrir demo', privateCode: 'Código privado', privateDemo: 'Demo privada', phpWarning: 'Demo académica desarrollada con Laravel/PHP. El servidor se activa al recibir visitas; la primera carga puede tardar alrededor de un minuto. Los datos son de prueba y pueden reiniciarse.', nodeWarning: 'Este proyecto necesita un servidor Node.js para funcionar; todavía no hay una demo pública configurada.', noDemo: 'Todavía no hay una demo pública configurada para este proyecto.',
    viewProject: 'Ver proyecto', demo: 'Ver demo', repository: 'Ver repositorio', resumeDownload: 'Descargar CV (PDF)', resumeSummary: 'Desarrollador full stack con experiencia en productos web, integración de IA y seguridad de aplicaciones. Desarrollo desde el frontend hasta las APIs y el backend, con foco en experiencia de usuario, rendimiento y mantenibilidad.', resumeProjectsTitle: 'Proyectos seleccionados', resumeGitHub: 'GitHub', resumeSite: 'Portfolio', resumePage: 'Portfolio', projectCount: 'proyectos catalogados', publicEvidence: 'demos públicas revisables', stackLabel: 'Trabajo con', stackText: 'código · UX · IA', openToWork: 'Abierto a oportunidades',
    roleLabel: 'Mi responsabilidad', highlightsLabel: 'Qué entregué', outcomeLabel: 'Resultado', academicProjects: 'Proyectos académicos', professionalProjects: 'Proyectos profesionales y propios', currentSite: 'Estás viendo este proyecto', inDevelopment: 'En desarrollo', developmentNotice: 'Proyecto en desarrollo. La presentación pública estará disponible después del lanzamiento.',
  },
  en: {
    demoEyebrow: 'Academic demo', demoTitle: 'Before you open the demo', demoWait: 'The demo starts when you visit it. The first load may take about a minute.', demoTime: 'Startup time', demoTimeValue: '≈ 1 min', demoData: 'Sample data · No real purchases', demoContinue: 'Open demo', demoCancel: 'Go back', demoClose: 'Close notice',
    home: 'Home', projects: 'Projects', services: 'Store management', about: 'About me', contact: 'Contact',
    portraitRole: 'Full-stack developer · Buenos Aires', proofLabel: 'Current role', proofStatus: 'E-commerce platform in production', proofCopy: 'Built from scratch and continuously evolved as part of a team.', proofPoints: ['Frontend, backend and APIs', 'Design, UX and product', 'Applied AI and automation'],
    greeting: "Hi, I'm", role: 'Full-stack developer · Security · AI',
    hero: 'I am a full-stack developer at VendoAlgo, where I helped build the platform from scratch as part of a team and continue to evolve it. I work across frontend, backend, APIs and user experience, adding AI and automation when they solve a real need, with security in mind.',
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
    contactTitle: 'Contact me', contactIntro: 'If you run a store, have an idea, or want to delegate a task, choose the way that works best for you. I read and reply personally.', contactPersonal: 'You’ll be speaking directly with me, Pedro.', contactBook: 'Book a 30-minute Meet', contactBookEyebrow: 'IF YOU WOULD RATHER TALK', contactBookText: 'Pick an available time and we’ll meet on Google Meet.', contactWhatsappTitle: 'Message me on WhatsApp', contactWhatsappText: 'For a quick question or to start with a message.', contactEmailTitle: 'Send me an email', contactEmailText: 'Best if you want to explain what you need in more detail.', contactLinkedinTitle: 'Connect on LinkedIn', contactLinkedinText: 'See my professional experience and reach out there.', contactScheduleHint: 'See available times', contactWhatsAppMessage: 'Hi Pedro, I saw your portfolio and would like to ask about your services.', contactGuideTitle: 'What should you include?', contactGuideIntro: 'A little context helps me point you in the right direction:', contactGuideOne: 'What your business sells or the project you have in mind', contactGuideTwo: 'The task, problem, or process you want to address', contactGuideThree: 'The tools or systems you use today, if relevant', contactFormNote: 'Your email app will open so you can review the message before sending.',
    sendMessage: 'Email me with some context', response: 'Your email app will open so you can review the message before sending.',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', send: 'Open email',
    required: 'Complete every field to prepare the message.', emailLabel: 'Direct email',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Professional profile', locationLabel: 'Location',
    remote: 'Available for remote work', faq: 'Frequently asked questions',
    faqOne: 'Do you work with remote teams?', faqOneAnswer: 'Yes. I am used to collaborating with digital tools, Git and asynchronous communication.',
    faqTwo: 'What kind of projects interest you?', faqTwoAnswer: 'Full-stack development, AI integration, automation and cybersecurity projects, as well as web products that solve real problems.',
    workflowTitle: 'How I work with AI', workflowText: 'I define the structure, constraints and expected outcome first. Then I use AI to implement, explore alternatives and debug; finally I validate behavior, accessibility, design, security and delivery.',
    footer: "Pedro Méndez Carabán's portfolio", tagline: 'I build and evolve web products.', sourceCode: 'View source', liveDemo: 'Open demo', privateCode: 'Private code', privateDemo: 'Private demo', phpWarning: 'Academic demo built with Laravel/PHP. The server starts when visited; the first load may take about a minute. Data is for demonstration and may reset.', nodeWarning: 'This project needs a Node.js server to run; there is no public demo configured yet.', noDemo: 'There is no public demo configured for this project yet.',
    viewProject: 'View project', demo: 'View demo', repository: 'View repository', resumeDownload: 'Download CV (PDF)', resumeSummary: 'Full-stack developer experienced in web products, AI integration and application security. I work across frontend, APIs and backend, focusing on user experience, performance and maintainability.', resumeProjectsTitle: 'Selected projects', resumeGitHub: 'GitHub', resumeSite: 'Portfolio', resumePage: 'Portfolio', projectCount: 'cataloged projects', publicEvidence: 'reviewable public demos', stackLabel: 'Work across', stackText: 'code · UX · AI', openToWork: 'Open to opportunities',
    roleLabel: 'My responsibility', highlightsLabel: 'What I delivered', outcomeLabel: 'Outcome', academicProjects: 'Academic projects', professionalProjects: 'Professional and personal projects', currentSite: 'You are viewing this project', inDevelopment: 'In development', developmentNotice: 'Project in development. A public presentation will be available after launch.',
  },
};

const t = computed(() => text[language.value]);
const servicePage = computed(() => storeServiceCopy[language.value]);
const featuredStore = storeExamples[0];
const otherStores = storeExamples.slice(1);
const failedServicePreviews = ref([]);
function onServicePreviewError(id) {
  if (!failedServicePreviews.value.includes(id)) failedServicePreviews.value.push(id);
}
function scrollToSection(id) {
  const element = document.getElementById(id);
  element?.focus({ preventScroll: true });
  element?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
const profile = computed(() => professionalProfile[language.value]);
const routeParts = computed(() => currentRoute.value.split('/').filter(Boolean));
function localizedProject(project) {
  if (language.value !== 'en') return project;
  return {
    ...project,
    title: project.titleEn || project.title,
    description: project.descriptionEn || project.description,
    shortDescription: project.shortDescriptionEn || project.shortDescription,
    category: project.categoryEn || project.category,
  };
}

const selectedProject = computed(() => {
  const project = projects.find((item) => item.slug === routeParts.value[1]);
  return project ? localizedProject(project) : undefined;
});
const technologies = computed(() => [...new Set(projects.flatMap((project) => project.technologies))].sort());
const filteredProjects = computed(() => projects.filter((project) => {
  const query = search.value.toLowerCase().trim();
  const searchableText = [project.title, project.titleEn, project.description, project.descriptionEn, project.shortDescription, project.shortDescriptionEn].filter(Boolean).join(' ');
  const matchesSearch = !query || searchableText.toLowerCase().includes(query);
  const matchesTechnology = !technology.value || project.technologies.includes(technology.value);
  return matchesSearch && matchesTechnology && (!featuredOnly.value || project.featured);
}).sort((a, b) => {
  if (a.academic !== b.academic) return a.academic ? 1 : -1;
  if (a.academic) return Number(b.startDate) - Number(a.startDate) || a.id - b.id;
  return (a.importance || 99) - (b.importance || 99);
}).map(localizedProject));
const professionalProjects = computed(() => projects
  .filter((project) => !project.academic)
  .sort((a, b) => (a.importance || 99) - (b.importance || 99))
  .map(localizedProject));
const academicProjects = computed(() => projects
  .filter((project) => project.academic)
  .sort((a, b) => Number(b.startDate) - Number(a.startDate) || a.id - b.id)
  .map(localizedProject));
const featuredProjects = computed(() => professionalProjects.value.filter((project) => project.featured));
const resumeProjects = computed(() => professionalProjects.value.filter((project) => project.role || project.roleEn).slice(0, 3));

// A project may have public source without a hosted demo.
function projectUrl(project) {
  return project.currentSite || project.demoType === 'development' ? null : project.live || null;
}

function projectButtonLabel(project) {
  return project.academic ? t.value.demo : t.value.viewProject;
}

function projectNumber(index) {
  return String(index + 1).padStart(2, '0');
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



function navigate(route) {
  window.location.hash = route;
  currentRoute.value = route;
  mobileMenuOpen.value = false;
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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

watch(language, (value) => {
  localStorage.setItem('language', value);
  document.documentElement.lang = value;
});
watch(darkMode, (value) => {
  localStorage.setItem('darkMode', String(value));
  document.documentElement.classList.toggle('dark', value);
});

onMounted(() => {
  document.documentElement.lang = language.value;
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
      <div v-if="isServiceRoute" class="container buyer-header">
        <div class="buyer-header-identity">
          <a class="brand" href="#home" @click.prevent="navigate('home')">Pedro Méndez Carabán</a>
        </div>
        <nav :aria-label="t.services" class="buyer-header-links">
          <a class="button button-primary" :href="bookingUrl" target="_blank" rel="noopener noreferrer">{{ servicePage.book }} ↗</a>
        </nav>
        <div class="buyer-header-tools">
          <button class="icon-button language-button" type="button" :aria-label="language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'" :title="language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'" @click="toggleLanguage">
            <svg v-if="language === 'es'" class="language-flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#75aadb"/><path fill="#fff" d="M0 5.33h24v5.34H0z"/><circle cx="12" cy="8" r="1.65" fill="#f6b40e"/><path stroke="#c89508" stroke-width=".45" d="M12 5.8v4.4M9.8 8h4.4m-.25-1.55-3.1 3.1m0-3.1 3.1 3.1"/></svg>
            <svg v-else class="language-flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#1f3c88"/><path d="m0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="4"/><path d="m0 0 24 16M24 0 0 16" stroke="#c8102e" stroke-width="1.5"/><path stroke="#fff" stroke-width="6" d="M12 0v16M0 8h24"/><path stroke="#c8102e" stroke-width="3" d="M12 0v16M0 8h24"/></svg>
          </button>
          <button class="icon-button theme-button" type="button" :aria-label="language === 'es' ? (darkMode ? 'Activar tema claro' : 'Activar tema oscuro') : (darkMode ? 'Switch to light theme' : 'Switch to dark theme')" :title="language === 'es' ? (darkMode ? 'Activar tema claro' : 'Activar tema oscuro') : (darkMode ? 'Switch to light theme' : 'Switch to dark theme')" :aria-pressed="darkMode" @click="toggleTheme">
            <svg v-if="darkMode" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
            <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 15.1A8.7 8.7 0 0 1 8.9 3.8 8.8 8.8 0 1 0 20.2 15.1Z"/></svg>
          </button>
        </div>
      </div>
      <div v-else class="container nav-wrap">
        <a class="brand" href="#home" @click.prevent="navigate('home')">Pedro Méndez Carabán</a>
        <button class="menu-button" type="button" aria-label="Abrir menú de navegación" :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = !mobileMenuOpen">☰</button>
        <nav :class="{ 'is-open': mobileMenuOpen }" class="site-nav" aria-label="Navegación principal">
          <a :class="{ active: currentRoute === 'home' }" href="#home" @click.prevent="navigate('home')">{{ t.home }}</a>
          <a :class="{ active: currentRoute === 'projects' || currentRoute.startsWith('project/') }" href="#projects" @click.prevent="navigate('projects')">{{ t.projects }}</a>
          <a :class="{ active: isServiceRoute }" href="#services" @click.prevent="navigate('services')">{{ t.services }}</a>
          <a :class="{ active: currentRoute === 'about' }" href="#about" @click.prevent="navigate('about')">{{ t.about }}</a>
          <a :class="{ active: currentRoute === 'contact' }" href="#contact" @click.prevent="navigate('contact')">{{ t.contact }}</a>
        </nav>
        <div class="nav-actions">
          <button class="icon-button language-button" type="button" :aria-label="language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'" :title="language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'" @click="toggleLanguage">
            <svg v-if="language === 'es'" class="language-flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#75aadb"/><path fill="#fff" d="M0 5.33h24v5.34H0z"/><circle cx="12" cy="8" r="1.65" fill="#f6b40e"/><path stroke="#c89508" stroke-width=".45" d="M12 5.8v4.4M9.8 8h4.4m-.25-1.55-3.1 3.1m0-3.1 3.1 3.1"/></svg>
            <svg v-else class="language-flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#1f3c88"/><path d="m0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="4"/><path d="m0 0 24 16M24 0 0 16" stroke="#c8102e" stroke-width="1.5"/><path stroke="#fff" stroke-width="6" d="M12 0v16M0 8h24"/><path stroke="#c8102e" stroke-width="3" d="M12 0v16M0 8h24"/></svg>
          </button>
          <button class="icon-button theme-button" type="button" :aria-label="darkMode ? 'Light mode' : 'Dark mode'" :title="darkMode ? 'Light mode' : 'Dark mode'" :aria-pressed="darkMode" @click="toggleTheme">
            <svg v-if="darkMode" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
            <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 15.1A8.7 8.7 0 0 1 8.9 3.8 8.8 8.8 0 1 0 20.2 15.1Z"/></svg>
          </button>
        </div>
      </div>
    </header>

    <main :key="currentRoute" class="route-view">
      <section v-if="currentRoute === 'home'" class="hero">
        <div class="container hero-content">
        <div class="hero-layout">
          <div class="hero-main">
          <p class="eyebrow">{{ t.role }} <span class="eyebrow-dot"></span> Buenos Aires</p>
          <div class="hero-intro">
            <h1 class="hero-heading"><span class="hero-greeting">{{ t.greeting }}</span><span class="visually-hidden">Pedro.</span><span class="hero-name" aria-hidden="true"><span v-for="(letter, index) in 'Pedro.'" :key="index" class="hero-letter" :style="{ '--letter-index': index }" aria-hidden="true">{{ letter }}</span></span><em>{{ t.tagline }}</em></h1>
            <img class="hero-mobile-portrait" :src="assetBase + 'pedro-portrait.jpg'" alt="Pedro Martín Méndez Carabán" width="106" height="120" decoding="async">
          </div>
          <p class="hero-copy"><span class="hero-desktop-only">{{ t.hero }}</span><span class="hero-mobile-only">{{ language === 'es' ? 'Desarrollo productos web de punta a punta. En VendoAlgo construí la plataforma desde cero junto al equipo y hoy sigo trabajando en su evolución.' : 'I build web products end to end. At VendoAlgo, I built the platform from scratch with the team and continue to develop it today.' }}</span></p>
          <div class="button-row">
            <button class="button button-download" type="button" :aria-label="t.resumeDownload" @click="downloadResume"><span class="hero-desktop-only">{{ t.resumeDownload }}</span><span class="hero-mobile-only">CV (PDF) <span aria-hidden="true">↓</span></span></button>
            <a class="button button-light" href="#projects" @click.prevent="navigate('projects')">{{ t.viewProjects }}</a>
            <a class="button button-outline" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a>
          </div>
          <a class="hero-mobile-work" href="#project/vendoalgo" @click.prevent="navigate('project/vendoalgo')"><span>{{ t.proofLabel }}</span><strong>VendoAlgo</strong><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 16 16 4M4 4h12v12"/></svg></a>
          </div>
          <aside class="hero-person">
            <figure class="hero-portrait">
              <img :src="assetBase + 'pedro-portrait.jpg'" alt="Pedro Martín Méndez Carabán" width="666" height="888" fetchpriority="high" decoding="async">
              <figcaption><strong>Pedro Méndez Carabán</strong><span>{{ t.portraitRole }}</span></figcaption>
            </figure>
            <a class="hero-work" href="#project/vendoalgo" @click.prevent="navigate('project/vendoalgo')"><span>{{ t.proofLabel }}</span><strong>VendoAlgo</strong></a>
          </aside>
        </div>
          <div class="hero-meta"><span>{{ projects.length }} {{ t.projectCount }}</span><span>{{ projects.filter((project) => project.live).length }} {{ t.publicEvidence }}</span><span>{{ t.stackLabel }}: {{ t.stackText }}</span></div>
          <a class="hero-explore" href="#portfolio-playground" @click.prevent="scrollToSection('portfolio-playground')"><span>{{ language === 'es' ? 'Explorá cómo trabajo' : 'Explore how I work' }}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a>
        </div>
      </section>

      <template v-if="currentRoute === 'home'">
        <PortfolioWorkbench :language="language" v-reveal />
        <section class="section">
          <div class="container">
            <div class="section-heading section-heading-left" v-reveal><p class="eyebrow">01 / {{ t.skills }}</p><h2>{{ t.skills }}</h2><p>{{ t.skillsIntro }}</p></div>
            <div class="skill-grid">
              <div v-for="(area, index) in profile.skills.slice(0, 4)" :key="area.title" class="skill-card" v-reveal="index * 50"><span class="skill-number" aria-hidden="true">0{{ index + 1 }}</span><strong>{{ area.title }}</strong><span>{{ (area.homeItems || area.items.slice(0, 3)).join(' · ') }}</span><small v-if="area.focus">{{ area.focus }}</small></div>
            </div>
          </div>
        </section>
        <section class="section section-muted">
          <div class="container"><div class="section-heading section-heading-left" v-reveal><p class="eyebrow">02 / {{ t.featured }}</p><h2>{{ t.featured }}</h2><p>{{ t.featuredIntro }}</p></div><div class="project-grid"><article v-for="(project, index) in featuredProjects" :key="project.id" class="project-card" v-reveal="(index % 3) * 55" :class="{ 'project-card-lead': project.id === 1 }"><div class="project-image"><img :src="project.image" :alt="project.title"><span class="project-number">{{ projectNumber(index) }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div><div class="center"><a class="button button-primary" href="#projects" @click.prevent="navigate('projects')">{{ t.allProjects }}</a></div></div>
        </section>
        <section class="section academic-preview"><div class="container"><h2 class="category-divider">{{ t.academicProjects }}</h2><div class="project-grid"><article v-for="(project, index) in academicProjects.slice(0, 3)" :key="project.id" class="project-card academic-card" v-reveal="(index % 3) * 55"><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="card-actions"><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }} →</a></div></div></article></div></div></section>
        <section class="availability"><div class="container availability-inner" v-reveal><div><p class="eyebrow">{{ t.availability }}</p><h2>{{ t.availability }}</h2><p>{{ t.availabilityText }}</p></div><a class="button button-light" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a></div></section>
      </template>

      <section v-else-if="currentRoute === 'projects'" class="section page-section">
        <div class="container"><div class="section-heading section-heading-left" v-reveal><p class="eyebrow">03 / {{ t.projects }}</p><h1>{{ t.myProjects }}</h1><p>{{ t.projectsIntro }}</p></div><div class="filters"><input v-model="search" type="search" :aria-label="t.search" :placeholder="t.search"><select v-model="technology" :aria-label="t.allTechnologies"><option value="">{{ t.allTechnologies }}</option><option v-for="item in technologies" :key="item" :value="item">{{ item }}</option></select><label><input v-model="featuredOnly" type="checkbox"> {{ t.onlyFeatured }}</label><button v-if="search || technology || featuredOnly" class="text-button" type="button" @click="search = ''; technology = ''; featuredOnly = false">{{ t.clear }}</button></div><p class="result-count">{{ filteredProjects.length }} {{ t.results }}</p><h2 v-if="filteredProjects.some((project) => !project.academic)" class="category-divider">{{ t.professionalProjects }}</h2><div v-if="filteredProjects.length" class="project-grid"><article v-for="(project, index) in filteredProjects.filter((item) => !item.academic)" :key="project.id" class="project-card" v-reveal="(index % 3) * 55"><div class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">{{ projectNumber(index) }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div><div v-else class="empty-state"><h2>{{ t.noResults }}</h2><p>{{ t.adjust }}</p></div><h2 v-if="filteredProjects.some((project) => project.academic)" class="category-divider">{{ t.academicProjects }}</h2><div class="project-grid"><article v-for="(project, index) in filteredProjects.filter((item) => item.academic)" :key="project.id" class="project-card academic-card" v-reveal="(index % 3) * 55"><div v-if="project.preview" class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">{{ projectNumber(index) }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div></div>
      </section>

      <section v-else-if="isServiceRoute" class="section page-section buyer-page">
        <div class="container">
          <header class="buyer-hero">
            <p class="eyebrow">{{ servicePage.eyebrow }}</p>
            <h1>{{ servicePage.title }}</h1>
            <p class="buyer-lead">{{ servicePage.lead }}</p>
            <div class="button-row">
              <button type="button" class="button button-primary" @click="scrollToSection('service-scope')">{{ language === 'es' ? (showServicePrices ? 'Ver servicios y rangos' : 'Ver servicios') : (showServicePrices ? 'See services and price ranges' : 'See services') }} ↓</button>
              <button type="button" class="buyer-inline-link" @click="scrollToSection('service-case')">{{ language === 'es' ? 'Ver un caso real' : 'See a real example' }} ↓</button>
            </div>
          </header>

          <section id="service-case" class="buyer-case buyer-section" tabindex="-1" aria-labelledby="service-case-title">
            <div class="buyer-case-top">
              <header>
                <p class="eyebrow">{{ servicePage.caseEyebrow }}</p>
                <h2 id="service-case-title">{{ servicePage.caseTitle }}</h2>
                <p>{{ servicePage.caseIntro }}</p>
                <a class="button button-secondary" :href="featuredStore.url" target="_blank" rel="noopener noreferrer">{{ servicePage.visit }} ↗</a>
              </header>
              <a class="buyer-store-preview" :href="featuredStore.url" :aria-label="servicePage.visit" target="_blank" rel="noopener noreferrer">
                <img v-if="!failedServicePreviews.includes(featuredStore.id)" :src="featuredStore.preview" :alt="servicePage.previewAlt + ' ' + featuredStore.name" width="1100" height="532" loading="lazy" @error="onServicePreviewError(featuredStore.id)">
                <span v-else class="buyer-preview-fallback">{{ servicePage.previewMissing }}</span>
                <span class="buyer-domain">{{ featuredStore.domain }} ↗</span>
              </a>
            </div>
            <details class="buyer-case-details">
              <summary>{{ language === 'es' ? 'Qué hice en FumigAR' : 'What I did for FumigAR' }}</summary>
            <div class="buyer-work-grid">
              <article v-for="(group, index) in servicePage.caseGroups" :key="group.title" :class="{ 'buyer-work-featured': index === 2 }">
                <span class="buyer-number">0{{ index + 1 }}</span>
                <h3>{{ group.title }}</h3>
                <ul><li v-for="item in group.items" :key="item">{{ item }}</li></ul>
              </article>
            </div>
            <p class="buyer-small buyer-proof-note">{{ servicePage.publicNote }}</p>
            </details>
          </section>

          <section id="service-scope" class="buyer-section" tabindex="-1" aria-labelledby="service-scope-title">
            <ServiceEstimator :language="language" :show-prices="showServicePrices" />
          </section>

          <details class="buyer-more buyer-section">
            <summary>{{ servicePage.otherTitle }}</summary>
            <p>{{ servicePage.otherIntro }}</p>
            <div class="buyer-other-grid">
              <a v-for="store in otherStores" :key="store.id" class="buyer-store-card" :href="store.url" target="_blank" rel="noopener noreferrer">
                <div class="buyer-store-preview">
                  <img v-if="!failedServicePreviews.includes(store.id)" :src="assetBase + store.preview" :alt="servicePage.previewAlt + ' ' + store.name" width="1100" height="532" loading="lazy" @error="onServicePreviewError(store.id)">
                  <span v-else class="buyer-preview-fallback">{{ servicePage.previewMissing }}</span>
                  <span class="buyer-domain">{{ store.domain }} ↗</span>
                </div>
                <div class="buyer-store-caption"><h3>{{ store.name }}</h3><p>{{ store.description[language] }}</p><span class="text-link">{{ servicePage.visitStore }} ↗</span></div>
              </a>
            </div>
          </details>

          <aside class="buyer-person">
            <img :src="assetBase + 'pedro-portrait.jpg'" alt="Pedro Méndez Carabán" width="88" height="108" loading="lazy">
            <div><h2>{{ servicePage.personTitle }}</h2><p>{{ servicePage.personText }}</p>
              <div class="button-row"><a class="text-link" href="#about" @click.prevent="navigate('about')">{{ servicePage.profile }} →</a></div>
            </div>
          </aside>

          <section class="buyer-final">
            <div><p class="eyebrow">{{ servicePage.finalEyebrow }}</p><h2>{{ servicePage.finalTitle }}</h2><p>{{ servicePage.finalText }}</p></div>
            <div class="buyer-final-actions">
              <a class="button button-light" :href="bookingUrl" target="_blank" rel="noopener noreferrer">{{ servicePage.book }} ↗</a>
              <a class="buyer-inline-link" :href="'mailto:' + contact.email + '?subject=' + encodeURIComponent(servicePage.mailSubject)">{{ servicePage.contact }} →</a>
            </div>
          </section>
        </div>
      </section>

      <section v-else-if="currentRoute === 'about'" class="section page-section cv-about">
        <div class="container">
          <div class="cv-intro-layout"><header class="cv-intro" v-reveal><p class="eyebrow">04 / {{ t.about }}</p><h1>{{ t.aboutTitle }}</h1><p class="cv-lead">{{ t.aboutIntro }}</p><p>{{ t.storyOne }}</p><p>{{ t.storyTwo }}</p><div class="cv-intro-actions"><button class="button button-primary" type="button" @click="downloadResume">{{ t.resumeDownload }}</button></div></header>
            <figure class="about-portrait" v-reveal="100"><img :src="assetBase + 'pedro-about.png'" alt="Pedro Martín Méndez Carabán" width="666" height="888" loading="lazy" decoding="async"></figure>
          </div>
          <div class="cv-layout">
            <div>
              <section class="cv-section" aria-labelledby="cv-experience-title">
                <h2 id="cv-experience-title">{{ profile.experienceTitle }}</h2>
                <div class="cv-timeline">
                  <article v-for="experience in profile.experience" :key="experience.role" class="cv-position" v-reveal>
                    <p class="cv-period">{{ experience.period }}</p><h3>{{ experience.role }}</h3><p class="cv-organization">{{ experience.organization }}</p>
                    <ul><li v-for="item in experience.items" :key="item">{{ item }}</li></ul>
                  </article>
                </div>
              </section>
              <section class="cv-section" aria-labelledby="cv-education-title">
                <h2 id="cv-education-title">{{ profile.educationTitle }}</h2>
                <article v-for="education in profile.education" :key="education.title" class="cv-education" v-reveal>
                  <p class="cv-period">{{ education.period }}</p><h3>{{ education.title }}</h3><p class="cv-organization">{{ education.institution }}</p><span class="cv-status">{{ education.status }}</span><p>{{ education.description }}</p>
                </article>
              </section>
              <section class="cv-section" aria-labelledby="cv-courses-title">
                <h2 id="cv-courses-title">{{ profile.coursesTitle }}</h2>
                <div v-for="course in profile.courses" :key="course.title" class="cv-course"><h3>{{ course.title }}</h3><p>{{ course.text }}</p></div>
              </section>
            </div>
            <aside class="cv-sidebar">
              <section class="info-panel"><h2>{{ profile.skillsTitle }}</h2><div v-for="area in profile.skills" :key="area.title" class="cv-skill-area"><h3>{{ area.title }}</h3><div class="tag-row"><span v-for="item in area.items" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div></div></section>
              <section class="info-panel"><h2>{{ profile.languagesTitle }}</h2><p>{{ profile.languages }}</p><div class="quote-box"><strong>{{ profile.strengthsTitle }}</strong><p>{{ profile.strengths }}</p></div></section>
              <section class="info-panel"><h2>{{ t.workflowTitle }}</h2><p>{{ t.workflowText }}</p></section>
            </aside>
          </div>
        </div>
      </section>

      <section v-else-if="currentRoute === 'contact'" class="section page-section contact-page">
        <div class="container">
          <header class="contact-hero" v-reveal>
            <div>
              <p class="eyebrow">{{ t.contact }}</p>
              <h1>{{ t.contactTitle }}</h1>
              <p class="contact-hero-copy">{{ t.contactIntro }}</p>
              <p class="contact-personal"><span aria-hidden="true"></span>{{ t.contactPersonal }}</p>
            <a class="button button-light contact-hero-cta" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ32S-DKDk1irg5ODqUJGUMKz41FLTRoLJh0gwUDu18GhqYozyuLcLxKTE955yYV592Tg0iRFsMQ" target="_blank" rel="noopener noreferrer">{{ t.contactBook }} <span aria-hidden="true">↗</span></a>
            </div>
          </header>

          <div class="contact-methods">
            <a class="contact-method" v-reveal :href="`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(t.contactWhatsAppMessage)}`" target="_blank" rel="noopener noreferrer">
              <span class="contact-method-icon contact-icon-whatsapp" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 9.2c.5 2.3 2.3 4 4.7 4.7l1.1-1.1 2 .9c-.2 1.2-.9 1.9-2.2 2-3.7-.4-7-3.6-7.3-7.2.1-1.3.8-2 2-2.2l.9 2Z"/></svg></span>
              <span class="contact-method-copy"><span class="eyebrow">{{ t.whatsappLabel }}</span><strong>{{ t.contactWhatsappTitle }}</strong><span>{{ t.contactWhatsappText }}</span><em>{{ contact.phone }} ↗</em></span>
            </a>
            <a class="contact-method" v-reveal :href="`mailto:${contact.email}`">
              <span class="contact-method-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span>
              <span class="contact-method-copy"><span class="eyebrow">{{ t.emailLabel }}</span><strong>{{ t.contactEmailTitle }}</strong><span>{{ t.contactEmailText }}</span><em>{{ contact.email }} ↗</em></span>
            </a>
            <a class="contact-method" v-reveal :href="contact.linkedin" target="_blank" rel="noopener noreferrer">
              <span class="contact-method-icon contact-icon-in" aria-hidden="true">in</span>
              <span class="contact-method-copy"><span class="eyebrow">{{ t.linkedinLabel }}</span><strong>{{ t.contactLinkedinTitle }}</strong><span>{{ t.contactLinkedinText }}</span><em>LinkedIn ↗</em></span>
            </a>
          </div>

          <div class="two-columns contact-layout contact-followup">
            <section class="contact-form-panel">
              <p class="eyebrow">{{ t.emailLabel }}</p><h2>{{ t.sendMessage }}</h2><p class="muted">{{ t.contactFormNote }}</p>
              <form @submit.prevent="submitContact"><label>{{ t.name }}<input v-model="form.name" type="text" required></label><label>{{ t.email }}<input v-model="form.email" type="email" required></label><label>{{ t.subject }}<input v-model="form.subject" type="text" required></label><label>{{ t.message }}<textarea v-model="form.message" rows="5" required></textarea></label><p v-if="formError" class="form-error">{{ formError }}</p><button class="button button-primary" type="submit">{{ t.send }} ↗</button></form>
            </section>
            <aside class="contact-guide">
              <p class="eyebrow">{{ t.contact }}</p><h2>{{ t.contactGuideTitle }}</h2><p>{{ t.contactGuideIntro }}</p>
              <ul><li>{{ t.contactGuideOne }}</li><li>{{ t.contactGuideTwo }}</li><li>{{ t.contactGuideThree }}</li></ul>
              <p class="contact-guide-signoff">{{ t.contactPersonal }}</p>
            </aside>
          </div>
        </div>
      </section>

      <section v-else-if="routeParts[0] === 'project' && selectedProject" class="section page-section"><div class="container project-detail"><div class="detail-main"><p class="eyebrow">{{ selectedProject.category }} · {{ selectedProject.startDate }}</p><h1>{{ selectedProject.title }}</h1><p class="lead">{{ selectedProject.shortDescription }}</p><img v-if="!selectedProject.academic || selectedProject.preview" :src="selectedProject.image" :alt="selectedProject.title"><h2>{{ t.projectDescription }}</h2><p>{{ selectedProject.description }}</p><div v-if="selectedProject.role || selectedProject.highlights || selectedProject.outcome" class="case-study"><div v-if="selectedProject.role"><p class="eyebrow">{{ t.roleLabel }}</p><p>{{ language === 'es' ? selectedProject.role : selectedProject.roleEn }}</p></div><div v-if="selectedProject.highlights"><p class="eyebrow">{{ t.highlightsLabel }}</p><ul><li v-for="highlight in (language === 'es' ? selectedProject.highlights : selectedProject.highlightsEn)" :key="highlight">{{ highlight }}</li></ul></div><div v-if="selectedProject.outcome"><p class="eyebrow">{{ t.outcomeLabel }}</p><p>{{ language === 'es' ? selectedProject.outcome : selectedProject.outcomeEn }}</p></div></div></div><aside class="info-panel"><h2>{{ t.projectDetails }}</h2><div class="tag-row large-tags"><span v-for="item in selectedProject.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><a v-if="selectedProject.github && !selectedProject.private" class="button button-secondary full-width" :href="selectedProject.github" target="_blank" rel="noopener noreferrer">{{ t.sourceCode }} ↗</a><a v-if="selectedProject.live" class="button button-primary full-width" :href="selectedProject.live" @click="confirmDemoStart($event, selectedProject)" :target="selectedProject.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ t.liveDemo }} ↗</a><div v-if="selectedProject.demoType === 'development'" class="project-notice"><strong>{{ t.inDevelopment }}</strong>{{ t.developmentNotice }}</div><div v-else-if="selectedProject.currentSite" class="project-notice">{{ t.currentSite }}</div><div v-else-if="selectedProject.demoType === 'private'" class="project-notice">{{ t.privateDemo }}<span>{{ t.privateCode }}</span></div><div v-else-if="selectedProject.demoType === 'php'" class="project-notice project-notice-warning">{{ t.phpWarning }}</div><div v-else-if="!selectedProject.live && selectedProject.demoType === 'node'" class="project-notice project-notice-warning">{{ t.nodeWarning }}</div><div v-else-if="!selectedProject.live" class="project-notice">{{ t.noDemo }}</div><a class="text-link back-link" href="#projects" @click.prevent="navigate('projects')">← {{ t.back }}</a></aside></div></section>
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

    <footer class="site-footer"><div class="container footer-inner"><div><strong>{{ t.footer }}</strong><p v-if="!isServiceRoute">Vue · Vite · GitHub Pages</p></div><div class="footer-links"><a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub</a><a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a><a :href="`mailto:${contact.email}`">Email</a></div></div></footer>
  </div>
</template>
