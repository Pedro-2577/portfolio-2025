<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { contact, projects } from './data';

const language = ref(localStorage.getItem('language') || 'es');
const darkMode = ref(localStorage.getItem('darkMode') === 'true');
const currentRoute = ref(window.location.hash.slice(1) || 'home');
const search = ref('');
const technology = ref('');
const featuredOnly = ref(false);
const mobileMenuOpen = ref(false);
const form = ref({ name: '', email: '', subject: '', message: '' });
const formError = ref('');

const text = {
  es: {
    home: 'Inicio', projects: 'Proyectos', about: 'Sobre mí', contact: 'Contacto',
    greeting: 'Hola, soy', role: 'Desarrollador de producto digital con IA',
    hero: 'Convierto problemas reales en productos web claros, funcionales y mantenibles, combinando criterio propio con herramientas de IA.',
    viewProjects: 'Ver proyectos', talk: 'Hablemos', featured: 'Proyectos destacados',
    featuredIntro: 'Una selección curada de demos públicas y proyectos profesionales. El resto del catálogo separa claramente trabajos académicos y experiencias privadas.',
    allProjects: 'Ver todos los proyectos', skills: 'Tecnologías con las que trabajo',
    skillsIntro: 'Arquitectura, interfaz, datos, comunicación y publicación: el conjunto de habilidades necesario para llevar una idea a producción.',
    availability: 'Disponible para nuevos desafíos',
    availabilityText: 'Trabajo remoto desde Buenos Aires y me interesa colaborar en productos web con impacto.',
    myProjects: 'Mis proyectos', projectsIntro: 'Proyectos profesionales, demos públicas y trabajos académicos, con enlaces y alcance identificados para revisar cada experiencia con contexto.',
    search: 'Buscar por nombre o descripción', allTechnologies: 'Todas las tecnologías', onlyFeatured: 'Solo destacados',
    clear: 'Limpiar filtros', results: 'proyecto(s)', noResults: 'No se encontraron proyectos',
    adjust: 'Probá ajustar los filtros para ver más resultados.', details: 'Ver detalles',
    privateProject: 'Proyecto privado', featuredTag: 'Destacado', github: 'GitHub', demo: 'Ver proyecto',
    projectDescription: 'Descripción del proyecto', projectDetails: 'Detalles del proyecto',
    technologies: 'Tecnologías utilizadas', back: 'Volver a proyectos', aboutTitle: 'Sobre mí',
    aboutIntro: 'Perfil transversal orientado a producto: entiendo el problema, diseño una estrategia técnica, implemento con IA y valido personalmente el resultado.',
    story: 'Mi recorrido', storyOne: 'Soy Pedro Méndez Carabán, desarrollador de producto digital con experiencia profesional en Vendoalgo y WeCanAgro, además de proyectos propios y académicos.',
    storyTwo: 'Mi recorrido combina programación, UX, diseño, marketing y comunicación. Esa mezcla me permite adaptarme al problema en lugar de limitarme a una sola capa del producto.',
    education: 'Formación', educationText: 'Técnico Superior en Diseño y Programación Web — Escuela Da Vinci, Buenos Aires.',
    contactTitle: 'Hablemos', contactIntro: '¿Tenés una idea, una oportunidad o querés conocer más sobre un proyecto? Elegí el canal que te resulte más cómodo.',
    sendMessage: 'Preparar un mensaje', response: 'Normalmente respondo dentro de las 24 horas.',
    name: 'Nombre', email: 'Email', subject: 'Asunto', message: 'Mensaje', send: 'Abrir correo',
    required: 'Completá todos los campos para preparar el mensaje.', emailLabel: 'Email directo',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Perfil profesional', locationLabel: 'Ubicación',
    remote: 'Disponible para trabajo remoto', faq: 'Preguntas frecuentes',
    faqOne: '¿Trabajás con equipos remotos?', faqOneAnswer: 'Sí. Estoy acostumbrado a colaborar con herramientas digitales, Git y comunicación asincrónica.',
    faqTwo: '¿Qué tipo de proyectos te interesan?', faqTwoAnswer: 'Productos web, sitios institucionales, plataformas de contenido y herramientas internas que resuelvan problemas reales.',
    workflowTitle: 'Cómo trabajo con IA', workflowText: 'Primero defino la estructura, las restricciones y el resultado esperado. Después uso IA para implementar, explorar alternativas y depurar; finalmente valido comportamiento, accesibilidad, diseño, seguridad y publicación.',
    footer: 'Portfolio de Pedro Méndez Carabán', tagline: 'Creo cosas que funcionan.', sourceCode: 'Ver código', liveDemo: 'Abrir demo', privateCode: 'Código privado', privateDemo: 'Demo privada', phpWarning: 'Este proyecto necesita un deploy PHP. La primera carga puede demorar mientras el servidor inicia.', nodeWarning: 'Este proyecto necesita un servidor Node.js para funcionar; todavía no hay una demo pública configurada.', noDemo: 'Todavía no hay una demo pública configurada para este proyecto.',
    projectCount: 'proyectos catalogados', publicEvidence: 'demos públicas revisables', stackLabel: 'Trabajo con', stackText: 'código · UX · IA', openToWork: 'Abierto a oportunidades',
    roleLabel: 'Mi responsabilidad', highlightsLabel: 'Qué entregué', outcomeLabel: 'Resultado',
  },
  en: {
    home: 'Home', projects: 'Projects', about: 'About me', contact: 'Contact',
    greeting: "Hi, I'm", role: 'AI-augmented product developer',
    hero: 'I turn real problems into clear, functional and maintainable web products by combining independent judgment with AI tools.',
    viewProjects: 'View projects', talk: "Let's talk", featured: 'Featured projects',
    featuredIntro: 'A curated selection of public demos and professional projects. The full catalog clearly separates academic work and private experience.',
    allProjects: 'View all projects', skills: 'Technologies I work with',
    skillsIntro: 'Architecture, interfaces, data, communication and delivery: the skills needed to take an idea to production.',
    availability: 'Available for new challenges',
    availabilityText: 'I work remotely from Buenos Aires and enjoy collaborating on impactful web products.',
    myProjects: 'My projects', projectsIntro: 'Professional projects, public demos and academic work, with scope and links identified so each experience can be reviewed in context.',
    search: 'Search by name or description', allTechnologies: 'All technologies', onlyFeatured: 'Featured only',
    clear: 'Clear filters', results: 'project(s)', noResults: 'No projects found',
    adjust: 'Try adjusting the filters to see more results.', details: 'View details',
    privateProject: 'Private project', featuredTag: 'Featured', github: 'GitHub', demo: 'View project',
    projectDescription: 'Project description', projectDetails: 'Project details',
    technologies: 'Technologies used', back: 'Back to projects', aboutTitle: 'About me',
    aboutIntro: 'A transversal product profile: I understand the problem, define a technical strategy, implement with AI and personally validate the result.',
    story: 'My journey', storyOne: 'I am Pedro Méndez Carabán, a product developer with professional experience in Vendoalgo and WeCanAgro, as well as personal and academic projects.',
    storyTwo: 'My background combines programming, UX, design, marketing and communication. This helps me adapt to the product problem instead of limiting myself to one layer.',
    education: 'Education', educationText: 'Higher Technician in Web Design and Programming — Da Vinci School, Buenos Aires.',
    contactTitle: "Let's talk", contactIntro: 'Have an idea, an opportunity or want to learn more about a project? Choose the channel that works best for you.',
    sendMessage: 'Prepare a message', response: 'I usually reply within 24 hours.',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', send: 'Open email',
    required: 'Complete every field to prepare the message.', emailLabel: 'Direct email',
    whatsappLabel: 'WhatsApp', linkedinLabel: 'Professional profile', locationLabel: 'Location',
    remote: 'Available for remote work', faq: 'Frequently asked questions',
    faqOne: 'Do you work with remote teams?', faqOneAnswer: 'Yes. I am used to collaborating with digital tools, Git and asynchronous communication.',
    faqTwo: 'What kind of projects interest you?', faqTwoAnswer: 'Web products, institutional sites, content platforms and internal tools that solve real problems.',
    workflowTitle: 'How I work with AI', workflowText: 'I define the structure, constraints and expected outcome first. Then I use AI to implement, explore alternatives and debug; finally I validate behavior, accessibility, design, security and delivery.',
    footer: "Pedro Méndez Carabán's portfolio", tagline: 'I build things that work.', sourceCode: 'View source', liveDemo: 'Open demo', privateCode: 'Private code', privateDemo: 'Private demo', phpWarning: 'This project needs a PHP deployment. The first load may take a moment while the server starts.', nodeWarning: 'This project needs a Node.js server to run; there is no public demo configured yet.', noDemo: 'There is no public demo configured for this project yet.',
    projectCount: 'cataloged projects', publicEvidence: 'reviewable public demos', stackLabel: 'Work across', stackText: 'code · UX · AI', openToWork: 'Open to opportunities',
    roleLabel: 'My responsibility', highlightsLabel: 'What I delivered', outcomeLabel: 'Outcome',
  },
};

const t = computed(() => text[language.value]);
const routeParts = computed(() => currentRoute.value.split('/').filter(Boolean));
const selectedProject = computed(() => projects.find((project) => project.slug === routeParts.value[1]));
const technologies = computed(() => [...new Set(projects.flatMap((project) => project.technologies))].sort());
const filteredProjects = computed(() => projects.filter((project) => {
  const query = search.value.toLowerCase().trim();
  const matchesSearch = !query || `${project.title} ${project.description}`.toLowerCase().includes(query);
  const matchesTechnology = !technology.value || project.technologies.includes(technology.value);
  return matchesSearch && matchesTechnology && (!featuredOnly.value || project.featured);
}));
const featuredProjects = computed(() => projects.filter((project) => project.featured));

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
onUnmounted(() => window.removeEventListener('hashchange', onHashChange));
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
              <div v-for="skill in ['Vue.js', 'Node.js', 'PHP / MySQL', 'UX / UI']" :key="skill" class="skill-card"><strong>{{ skill }}</strong><span>{{ skill === 'Vue.js' ? 'Frontend' : skill === 'Node.js' ? 'Backend' : skill === 'PHP / MySQL' ? 'Data & APIs' : 'Interfaces' }}</span></div>
            </div>
          </div>
        </section>
        <section class="section section-muted">
          <div class="container"><div class="section-heading section-heading-left"><p class="eyebrow">02 / {{ t.featured }}</p><h2>{{ t.featured }}</h2><p>{{ t.featuredIntro }}</p></div><div class="project-grid"><article v-for="project in featuredProjects" :key="project.id" class="project-card" :class="{ 'project-card-lead': project.id === 1 }"><div class="project-image"><img :src="project.image" :alt="project.title"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span v-if="project.private" class="private-mark">● {{ t.privateProject }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><div class="card-actions"><a class="button button-small" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="project.live" class="button button-small button-primary" :href="project.live" target="_blank" rel="noopener noreferrer">{{ t.demo }} ↗</a></div></div></article></div><div class="center"><a class="button button-primary" href="#projects" @click.prevent="navigate('projects')">{{ t.allProjects }}</a></div></div>
        </section>
        <section class="availability"><div class="container availability-inner"><div><p class="eyebrow">{{ t.availability }}</p><h2>{{ t.availability }}</h2><p>{{ t.availabilityText }}</p></div><a class="button button-light" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a></div></section>
      </template>

      <section v-else-if="currentRoute === 'projects'" class="section page-section">
        <div class="container"><div class="section-heading section-heading-left"><p class="eyebrow">03 / {{ t.projects }}</p><h1>{{ t.myProjects }}</h1><p>{{ t.projectsIntro }}</p></div><div class="filters"><input v-model="search" type="search" :placeholder="t.search"><select v-model="technology"><option value="">{{ t.allTechnologies }}</option><option v-for="item in technologies" :key="item" :value="item">{{ item }}</option></select><label><input v-model="featuredOnly" type="checkbox"> {{ t.onlyFeatured }}</label><button v-if="search || technology || featuredOnly" class="text-button" type="button" @click="search = ''; technology = ''; featuredOnly = false">{{ t.clear }}</button></div><p class="result-count">{{ filteredProjects.length }} {{ t.results }}</p><div v-if="filteredProjects.length" class="project-grid"><article v-for="project in filteredProjects" :key="project.id" class="project-card"><div class="project-image"><img :src="project.image" :alt="project.title"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span v-if="project.private" class="private-mark">● {{ t.privateProject }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><div class="card-actions"><a class="button button-small" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="project.live" class="button button-small button-primary" :href="project.live" target="_blank" rel="noopener noreferrer">{{ t.demo }} ↗</a></div></div></article></div><div v-else class="empty-state"><h2>{{ t.noResults }}</h2><p>{{ t.adjust }}</p></div></div>
      </section>

      <section v-else-if="currentRoute === 'about'" class="section page-section"><div class="container two-columns"><div class="prose"><p class="eyebrow">04 / {{ t.about }}</p><h1>{{ t.aboutTitle }}</h1><p class="lead">{{ t.aboutIntro }}</p><h2>{{ t.story }}</h2><p>{{ t.storyOne }}</p><p>{{ t.storyTwo }}</p><h2>{{ t.education }}</h2><p>{{ t.educationText }}</p></div><div class="info-panel"><h2>{{ t.skills }}</h2><div class="tag-row large-tags"><span v-for="item in ['Vue.js', 'Nuxt', 'JavaScript', 'Node.js', 'PHP', 'MySQL', 'Laravel', 'Git & GitHub', 'Responsive Design', 'UX']" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><div class="quote-box"><strong>{{ t.workflowTitle }}</strong><p>{{ t.workflowText }}</p></div><div class="quote-box"><strong>{{ t.availability }}</strong><p>{{ t.availabilityText }}</p></div></div></div></section>

      <section v-else-if="currentRoute === 'contact'" class="section page-section"><div class="container"><div class="section-heading"><p class="eyebrow">{{ t.contact }}</p><h1>{{ t.contactTitle }}</h1><p>{{ t.contactIntro }}</p></div><div class="two-columns contact-layout"><div class="contact-form-panel"><h2>{{ t.sendMessage }}</h2><p class="muted">{{ t.response }}</p><form @submit.prevent="submitContact"><label>{{ t.name }}<input v-model="form.name" type="text" required></label><label>{{ t.email }}<input v-model="form.email" type="email" required></label><label>{{ t.subject }}<input v-model="form.subject" type="text" required></label><label>{{ t.message }}<textarea v-model="form.message" rows="5" required></textarea></label><p v-if="formError" class="form-error">{{ formError }}</p><button class="button button-primary" type="submit">{{ t.send }} ↗</button></form></div><div class="contact-info"><a class="contact-card" :href="`mailto:${contact.email}`"><strong>{{ t.emailLabel }}</strong><span>{{ contact.email }}</span></a><a class="contact-card" :href="`https://wa.me/${contact.whatsapp}`" target="_blank" rel="noopener noreferrer"><strong>{{ t.whatsappLabel }}</strong><span>{{ contact.phone }}</span></a><a class="contact-card" :href="contact.linkedin" target="_blank" rel="noopener noreferrer"><strong>{{ t.linkedinLabel }}</strong><span>LinkedIn ↗</span></a><div class="contact-card"><strong>{{ t.locationLabel }}</strong><span>{{ contact.location }} · {{ t.remote }}</span></div><div class="faq"><h2>{{ t.faq }}</h2><details><summary>{{ t.faqOne }}</summary><p>{{ t.faqOneAnswer }}</p></details><details><summary>{{ t.faqTwo }}</summary><p>{{ t.faqTwoAnswer }}</p></details></div></div></div></div></section>

      <section v-else-if="routeParts[0] === 'project' && selectedProject" class="section page-section"><div class="container project-detail"><div class="detail-main"><p class="eyebrow">{{ selectedProject.category }}</p><h1>{{ selectedProject.title }}</h1><p class="lead">{{ selectedProject.shortDescription }}</p><img :src="selectedProject.image" :alt="selectedProject.title"><h2>{{ t.projectDescription }}</h2><p>{{ selectedProject.description }}</p><div v-if="selectedProject.role || selectedProject.highlights || selectedProject.outcome" class="case-study"><div v-if="selectedProject.role"><p class="eyebrow">{{ t.roleLabel }}</p><p>{{ language === 'es' ? selectedProject.role : selectedProject.roleEn }}</p></div><div v-if="selectedProject.highlights"><p class="eyebrow">{{ t.highlightsLabel }}</p><ul><li v-for="highlight in (language === 'es' ? selectedProject.highlights : selectedProject.highlightsEn)" :key="highlight">{{ highlight }}</li></ul></div><div v-if="selectedProject.outcome"><p class="eyebrow">{{ t.outcomeLabel }}</p><p>{{ language === 'es' ? selectedProject.outcome : selectedProject.outcomeEn }}</p></div></div></div><aside class="info-panel"><h2>{{ t.projectDetails }}</h2><div class="tag-row large-tags"><span v-for="item in selectedProject.technologies" :key="item" class="tag" :class="techClass(item)">{{ item }}</span></div><a v-if="selectedProject.github" class="button button-secondary full-width" :href="selectedProject.github" target="_blank" rel="noopener noreferrer">{{ t.sourceCode }} ↗</a><a v-if="selectedProject.live" class="button button-primary full-width" :href="selectedProject.live" target="_blank" rel="noopener noreferrer">{{ t.liveDemo }} ↗</a><div v-if="selectedProject.demoType === 'private'" class="project-notice">{{ t.privateDemo }}<span>{{ t.privateCode }}</span></div><div v-else-if="selectedProject.demoType === 'php'" class="project-notice project-notice-warning">{{ t.phpWarning }}</div><div v-else-if="selectedProject.demoType === 'node'" class="project-notice project-notice-warning">{{ t.nodeWarning }}</div><div v-else-if="!selectedProject.live" class="project-notice">{{ t.noDemo }}</div><a class="text-link back-link" href="#projects" @click.prevent="navigate('projects')">← {{ t.back }}</a></aside></div></section>
    </main>

    <footer class="site-footer"><div class="container footer-inner"><div><strong>{{ t.footer }}</strong><p>Vue · Vite · GitHub Pages</p></div><div class="footer-links"><a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub</a><a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a><a :href="`mailto:${contact.email}`">Email</a></div></div></footer>
  </div>
</template>
