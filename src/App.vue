<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { contact, projects } from './data';
import { storeServiceCopy, storeExamples, bookingUrl } from './storeServices';
import ServiceEstimator from './ServiceEstimator.vue';
import StoreServiceGuide from './StoreServiceGuide.vue';
import VenturesPage from './VenturesPage.vue';
import PortfolioWorkbench from './PortfolioWorkbench.vue';
import ProjectTechnicalCase from './ProjectTechnicalCase.vue';
import { vReveal, usePortfolioMotion } from './portfolioMotion';
import HttpErrorPage from './HttpErrorPage.vue';
import { resolveRouteStatus } from './httpErrors';
import { appFailure } from './appFailure';
import { professionalProfile, skillAreaFor } from './profile';
import { downloadResumePdf } from './resumePdf';
import { readLanguage, readTheme, savePreference } from './preferences';
import { normalizeRoute, routeFromLocation } from './routes';

const assetBase = import.meta.env.BASE_URL;

const language = ref(readLanguage());
const darkMode = ref(readTheme());
const currentRoute = ref(routeFromLocation(window.location, assetBase));
const showServicePrices = computed(() => currentRoute.value === 'precios');
const isServiceRoute = computed(() => currentRoute.value === 'services' || showServicePrices.value);
usePortfolioMotion(currentRoute);
const search = ref('');
const technology = ref('');
const featuredOnly = ref(false);
const mobileMenuOpen = ref(false);
const venturesMenuOpen = ref(false);
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
    profileSummary: 'Datos profesionales', heroFacts: [{"title":"Experiencia","description":"Desarrollo web desde 2020"},{"title":"Trabajo actual","description":"Full stack en VendoAlgo","route":"project/vendoalgo"},{"title":"Modalidad","description":"Remoto · Buenos Aires (UTC−3)"}],
    greeting: 'Hola, soy', role: 'Desarrollador full stack · Seguridad · IA',
    hero: 'Me importa cómo está programado un proyecto, pero también cómo se ve, qué comunica y cómo se usa en cada pantalla. Pienso en quien compra, quien vende, quien administra, quien se pierde y quien intenta encontrar una falla. Me gusta recorrer esas situaciones y cuidar que cada persona reciba la respuesta que necesita.',
    viewProjects: 'Ver proyectos', talk: 'Hablemos', featured: 'Proyectos destacados',
    featuredIntro: 'Una selección curada de demos públicas y proyectos profesionales. El resto del catálogo separa claramente trabajos académicos y experiencias privadas.',
    allProjects: 'Ver todos los proyectos', skills: 'Desarrollo full stack, IA y seguridad',
    skillsIntro: 'Combino desarrollo de producto, integración de servicios y automatización. Estas son las áreas en las que puedo aportar, con ejemplos de mi trabajo.',
    availabilityEyebrow: 'Contacto',
    availability: '¿Tenés una propuesta?',
    availabilityText: 'Contame de qué se trata y vemos si podemos trabajar juntos.',
    myProjects: 'Mis proyectos', projectsIntro: 'Proyectos profesionales, demos públicas y trabajos académicos, con enlaces y alcance identificados para revisar cada experiencia con contexto.',
    search: 'Buscar por nombre o descripción', allTechnologies: 'Todas las tecnologías', onlyFeatured: 'Solo destacados',
    clear: 'Limpiar filtros', results: 'proyecto(s)', noResults: 'No se encontraron proyectos',
    adjust: 'Probá ajustar los filtros para ver más resultados.', details: 'Ver detalles',
    privateProject: 'Proyecto privado', featuredTag: 'Destacado', github: 'GitHub', demo: 'Ver proyecto',
    projectDescription: 'Descripción del proyecto', projectDetails: 'Detalles del proyecto',
    technologies: 'Tecnologías utilizadas', back: 'Volver a proyectos', aboutTitle: 'Sobre mí',
    aboutIntro: 'Soy Pedro Martín Méndez Carabán. Combino desarrollo full stack, investigación de seguridad e integración de IA para construir productos web con una mirada integral.',
    story: 'Mi recorrido', storyOne: 'Desde 2020 trabajo en proyectos web independientes. Actualmente soy programador en el equipo de VendoAlgo, donde desarrollé la plataforma desde cero y sigo participando en su evolución.',
    storyTwo: 'Mi recorrido también incluye UX, diseño, marketing y una extensión para Chrome. La investigación de vulnerabilidades y mis estudios de Abogacía suman una perspectiva sobre seguridad, privacidad y contexto de uso.',
    education: 'Formación', educationText: 'Tecnicatura Superior en Diseño y Programación Web — Escuela Da Vinci. Tesis pendiente.',
    contactTitle: 'Contactame', contactIntro: 'Si querés acercarme una propuesta, un proyecto o una colaboración, elegí cómo contactarme. Contame de qué se trata y lo conversamos.', contactPersonal: 'Vas a hablar directamente conmigo, Pedro.', contactBook: 'Coordinar un Meet de 30 minutos', contactBookEyebrow: 'SI PREFERÍS CONVERSAR', contactBookText: 'Elegí un horario disponible y nos conectamos por Google Meet.', contactWhatsappTitle: 'Escribime por WhatsApp', contactWhatsappText: 'Para una consulta corta o para empezar por un mensaje.', contactEmailTitle: 'Mandame un correo', contactEmailText: 'Ideal para explicar con más detalle qué necesitás.', contactLinkedinTitle: 'Conectemos en LinkedIn', contactLinkedinText: 'Mirá mi experiencia profesional y escribime por ahí.', contactScheduleHint: 'Ver horarios disponibles', contactWhatsAppMessage: 'Hola Pedro, vi tu portfolio y quería acercarte una propuesta.', contactGuideTitle: '¿Qué me podés contar?', contactGuideIntro: 'Con un poco de contexto puedo orientarte mejor:', contactGuideOne: 'De qué se trata la propuesta o el proyecto', contactGuideTwo: 'Qué necesitás resolver y cómo te gustaría que participe', contactGuideThree: 'El contexto, los plazos y las herramientas que usan, si aplica', contactFormNote: 'Al abrir el correo, vas a poder revisar el mensaje antes de enviarlo.',
    sendMessage: 'Mandame un correo con contexto', response: 'Al abrir el correo, vas a poder revisar el mensaje antes de enviarlo.',
    name: 'Nombre', email: 'Email', subject: 'Asunto', message: 'Mensaje', send: 'Abrir correo',
    required: 'Completá todos los campos para preparar el mensaje.', emailLabel: 'Email directo',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Perfil profesional', locationLabel: 'Ubicación',
    remote: 'Trabajo remoto desde Buenos Aires', faq: 'Preguntas frecuentes',
    faqOne: '¿Trabajás con equipos remotos?', faqOneAnswer: 'Sí. Estoy acostumbrado a colaborar con herramientas digitales, Git y comunicación asincrónica.',
    faqTwo: '¿Qué tipo de proyectos te interesan?', faqTwoAnswer: 'Desarrollo full stack, integración de IA, automatización y proyectos de ciberseguridad, además de productos web que resuelvan problemas reales.',
    workflowTitle: 'Cómo valido una entrega', workflowText: 'Primero, el código debe superar las pruebas automatizadas con Pest. Después realizo revisión y pruebas asistidas por IA. Por último, valido manualmente los casos de uso, UX, diseño, errores y recuperación. Si encuentro un problema, lo corrijo y repito las verificaciones correspondientes.',
    footer: 'Pedro Méndez Carabán', tagline: 'Me gusta involucrarme en cada detalle de un proyecto.', sourceCode: 'Ver código', liveDemo: 'Abrir demo', privateCode: 'Código privado', privateDemo: 'Demo privada', phpWarning: 'Demo académica desarrollada con Laravel/PHP. El servidor se activa al recibir visitas; la primera carga puede tardar alrededor de un minuto. Los datos son de prueba y pueden reiniciarse.', nodeWarning: 'Este proyecto necesita un servidor Node.js para funcionar; todavía no hay una demo pública configurada.', noDemo: 'Todavía no hay una demo pública configurada para este proyecto.',
    viewProject: 'Ver proyecto', visitPublicSite: 'Visitar sitio público', privateSourceNote: 'El código fuente está en un repositorio privado de VendoAlgo. Estos casos describen mi aporte sin publicar código interno.', demo: 'Ver demo', repository: 'Ver repositorio', resumeDownload: 'Descargar CV (PDF)', resumeSummary: 'Desarrollador full stack con experiencia en productos web, integración de IA y seguridad de aplicaciones. Desarrollo desde el frontend hasta las APIs y el backend, con foco en experiencia de usuario, rendimiento y mantenibilidad.', resumeProjectsTitle: 'Proyectos seleccionados', resumeGitHub: 'GitHub', resumeSite: 'Portfolio', resumePage: 'Portfolio', projectCount: 'proyectos catalogados', publicEvidence: 'demos públicas revisables', stackLabel: 'Trabajo con', stackText: 'código · UX · IA', openToWork: 'Propuestas profesionales',
    roleLabel: 'Mi responsabilidad', highlightsLabel: 'Qué entregué', outcomeLabel: 'Resultado', academicProjects: 'Proyectos académicos', professionalProjects: 'Proyectos profesionales y propios', currentSite: 'Estás viendo este proyecto', inDevelopment: 'En desarrollo', developmentNotice: 'Proyecto en desarrollo. La presentación pública estará disponible después del lanzamiento.',
  },
  en: {
    demoEyebrow: 'Academic demo', demoTitle: 'Before you open the demo', demoWait: 'The demo starts when you visit it. The first load may take about a minute.', demoTime: 'Startup time', demoTimeValue: '≈ 1 min', demoData: 'Sample data · No real purchases', demoContinue: 'Open demo', demoCancel: 'Go back', demoClose: 'Close notice',
    home: 'Home', projects: 'Projects', services: 'Store management', about: 'About me', contact: 'Contact',
    portraitRole: 'Full-stack developer · Buenos Aires', proofLabel: 'Current role', proofStatus: 'E-commerce platform in production', proofCopy: 'Built from scratch and continuously evolved as part of a team.', proofPoints: ['Frontend, backend and APIs', 'Design, UX and product', 'Applied AI and automation'],
    profileSummary: 'Professional information', heroFacts: [{"title":"Experience","description":"Web development since 2020"},{"title":"Current role","description":"Full-stack at VendoAlgo","route":"project/vendoalgo"},{"title":"Work setup","description":"Remote · Buenos Aires (UTC−3)"}],
    greeting: "Hi, I'm", role: 'Full-stack developer · Security · AI',
    hero: 'I care about how a project is built, but also how it looks, what it communicates and how it works on every screen. I think about the buyer, the seller, the administrator, someone who gets lost and someone looking for a vulnerability. I like working through those situations and making sure each person gets the response they need.',
    viewProjects: 'View projects', talk: "Let's talk", featured: 'Featured projects',
    featuredIntro: 'A curated selection of public demos and professional projects. The full catalog clearly separates academic work and private experience.',
    allProjects: 'View all projects', skills: 'Full-stack development, AI and security',
    skillsIntro: 'I combine product development, service integration and automation. Here are the areas where I contribute, with examples of my work.',
    availabilityEyebrow: 'Contact',
    availability: 'Have a project or opportunity in mind?',
    availabilityText: 'Tell me what it involves, and we can see whether working together makes sense.',
    myProjects: 'My projects', projectsIntro: 'Professional projects, public demos and academic work, with scope and links identified so each experience can be reviewed in context.',
    search: 'Search by name or description', allTechnologies: 'All technologies', onlyFeatured: 'Featured only',
    clear: 'Clear filters', results: 'project(s)', noResults: 'No projects found',
    adjust: 'Try adjusting the filters to see more results.', details: 'View details',
    privateProject: 'Private project', featuredTag: 'Featured', github: 'GitHub', demo: 'View project',
    projectDescription: 'Project description', projectDetails: 'Project details',
    technologies: 'Technologies used', back: 'Back to projects', aboutTitle: 'About me',
    aboutIntro: 'I am Pedro Martín Méndez Carabán. I combine full-stack development, security research and AI integration to build web products from a broad technical perspective.',
    story: 'My journey', storyOne: 'I have worked on independent web projects since 2020. I currently work as a developer on the VendoAlgo team, where I built the platform from scratch and continue to contribute to its development.',
    storyTwo: 'My background also includes UX, design, marketing and a Chrome extension. Vulnerability research and my law studies add a perspective on security, privacy and the context in which software is used.',
    education: 'Education', educationText: 'Higher Technical Program in Web Design and Programming — Da Vinci School. Thesis pending.',
    contactTitle: 'Contact me', contactIntro: 'If you have an opportunity, a project or a collaboration in mind, choose how to contact me. Tell me what it involves and we can discuss it.', contactPersonal: 'You’ll be speaking directly with me, Pedro.', contactBook: 'Book a 30-minute Meet', contactBookEyebrow: 'IF YOU WOULD RATHER TALK', contactBookText: 'Pick an available time and we’ll meet on Google Meet.', contactWhatsappTitle: 'Message me on WhatsApp', contactWhatsappText: 'For a quick question or to start with a message.', contactEmailTitle: 'Send me an email', contactEmailText: 'Best if you want to explain what you need in more detail.', contactLinkedinTitle: 'Connect on LinkedIn', contactLinkedinText: 'See my professional experience and reach out there.', contactScheduleHint: 'See available times', contactWhatsAppMessage: 'Hi Pedro, I saw your portfolio and would like to discuss a proposal.', contactGuideTitle: 'What should you include?', contactGuideIntro: 'A little context helps me point you in the right direction:', contactGuideOne: 'What the opportunity or project involves', contactGuideTwo: 'What you need to address and how you would like me to contribute', contactGuideThree: 'The context, timeline and tools you use, if relevant', contactFormNote: 'Your email app will open so you can review the message before sending.',
    sendMessage: 'Email me with some context', response: 'Your email app will open so you can review the message before sending.',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', send: 'Open email',
    required: 'Complete every field to prepare the message.', emailLabel: 'Direct email',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Professional profile', locationLabel: 'Location',
    remote: 'Working remotely from Buenos Aires', faq: 'Frequently asked questions',
    faqOne: 'Do you work with remote teams?', faqOneAnswer: 'Yes. I am used to collaborating with digital tools, Git and asynchronous communication.',
    faqTwo: 'What kind of projects interest you?', faqTwoAnswer: 'Full-stack development, AI integration, automation and cybersecurity projects, as well as web products that solve real problems.',
    workflowTitle: 'How I validate a delivery', workflowText: 'First, the code must pass the automated tests with Pest. Next, I perform AI-assisted review and testing. Finally, I manually validate use cases, UX, design, errors and recovery. If I find a problem, I fix it and repeat the relevant checks.',
    footer: 'Pedro Méndez Carabán', tagline: 'I like being involved in every detail of a project.', sourceCode: 'View source', liveDemo: 'Open demo', privateCode: 'Private code', privateDemo: 'Private demo', phpWarning: 'Academic demo built with Laravel/PHP. The server starts when visited; the first load may take about a minute. Data is for demonstration and may reset.', nodeWarning: 'This project needs a Node.js server to run; there is no public demo configured yet.', noDemo: 'There is no public demo configured for this project yet.',
    viewProject: 'View project', visitPublicSite: 'Visit public site', privateSourceNote: 'The source code is in VendoAlgo’s private repository. These case studies describe my contribution without exposing internal code.', demo: 'View demo', repository: 'View repository', resumeDownload: 'Download resume (PDF)', resumeSummary: 'Full-stack developer experienced in web products, AI integration and application security. I work across frontend, APIs and backend, focusing on user experience, performance and maintainability.', resumeProjectsTitle: 'Selected projects', resumeGitHub: 'GitHub', resumeSite: 'Portfolio', resumePage: 'Portfolio', projectCount: 'cataloged projects', publicEvidence: 'reviewable public demos', stackLabel: 'Work across', stackText: 'code · UX · AI', openToWork: 'Professional inquiries',
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
  if (element?.tagName === 'DETAILS') element.open = true;
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
const hostedNotFound = document.documentElement.dataset.httpStatus === '404';
const pageError = computed(() => {
  if (appFailure.value) return 500;
  if (hostedNotFound) return 404;
  return resolveRouteStatus(currentRoute.value, projects.map((project) => project.slug));
});
const errorPreview = computed(() => !hostedNotFound && !appFailure.value && routeParts.value[0] === 'error');

watch([pageError, language], async ([status]) => {
  document.title = status ? status + ' | Pedro Méndez Carabán' : 'Pedro Méndez Carabán | Portfolio';
  let robots = document.querySelector('meta[data-portfolio-error]');
  if (status && !robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    robots.dataset.portfolioError = '';
    document.head.append(robots);
  } else if (!status) robots?.remove();
  if (status) {
    if (pendingDemo.value) {
      closeDemoDialog();
      onDemoDialogClose();
    }
    await nextTick();
    document.getElementById('http-error-title')?.focus({ preventScroll: true });
  }
}, { immediate: true });

function retryPage() {
  window.location.reload();
}

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
  if (project.demoType === 'extension') return language.value === 'es' ? 'Ver en Chrome Web Store' : 'View in Chrome Web Store';
  if (project.slug === 'vendoalgo') return t.value.visitPublicSite;
  return project.academic ? t.value.demo : t.value.viewProject;
}

function skillLabel(item) {
  if (item === 'React') return language.value === 'es' ? 'React (conocimientos)' : 'React (familiarity)';
  return item;
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



function removePreviewVersion() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('v')) return;
  url.searchParams.delete('v');
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}

function navigate(route) {
  route = normalizeRoute(route) || 'home';
  venturesMenuOpen.value = false;
  removePreviewVersion();
  if (hostedNotFound) {
    window.location.assign(assetBase + '#' + route);
    return;
  }
  appFailure.value = false;
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

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  document.querySelector('.brand')?.focus({ preventScroll: true });
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

function closeVenturesOnOutsideClick(event) {
  if (!(event.target instanceof Element) || !event.target.closest('.nav-ventures')) venturesMenuOpen.value = false;
}
function closeVenturesOnFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) venturesMenuOpen.value = false;
}

function onHashChange() {
  venturesMenuOpen.value = false;
  currentRoute.value = routeFromLocation(window.location, assetBase);
}

watch(language, (value) => {
  savePreference('language', value);
  document.documentElement.lang = value;
});
watch(darkMode, (value) => {
  savePreference('darkMode', String(value));
  document.documentElement.classList.toggle('dark', value);
});

onMounted(() => {
  removePreviewVersion();
  document.documentElement.lang = language.value;
  document.documentElement.classList.toggle('dark', darkMode.value);
  window.addEventListener('hashchange', onHashChange);
  document.addEventListener('click', closeVenturesOnOutsideClick);
});
onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange);
  document.removeEventListener('click', closeVenturesOnOutsideClick);
  if (pendingDemo.value) document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <div class="app-shell">
    <div class="cursor-aura" aria-hidden="true">
      <div class="cursor-aura-glow"></div>
    </div>
    <header class="site-header">
      <div v-if="isServiceRoute" class="container buyer-header">
        <div class="buyer-header-identity">
          <a class="brand brand-with-avatar" href="#home" @click.prevent="navigate('home')"><span class="brand-avatar profile-photo-frame" aria-hidden="true"><img :src="assetBase + 'pedro-portrait.jpg'" alt="" width="666" height="888" decoding="async"></span><span class="brand-name">Pedro Méndez Carabán</span></a>
          <a class="buyer-ventures-back" href="#emprendimientos" @click.prevent="navigate('emprendimientos')">← {{ language === 'es' ? 'Mis emprendimientos' : 'My ventures' }}</a>
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
        <a class="brand brand-with-avatar" href="#home" @click.prevent="navigate('home')"><span class="brand-avatar profile-photo-frame" aria-hidden="true"><img :src="assetBase + 'pedro-portrait.jpg'" alt="" width="666" height="888" decoding="async"></span><span class="brand-name">Pedro Méndez Carabán</span></a>
        <button class="menu-button" type="button" aria-label="Abrir menú de navegación" :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = !mobileMenuOpen">☰</button>
        <nav :class="{ 'is-open': mobileMenuOpen }" class="site-nav" aria-label="Navegación principal">
          <a :class="{ active: currentRoute === 'home' }" href="#home" @click.prevent="navigate('home')">{{ t.home }}</a>
          <a :class="{ active: currentRoute === 'projects' || currentRoute.startsWith('project/') }" href="#projects" @click.prevent="navigate('projects')">{{ t.projects }}</a>
          <div class="nav-ventures" @keydown.esc.stop.prevent="venturesMenuOpen = false" @focusout="closeVenturesOnFocusOut">
            <div class="nav-ventures-heading">
              <a :class="{ active: currentRoute === 'emprendimientos' || isServiceRoute }" href="#emprendimientos" @click.prevent="navigate('emprendimientos')">{{ language === 'es' ? 'Mis emprendimientos' : 'My ventures' }}</a>
              <button type="button" class="nav-ventures-toggle" :aria-label="language === 'es' ? 'Ver mis emprendimientos' : 'Show my ventures'" :aria-expanded="venturesMenuOpen" aria-controls="ventures-navigation" @click="venturesMenuOpen = !venturesMenuOpen"><svg :class="{ 'is-open': venturesMenuOpen }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
            </div>
            <ul v-show="venturesMenuOpen" id="ventures-navigation" class="nav-ventures-list">
              <li><a href="#services" @click.prevent="navigate('services')">{{ language === 'es' ? 'Gestión de tiendas' : 'Store management' }} <span aria-hidden="true">↗</span></a></li>
              <li><span class="nav-venture-locked" role="link" aria-disabled="true"><span>citARme<small>{{ language === 'es' ? 'En desarrollo' : 'In development' }}</small></span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg></span></li>
              <li><span class="nav-venture-locked" role="link" aria-disabled="true"><span>TiendARG<small>{{ language === 'es' ? 'En desarrollo' : 'In development' }}</small></span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg></span></li>
            </ul>
          </div>
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
      <HttpErrorPage v-if="pageError" :status="pageError" :language="language" :preview="errorPreview" @navigate="navigate" @retry="retryPage" />
      <template v-else>
      <section v-if="currentRoute === 'home'" class="hero">
        <div class="hero-scenery" aria-hidden="true" :style="{ '--hero-photo': `url('${assetBase}pedro-portrait.jpg')` }">
          <img :src="assetBase + 'pedro-portrait.jpg'" alt="" width="666" height="888" fetchpriority="high" decoding="async">
        </div>
        <div class="container hero-content">
        <div class="hero-layout">
          <div class="hero-main">
          <p class="eyebrow">{{ t.role }} <span class="eyebrow-dot"></span> Buenos Aires</p>
          <div class="hero-intro">
            <h1 class="hero-heading"><span class="hero-greeting">{{ t.greeting }}</span><span class="visually-hidden">Pedro.</span><span class="hero-name" aria-hidden="true"><span v-for="(letter, index) in 'Pedro.'" :key="index" class="hero-letter" :style="{ '--letter-index': index }" aria-hidden="true">{{ letter }}</span></span><em>{{ t.tagline }}</em></h1>
          </div>
          <p class="hero-copy">{{ t.hero }}</p>
          <div class="button-row">
            <button class="button button-download" type="button" :aria-label="t.resumeDownload" @click="downloadResume"><span class="hero-desktop-only">{{ t.resumeDownload }}</span><span class="hero-mobile-only">{{ language === 'es' ? 'CV (PDF)' : 'Resume (PDF)' }} <span aria-hidden="true">↓</span></span></button>
            <a class="button button-light" href="#projects" @click.prevent="navigate('projects')">{{ t.viewProjects }}</a>
            <a class="button button-outline" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a>
          </div>
          </div>

        </div>
          <div class="hero-focus" :aria-label="t.profileSummary">
            <dl class="hero-focus-list">
              <div v-for="item in t.heroFacts" :key="item.title"><dt>{{ item.title }}</dt><dd><a v-if="item.route" :href="'#' + item.route" @click.prevent="navigate(item.route)">{{ item.description }} <span aria-hidden="true">↗</span></a><template v-else>{{ item.description }}</template></dd></div>
            </dl>
          </div>
          <a class="hero-explore" href="#portfolio-playground" @click.prevent="scrollToSection('portfolio-playground')"><span>{{ language === 'es' ? 'Ver mi experiencia' : 'View my experience' }}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a>
        </div>
      </section>

      <template v-if="currentRoute === 'home'">
        <PortfolioWorkbench :language="language" v-reveal @navigate="navigate" />
        <section class="section capability-section" aria-labelledby="home-capabilities-title">
          <div class="container">
            <div class="section-heading section-heading-left" v-reveal>
              <p class="eyebrow">{{ language === 'es' ? '01 / LO QUE PUEDO APORTAR' : '01 / HOW I CONTRIBUTE' }}</p>
              <h2 id="home-capabilities-title">{{ t.skills }}</h2>
              <p>{{ t.skillsIntro }}</p>
            </div>
            <div class="capability-grid">
              <article v-for="(area, index) in profile.homeCapabilities" :key="area.id" class="capability-card" :data-skill-area="area.id" v-reveal="index * 50">
                <div class="capability-top"><span class="capability-number" aria-hidden="true">0{{ index + 1 }}</span><span>{{ area.label }}</span></div>
                <h3>{{ area.title }}</h3>
                <p class="capability-description">{{ area.body }}</p>
                <ul class="capability-tags" :aria-label="language === 'es' ? 'Tecnologías y prácticas' : 'Technologies and practices'"><li v-for="item in area.tags" :key="item">{{ skillLabel(item) }}</li></ul>
                <div class="capability-evidence"><p>{{ area.context }}</p><a :href="'#' + area.route" @click.prevent="navigate(area.route)">{{ area.link }} <span aria-hidden="true">↗</span></a></div>
              </article>
            </div>
            <div class="capability-practices">
              <p>{{ language === 'es' ? 'Trabajo con Git y GitHub, diseño UX/UI y publicación de aplicaciones web.' : 'My work includes Git and GitHub, UX/UI design and publishing web applications.' }}</p>
              <details><summary>{{ language === 'es' ? 'En qué estoy profundizando' : 'What I am learning next' }}</summary><p>{{ language === 'es' ? 'RAG, agentes y evaluación de respuestas de IA. Son áreas de aprendizaje, diferenciadas de las implementaciones que ya están en uso.' : 'RAG, agents and AI response evaluation. These are learning areas, separate from the implementations already in use.' }}</p></details>
            </div>
          </div>
        </section>
        <section class="section section-muted">
          <div class="container"><div class="section-heading section-heading-left" v-reveal><p class="eyebrow">02 / {{ t.featured }}</p><h2>{{ t.featured }}</h2><p>{{ t.featuredIntro }}</p></div><div class="project-grid"><article v-for="(project, index) in featuredProjects" :key="project.id" class="project-card" v-reveal="(index % 3) * 55" :class="{ 'project-card-lead': project.id === 1 }"><div class="project-image"><img :src="project.image" :alt="project.title"><span class="project-number">{{ projectNumber(index) }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :data-skill-area="skillAreaFor(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div><div class="center"><a class="button button-primary" href="#projects" @click.prevent="navigate('projects')">{{ t.allProjects }}</a></div></div>
        </section>
        <section class="section academic-preview"><div class="container"><h2 class="category-divider">{{ t.academicProjects }}</h2><div class="project-grid"><article v-for="(project, index) in academicProjects.slice(0, 3)" :key="project.id" class="project-card academic-card" v-reveal="(index % 3) * 55"><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="card-actions"><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }} →</a></div></div></article></div></div></section>
      </template>

      <section v-else-if="currentRoute === 'projects'" class="section page-section">
        <div class="container"><div class="section-heading section-heading-left" v-reveal><p class="eyebrow">03 / {{ t.projects }}</p><h1>{{ t.myProjects }}</h1><p>{{ t.projectsIntro }}</p></div><div class="filters"><input v-model="search" type="search" :aria-label="t.search" :placeholder="t.search"><select v-model="technology" :aria-label="t.allTechnologies"><option value="">{{ t.allTechnologies }}</option><option v-for="item in technologies" :key="item" :value="item">{{ item }}</option></select><label><input v-model="featuredOnly" type="checkbox"> {{ t.onlyFeatured }}</label><button v-if="search || technology || featuredOnly" class="text-button" type="button" @click="search = ''; technology = ''; featuredOnly = false">{{ t.clear }}</button></div><p class="result-count">{{ filteredProjects.length }} {{ t.results }}</p><h2 v-if="filteredProjects.some((project) => !project.academic)" class="category-divider">{{ t.professionalProjects }}</h2><div v-if="filteredProjects.length" class="project-grid"><article v-for="(project, index) in filteredProjects.filter((item) => !item.academic)" :key="project.id" class="project-card" v-reveal="(index % 3) * 55"><div class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">{{ projectNumber(index) }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :data-skill-area="skillAreaFor(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div><div v-else class="empty-state"><h2>{{ t.noResults }}</h2><p>{{ t.adjust }}</p></div><details v-if="filteredProjects.some((project) => project.academic)" class="academic-projects-archive" :open="Boolean(search || technology || featuredOnly)"><summary><span>{{ t.academicProjects }}</span><span class="academic-projects-count">{{ filteredProjects.filter((project) => project.academic).length }} {{ language === 'es' ? 'proyectos' : 'projects' }} <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 6 5 5 5-5" /></svg></span></summary><div class="project-grid"><article v-for="(project, index) in filteredProjects.filter((item) => item.academic)" :key="project.id" class="project-card academic-card" v-reveal="(index % 3) * 55"><div v-if="project.preview" class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">{{ projectNumber(index) }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :data-skill-area="skillAreaFor(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="`GitHub ↗ · ${t.repository}: ${project.title}`" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div></details></div>
      </section>

      <VenturesPage v-else-if="currentRoute === 'emprendimientos'" :language="language" @navigate="navigate" />

      <section v-else-if="isServiceRoute" class="section page-section buyer-page">
        <div class="container">
          <header v-if="showServicePrices" class="buyer-price-heading" v-reveal>
            <p class="eyebrow">{{ language === 'es' ? 'SERVICIOS Y PRECIOS ORIENTATIVOS' : 'SERVICES AND INDICATIVE PRICES' }}</p>
            <h1>{{ language === 'es' ? 'Armá tu consulta.' : 'Build your inquiry.' }}</h1>
            <p>{{ language === 'es' ? 'Elegí lo que necesitás. El resumen separa mi trabajo del costo de VendoAlgo.' : 'Choose what you need. My fees and VendoAlgo costs are shown separately.' }}</p>
            <button type="button" class="buyer-inline-link" @click="scrollToSection('service-payment')">{{ language === 'es' ? 'Ver formas de pago y cuotas' : 'See payment terms and installments' }} ↓</button>
          </header>
          <section v-if="showServicePrices" id="service-scope" class="buyer-section" tabindex="-1" :aria-label="language === 'es' ? 'Preparar mi consulta y estimado' : 'Prepare my inquiry and estimate'">
            <ServiceEstimator :language="language" :show-prices="true" />
          </section>
          <div v-if="showServicePrices" class="buyer-section"><StoreServiceGuide part="payment" :language="language" :show-prices="showServicePrices" /></div>
          <header v-if="!showServicePrices" class="buyer-hero" v-reveal>
            <p class="eyebrow">{{ servicePage.eyebrow }}</p>
            <h1>{{ servicePage.title }}</h1>
            <p class="buyer-lead">{{ servicePage.lead }}</p>
            <p class="buyer-audience">{{ servicePage.audience }}</p>
            <div class="button-row">
              <button type="button" class="button button-primary" @click="scrollToSection('service-case')">{{ language === 'es' ? 'Ver una tienda funcionando' : 'See a working store' }} ↓</button>
              <button type="button" class="buyer-inline-link" @click="scrollToSection('service-scope')">{{ language === 'es' ? 'Elegir servicios' : 'Choose services' }} ↓</button>
            </div>
          </header>

          <nav class="buyer-content-nav" :aria-label="language === 'es' ? 'En esta página' : 'On this page'">
            <button type="button" @click="scrollToSection('service-scope')">{{ language === 'es' ? 'Elegir servicios' : 'Choose services' }}</button>
            <button type="button" @click="scrollToSection('service-case')">{{ language === 'es' ? 'Ver un ejemplo real' : 'See a real example' }}</button>
            <button type="button" @click="scrollToSection('service-process')">{{ language === 'es' ? 'Cómo trabajo' : 'How I work' }}</button>
            <button type="button" @click="scrollToSection('service-questions')">{{ language === 'es' ? 'Dudas frecuentes' : 'Common questions' }}</button>
          </nav>
          <section v-if="!showServicePrices" id="service-scope" class="buyer-section" tabindex="-1" :aria-label="language === 'es' ? 'Preparar mi consulta' : 'Prepare my inquiry'">
            <ServiceEstimator :language="language" :show-prices="showServicePrices" />
          </section>

          <section id="service-case" class="buyer-section buyer-demo-section" tabindex="-1" aria-labelledby="service-tour-title">
            <StoreServiceGuide part="tour" :language="language" :show-prices="showServicePrices" />
            <details class="buyer-case-details">
              <summary>{{ language === 'es' ? 'Ver todo lo que hice para FumigAR' : 'See my full scope at FumigAR' }}</summary>
              <p>{{ language === 'es' ? 'Me pidieron pasar los productos de la tienda anterior, preparar la nueva tienda y acompañar su operación diaria. Mi trabajo incluyó:' : 'They asked me to migrate their previous catalog, prepare the new store and support everyday operations. My work included:' }}</p>
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

          <details id="service-process" class="buyer-section buyer-optional" tabindex="-1">
            <summary><span><strong>{{ language === 'es' ? 'Cómo trabajo' : 'How I work' }}</strong><small>{{ language === 'es' ? 'Qué pasa después de tu consulta' : 'What happens after your inquiry' }}</small></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
            <StoreServiceGuide part="process" :language="language" />
          </details>

          <details id="service-questions" class="buyer-section buyer-optional" tabindex="-1">
            <summary><span><strong>{{ language === 'es' ? 'Preguntas frecuentes' : 'Common questions' }}</strong><small>{{ language === 'es' ? 'Costos, tiempos, mantenimiento y equipo' : 'Costs, timing, maintenance and staff' }}</small></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
            <StoreServiceGuide part="faq" :language="language" :show-prices="showServicePrices" />
          </details>

          <details class="buyer-more buyer-section">
            <summary>{{ servicePage.otherTitle }}</summary>
            <p>{{ servicePage.otherIntro }}</p>
            <div class="buyer-other-grid">
              <component :is="store.id === 'tiendarg' ? 'div' : 'a'" v-for="store in otherStores" :key="store.id" class="buyer-store-card" v-reveal :class="{ 'buyer-store-locked': store.id === 'tiendarg' }" :href="store.id === 'tiendarg' ? undefined : store.url" :aria-disabled="store.id === 'tiendarg' ? true : undefined" :target="store.id === 'tiendarg' ? undefined : '_blank'" rel="noopener noreferrer">
                <div class="buyer-store-preview">
                  <img v-if="!failedServicePreviews.includes(store.id)" :src="assetBase + store.preview" :alt="servicePage.previewAlt + ' ' + store.name" width="1100" height="532" loading="lazy" @error="onServicePreviewError(store.id)">
                  <span v-else class="buyer-preview-fallback">{{ servicePage.previewMissing }}</span>
                  <span class="buyer-domain">{{ store.id === 'tiendarg' ? (language === 'es' ? 'TiendARG · En desarrollo' : 'TiendARG · In development') : store.domain + ' ↗' }}</span>
                </div>
                <div class="buyer-store-caption"><h3>{{ store.name }}</h3><p>{{ store.description[language] }}</p><span v-if="store.id === 'tiendarg'" class="buyer-store-lock-label"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg>{{ language === 'es' ? 'En desarrollo' : 'In development' }}</span><span v-else class="text-link">{{ servicePage.visitStore }} ↗</span></div>
              </component>
            </div>
          </details>

          <aside class="buyer-person" v-reveal>
            <img :src="assetBase + 'pedro-portrait.jpg'" alt="Pedro Méndez Carabán" width="88" height="108" loading="lazy">
            <div><h2>{{ servicePage.personTitle }}</h2><p>{{ servicePage.personText }}</p>
              <div class="button-row"><a class="text-link" href="#about" @click.prevent="navigate('about')">{{ servicePage.profile }} →</a><a class="text-link" href="https://vendoalgo.com/" target="_blank" rel="noopener noreferrer">{{ servicePage.platform }} ↗</a></div>
            </div>
          </aside>

          <section class="buyer-final" v-reveal>
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
                <div v-for="course in profile.courses" :key="course.title" class="cv-course" v-reveal><h3>{{ course.title }}</h3><p>{{ course.text }}</p></div>
              </section>
            </div>
            <aside class="cv-sidebar">
              <section class="info-panel" v-reveal><h2>{{ profile.skillsTitle }}</h2><div v-for="area in profile.skills" :key="area.id" class="cv-skill-area" :data-skill-area="area.id"><h3>{{ area.title }}</h3><div class="tag-row"><span v-for="item in area.items" :key="item" class="tag">{{ skillLabel(item) }}</span></div></div></section>
              <section class="info-panel" v-reveal><h2>{{ profile.languagesTitle }}</h2><p>{{ profile.languages }}</p><div class="quote-box"><strong>{{ profile.strengthsTitle }}</strong><p>{{ profile.strengths }}</p></div></section>
              <section class="info-panel" v-reveal><h2>{{ t.workflowTitle }}</h2><p>{{ t.workflowText }}</p></section>
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

      <section v-else-if="routeParts[0] === 'project' && selectedProject" class="section page-section"><div class="container project-detail"><div class="detail-main"><p class="eyebrow">{{ selectedProject.category }} · {{ selectedProject.startDate }}</p><h1>{{ selectedProject.title }}</h1><p class="lead">{{ selectedProject.shortDescription }}</p><img v-if="!selectedProject.academic || selectedProject.preview" :src="selectedProject.image" :alt="selectedProject.title"><h2>{{ t.projectDescription }}</h2><p>{{ selectedProject.description }}</p><div v-if="selectedProject.role || selectedProject.highlights || selectedProject.outcome" class="case-study"><div v-if="selectedProject.role"><p class="eyebrow">{{ t.roleLabel }}</p><p>{{ language === 'es' ? selectedProject.role : selectedProject.roleEn }}</p></div><div v-if="selectedProject.highlights"><p class="eyebrow">{{ t.highlightsLabel }}</p><ul><li v-for="highlight in (language === 'es' ? selectedProject.highlights : selectedProject.highlightsEn)" :key="highlight">{{ highlight }}</li></ul></div><div v-if="selectedProject.outcome"><p class="eyebrow">{{ t.outcomeLabel }}</p><p>{{ language === 'es' ? selectedProject.outcome : selectedProject.outcomeEn }}</p></div></div><ProjectTechnicalCase v-if="selectedProject.technicalCase" :content="selectedProject.technicalCase[language]" /></div><aside class="info-panel"><h2>{{ t.projectDetails }}</h2><div class="tag-row large-tags"><span v-for="item in selectedProject.technologies" :key="item" class="tag" :data-skill-area="skillAreaFor(item)">{{ item }}</span></div><button v-if="selectedProject.technicalCase" class="button button-secondary full-width" type="button" @click="scrollToSection('project-technical-case')">{{ selectedProject.technicalCase[language].linkLabel }} ↓</button><a v-if="selectedProject.github && !selectedProject.private" class="button button-secondary full-width" :href="selectedProject.github" target="_blank" rel="noopener noreferrer">{{ t.sourceCode }} ↗</a><a v-if="selectedProject.live" class="button button-primary full-width" :href="selectedProject.live" @click="confirmDemoStart($event, selectedProject)" :target="selectedProject.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(selectedProject) }} ↗</a><p v-if="selectedProject.slug === 'vendoalgo'" class="project-source-note">{{ t.privateSourceNote }}</p><div v-if="selectedProject.demoType === 'development'" class="project-notice"><strong>{{ t.inDevelopment }}</strong>{{ t.developmentNotice }}</div><div v-else-if="selectedProject.currentSite" class="project-notice">{{ t.currentSite }}</div><div v-else-if="selectedProject.demoType === 'private'" class="project-notice">{{ t.privateDemo }}<span>{{ t.privateCode }}</span></div><div v-else-if="selectedProject.demoType === 'php'" class="project-notice project-notice-warning">{{ t.phpWarning }}</div><div v-else-if="!selectedProject.live && selectedProject.demoType === 'node'" class="project-notice project-notice-warning">{{ t.nodeWarning }}</div><div v-else-if="!selectedProject.live" class="project-notice">{{ t.noDemo }}</div><a class="text-link back-link" href="#projects" @click.prevent="navigate('projects')">← {{ t.back }}</a></aside></div></section>
      </template>
      <section v-if="!pageError && !isServiceRoute && currentRoute !== 'contact'" class="availability"><div class="container availability-inner" v-reveal><div><p class="eyebrow">{{ t.availabilityEyebrow }}</p><h2>{{ t.availability }}</h2><p>{{ t.availabilityText }}</p></div><a class="button button-light" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a></div></section>
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

    <button v-if="!isServiceRoute && !pageError" class="back-to-top" type="button" :aria-label="language === 'es' ? 'Volver arriba' : 'Back to top'" :title="language === 'es' ? 'Volver arriba' : 'Back to top'" @click="scrollToTop">
      <svg class="back-to-top-progress" viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle class="progress-track" cx="24" cy="24" r="20" stroke-width="1.5"/><circle class="progress-value" cx="24" cy="24" r="20" pathLength="100" stroke-width="1.8"/></svg>
      <svg class="back-to-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>
    </button>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-identity">
          <strong>{{ t.footer }}</strong>
          <p>{{ t.portraitRole }}</p>
        </div>
        <nav class="footer-links" :aria-label="language === 'es' ? 'Contacto y CV' : 'Contact and CV'">
          <a class="footer-email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
          <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          <a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <button class="footer-cv" type="button" :aria-label="language === 'es' ? 'Descargar CV en español (PDF)' : 'Download resume in English (PDF)'" @click="downloadResume">{{ language === 'es' ? 'CV (PDF)' : 'Resume (PDF)' }} <span aria-hidden="true">↓</span></button>
        </nav>
      </div>
    </footer>
  </div>
</template>

