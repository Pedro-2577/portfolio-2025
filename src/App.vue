<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { contact, projects } from './data';
import { professionalProfile } from './profile';
import { downloadResumePdf } from './resumePdf';
import { technologyStyle } from './technologyColors';

const assetBase = import.meta.env.BASE_URL;

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
    home: 'Inicio', projects: 'Proyectos', services: 'Gestión de tiendas', about: 'Sobre mí', contact: 'Contacto',
    servicesEyebrow: 'SERVICIO PERSONALIZADO · VENDOALGO', servicesTitle: 'Tu tienda online, configurada para tu operación.', servicesLead: 'Trabajo con VendoAlgo en la implementación y gestión de tiendas online. Me sumo a lo que necesita cada negocio y realizo las configuraciones acordadas, desde el catálogo y los ajustes técnicos hasta las automatizaciones.', servicesIntro: 'El alcance se define según la operación y el pedido de cada negocio: revisamos las tareas, acordamos prioridades y avanzo con lo que necesitan.', servicesCta: 'Coordinar una charla de 30 minutos', servicesContact: 'Contame sobre tu operación',
    serviceSetup: 'Puesta en marcha', serviceSetupText: 'Diseño y configuración de la tienda, carga e importación del catálogo, medios de pago, envíos y acompañamiento para empezar a usarla.', serviceManagement: 'Gestión y respaldo técnico', serviceManagementText: 'Altas y cambios de productos, mantenimiento, asistencia y seguimiento de incidencias para que la tienda siga al día.', serviceAutomation: 'Automatización del trabajo diario', serviceAutomationText: 'Flujos a medida para actualizar stock y precios, revisar novedades de proveedores y reducir tareas repetitivas, según los datos y sistemas disponibles.',
    serviceProcessTitle: 'Empezamos por tu operación', serviceProcessIntro: 'Definimos el alcance con vos; los servicios se adaptan a las prioridades y los procesos de cada negocio.', serviceStepOne: 'Entender el trabajo', serviceStepOneText: 'Revisamos catálogo, proveedores, frecuencia de cambios y tareas que hoy llevan tiempo.', serviceStepTwo: 'Elegir prioridades', serviceStepTwoText: 'Acordamos qué resolver primero y qué información o accesos hacen falta.', serviceStepThree: 'Implementar y acompañar', serviceStepThreeText: 'Configuramos lo acordado, lo ponemos en marcha y ajustamos el trabajo según cómo funcione en la práctica.',
    serviceExperienceTitle: 'Experiencia en VendoAlgo', serviceExperienceText: 'Formo parte del equipo que desarrolló la plataforma y sigue evolucionándola. Conozco su funcionamiento desde el producto y el lado técnico; eso me permite acompañar la configuración de la tienda y el seguimiento de problemas.', servicePlatformLink: 'Conocer VendoAlgo', serviceProjectLink: 'Ver mi experiencia en el portfolio', serviceDemoTitle: 'Una referencia visual', serviceDemoText: 'Kalua es una demo conceptual de tienda online que muestra una experiencia de catálogo y navegación. Es una referencia visual, no una tienda productiva ni un caso de resultados comerciales.', serviceDemoLink: 'Ver demo conceptual de Kalua', serviceFinalTitle: 'Cada tienda necesita una solución distinta', serviceFinalText: 'Contame cómo trabajan hoy y vemos qué tendría sentido resolver primero.', serviceGuideTitle: 'Una guía simple para encontrar qué delegar', serviceGuideIntro: 'En la primera conversación buscamos una tarea concreta y entendemos cómo se hace hoy, qué información usa y qué resultado necesitás.', serviceGuideOne: 'Qué productos y proveedores forman el catálogo', serviceGuideTwo: 'Cómo llegan hoy las novedades de stock y precios', serviceGuideThree: 'Qué tareas se repiten y cuánto tiempo llevan', serviceGuideFour: 'Qué sistemas, archivos o accesos requiere el proceso', serviceScopeTitle: 'Qué puedo hacer por tu tienda', serviceScopeIntro: 'La solución depende de lo que necesite cada negocio. Puedo acompañar la configuración inicial, preparar tareas operativas y dejar automatizaciones listas para el uso diario.', serviceScopeOne: 'Configuración y puesta en marcha de la tienda', serviceScopeTwo: 'Carga e importación de productos y catálogo', serviceScopeThree: 'Configuración de pagos, envíos y opciones de compra', serviceScopeFour: 'Preparación y configuración de bots para tareas concretas', serviceScopeFive: 'Automatización de stock, precios y novedades de proveedores', serviceScopeSix: 'Mantenimiento, ajustes y asistencia técnica', serviceStoresTitle: 'Tiendas en las que colaboré desde VendoAlgo', serviceStoresIntro: 'Mi participación cambia según lo que solicita cada negocio: puede incluir configurar bots, preparar una configuración o resolver otras tareas de los servicios de VendoAlgo.', serviceStoresNote: 'Algunas tiendas siguen en desarrollo o tienen configuraciones pendientes. Los enlaces muestran su estado actual; no implican que todos los catálogos o funciones estén terminados.', serviceStoreVisit: 'Visitar tienda', serviceStoreLabel: 'Tienda VendoAlgo', serviceDemoNotice: 'Proyecto de muestra · desarrollo de tienda', storeFumigar: 'FumigAR', storeFumigarDesc: 'Tienda online de productos para control de plagas.', storeCctv: 'CCTV Store', storeCctvDesc: 'Catálogo online de cámaras y soluciones de seguridad.', storeRedes: 'Redes para Balcón', storeRedesDesc: 'Tienda de redes de protección, redes deportivas y sogas.', storeTiendarg: 'TiendARG', storeTiendargDesc: 'Tienda online de productos de distintas categorías.',
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
    contactTitle: 'Contame qué necesitás. Vemos cómo avanzar.', contactIntro: 'Si tenés una tienda, una idea o una tarea que querés delegar, elegí cómo te resulta más cómodo contactarme. Leo y respondo yo.', contactPersonal: 'Vas a hablar directamente conmigo, Pedro.', contactBook: 'Coordinar un Meet de 30 minutos', contactBookEyebrow: 'SI PREFERÍS CONVERSAR', contactBookText: 'Elegí un horario disponible y nos conectamos por Google Meet.', contactWhatsappTitle: 'Escribime por WhatsApp', contactWhatsappText: 'Para una consulta corta o para empezar por un mensaje.', contactEmailTitle: 'Mandame un correo', contactEmailText: 'Ideal para explicar con más detalle qué necesitás.', contactLinkedinTitle: 'Conectemos en LinkedIn', contactLinkedinText: 'Mirá mi experiencia profesional y escribime por ahí.', contactScheduleHint: 'Ver horarios disponibles', contactWhatsAppMessage: 'Hola Pedro, vi tu portfolio y quería consultarte sobre tus servicios.', contactGuideTitle: '¿Qué me podés contar?', contactGuideIntro: 'Con un poco de contexto puedo orientarte mejor:', contactGuideOne: 'Qué vende tu negocio o qué proyecto estás pensando', contactGuideTwo: 'Qué tarea, problema o proceso querés resolver', contactGuideThree: 'Qué herramientas o sistemas usás hoy, si aplica', contactFormNote: 'Al abrir el correo, vas a poder revisar el mensaje antes de enviarlo.',
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
    servicesEyebrow: 'TAILORED SERVICE · VENDOALGO', servicesTitle: 'An online store configured for your operation.', servicesLead: 'I work with VendoAlgo on store implementation and management. I take on each business’s requested tasks, from catalog setup and technical adjustments to automations.', servicesIntro: 'The scope depends on each business and its needs: we review the tasks, agree on priorities, and I handle the requested work.', servicesCta: 'Book a 30-minute call', servicesContact: 'Tell me about your operation',
    serviceSetup: 'Store setup', serviceSetupText: 'Store design and configuration, catalog upload and import, payment methods, shipping, and guidance to get started.', serviceManagement: 'Ongoing management and technical support', serviceManagementText: 'Product additions and changes, maintenance, assistance, and issue follow-up to keep the store up to date.', serviceAutomation: 'Daily operations automation', serviceAutomationText: 'Custom workflows to update stock and prices, review supplier updates, and reduce repetitive work, based on the available data and systems.',
    serviceProcessTitle: 'Start with your operation', serviceProcessIntro: 'We define the scope together; services adapt to each business’s priorities and processes.', serviceStepOne: 'Understand the work', serviceStepOneText: 'We review your catalog, suppliers, update frequency, and the tasks that take time today.', serviceStepTwo: 'Choose priorities', serviceStepTwoText: 'We agree what to solve first and what information or access is needed.', serviceStepThree: 'Implement and support', serviceStepThreeText: 'I configure what we agreed on, launch it, and adjust based on how it works in practice.',
    serviceExperienceTitle: 'Experience at VendoAlgo', serviceExperienceText: 'I am part of the team that built the platform and continues to evolve it. I know how it works from both product and technical perspectives, which helps me support store setup and issue follow-up.', servicePlatformLink: 'Explore VendoAlgo', serviceProjectLink: 'View my portfolio experience', serviceDemoTitle: 'A visual reference', serviceDemoText: 'Kalua is a conceptual online store demo showing a catalog and browsing experience. It is a visual reference, not a live store or a commercial-results case study.', serviceDemoLink: 'View the Kalua concept demo', serviceFinalTitle: 'Every store needs a different solution', serviceFinalText: 'Tell me how your business works today and we can decide what makes sense to solve first.', serviceGuideTitle: 'A simple way to find what to delegate', serviceGuideIntro: 'In our first conversation, we identify one concrete task and understand how it works today, what information it uses, and what result you need.', serviceGuideOne: 'Which products and suppliers make up the catalog', serviceGuideTwo: 'How stock and price updates arrive today', serviceGuideThree: 'Which tasks repeat and how much time they take', serviceGuideFour: 'Which systems, files, or access the process requires', serviceScopeTitle: 'Ways I can support your store', serviceScopeIntro: 'The right solution depends on each business. I can help with initial setup, prepare operational workflows, and configure automations for day-to-day work.', serviceScopeOne: 'Store configuration and launch setup', serviceScopeTwo: 'Product and catalog uploads or imports', serviceScopeThree: 'Payment, shipping, and checkout configuration', serviceScopeFour: 'Preparing and configuring bots for specific tasks', serviceScopeFive: 'Automating stock, prices, and supplier updates', serviceScopeSix: 'Maintenance, adjustments, and technical support', serviceStoresTitle: 'Stores I have supported through VendoAlgo', serviceStoresIntro: 'My role varies with each business request. It may include configuring bots, preparing a setup, or handling other tasks included in VendoAlgo services.', serviceStoresNote: 'Some stores are still being developed or have pending configuration. The links show their current state; they do not imply that every catalog or feature is complete.', serviceStoreVisit: 'Visit store', serviceStoreLabel: 'VendoAlgo store', serviceDemoNotice: 'Sample project · store development', storeFumigar: 'FumigAR', storeFumigarDesc: 'Online store for pest-control products.', storeCctv: 'CCTV Store', storeCctvDesc: 'Online catalog for cameras and security solutions.', storeRedes: 'Redes para Balcón', storeRedesDesc: 'Online store for safety nets, sports nets, and ropes.', storeTiendarg: 'TiendARG', storeTiendargDesc: 'Online store with products across several categories.',
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
    contactTitle: 'Tell me what you need. Let’s find a way forward.', contactIntro: 'If you run a store, have an idea, or want to delegate a task, choose the way that works best for you. I read and reply personally.', contactPersonal: 'You’ll be speaking directly with me, Pedro.', contactBook: 'Book a 30-minute Meet', contactBookEyebrow: 'IF YOU WOULD RATHER TALK', contactBookText: 'Pick an available time and we’ll meet on Google Meet.', contactWhatsappTitle: 'Message me on WhatsApp', contactWhatsappText: 'For a quick question or to start with a message.', contactEmailTitle: 'Send me an email', contactEmailText: 'Best if you want to explain what you need in more detail.', contactLinkedinTitle: 'Connect on LinkedIn', contactLinkedinText: 'See my professional experience and reach out there.', contactScheduleHint: 'See available times', contactWhatsAppMessage: 'Hi Pedro, I saw your portfolio and would like to ask about your services.', contactGuideTitle: 'What should you include?', contactGuideIntro: 'A little context helps me point you in the right direction:', contactGuideOne: 'What your business sells or the project you have in mind', contactGuideTwo: 'The task, problem, or process you want to address', contactGuideThree: 'The tools or systems you use today, if relevant', contactFormNote: 'Your email app will open so you can review the message before sending.',
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
  return project.currentSite || project.demoType === 'development' ? null : project.live || null;
}

function projectButtonLabel(project) {
  return project.academic ? t.value.demo : t.value.viewProject;
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
          <a :class="{ active: currentRoute === 'services' }" href="#services" @click.prevent="navigate('services')">{{ t.services }}</a>
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
        <div class="hero-layout">
          <div class="hero-main">
          <p class="eyebrow">{{ t.role }} <span class="eyebrow-dot"></span> Buenos Aires</p>
          <h1>{{ t.greeting }} <span>Pedro.</span><br><em>{{ t.tagline }}</em></h1>
          <p class="hero-copy">{{ t.hero }}</p>
          <div class="button-row">
            <button class="button button-download" type="button" @click="downloadResume">{{ t.resumeDownload }}</button>
            <a class="button button-light" href="#projects" @click.prevent="navigate('projects')">{{ t.viewProjects }}</a>
            <a class="button button-outline" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a>
          </div>
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
        </div>
      </section>

      <template v-if="currentRoute === 'home'">
        <section class="section">
          <div class="container">
            <div class="section-heading section-heading-left"><p class="eyebrow">01 / {{ t.skills }}</p><h2>{{ t.skills }}</h2><p>{{ t.skillsIntro }}</p></div>
            <div class="skill-grid">
              <div v-for="area in profile.skills.slice(0, 4)" :key="area.title" class="skill-card"><strong>{{ area.title }}</strong><span>{{ (area.homeItems || area.items.slice(0, 3)).join(' · ') }}</span><small v-if="area.focus">{{ area.focus }}</small></div>
            </div>
          </div>
        </section>
        <section class="section section-muted">
          <div class="container"><div class="section-heading section-heading-left"><p class="eyebrow">02 / {{ t.featured }}</p><h2>{{ t.featured }}</h2><p>{{ t.featuredIntro }}</p></div><div class="project-grid"><article v-for="project in featuredProjects" :key="project.id" class="project-card" :class="{ 'project-card-lead': project.id === 1 }"><div class="project-image"><img :src="project.image" :alt="project.title"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="t.repository" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div><div class="center"><a class="button button-primary" href="#projects" @click.prevent="navigate('projects')">{{ t.allProjects }}</a></div></div>
        </section>
        <section class="section academic-preview"><div class="container"><div class="category-divider"><span>{{ t.academicProjects }}</span></div><div class="project-grid"><article v-for="project in academicProjects.slice(0, 3)" :key="project.id" class="project-card academic-card"><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="card-actions"><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="t.repository" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }} →</a></div></div></article></div></div></section>
        <section class="availability"><div class="container availability-inner"><div><p class="eyebrow">{{ t.availability }}</p><h2>{{ t.availability }}</h2><p>{{ t.availabilityText }}</p></div><a class="button button-light" href="#contact" @click.prevent="navigate('contact')">{{ t.talk }}</a></div></section>
      </template>

      <section v-else-if="currentRoute === 'projects'" class="section page-section">
        <div class="container"><div class="section-heading section-heading-left"><p class="eyebrow">03 / {{ t.projects }}</p><h1>{{ t.myProjects }}</h1><p>{{ t.projectsIntro }}</p></div><div class="filters"><input v-model="search" type="search" :placeholder="t.search"><select v-model="technology"><option value="">{{ t.allTechnologies }}</option><option v-for="item in technologies" :key="item" :value="item">{{ item }}</option></select><label><input v-model="featuredOnly" type="checkbox"> {{ t.onlyFeatured }}</label><button v-if="search || technology || featuredOnly" class="text-button" type="button" @click="search = ''; technology = ''; featuredOnly = false">{{ t.clear }}</button></div><p class="result-count">{{ filteredProjects.length }} {{ t.results }}</p><div v-if="filteredProjects.some((project) => !project.academic)" class="category-divider"><span>{{ t.professionalProjects }}</span></div><div v-if="filteredProjects.length" class="project-grid"><article v-for="project in filteredProjects.filter((item) => !item.academic)" :key="project.id" class="project-card"><div class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="t.repository" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div><div v-else class="empty-state"><h2>{{ t.noResults }}</h2><p>{{ t.adjust }}</p></div><div v-if="filteredProjects.some((project) => project.academic)" class="category-divider"><span>{{ t.academicProjects }}</span></div><div class="project-grid"><article v-for="project in filteredProjects.filter((item) => item.academic)" :key="project.id" class="project-card academic-card"><div v-if="project.preview" class="project-image"><img :src="project.image" :alt="project.title" loading="lazy"><span class="project-number">0{{ project.id }}</span></div><div class="card-body"><div class="card-kicker"><span>{{ project.category }}</span><span>{{ project.startDate }}</span></div><h3>{{ project.title }}</h3><p>{{ project.shortDescription }}</p><div class="tag-row"><span v-for="item in project.technologies" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div><div class="card-actions"><a class="text-link card-details" :href="`#project/${project.slug}`" @click.prevent="navigate(`project/${project.slug}`)">{{ t.details }}</a><a v-if="projectUrl(project)" class="button button-small button-primary" :href="projectUrl(project)" @click="confirmDemoStart($event, project)" :target="project.live && project.demoType === 'php' ? '_self' : '_blank'" rel="noopener noreferrer">{{ projectButtonLabel(project) }} ↗</a><span v-else-if="project.currentSite" class="project-current-site">{{ t.currentSite }}</span><span v-else-if="project.demoType === 'development'" class="project-status">{{ t.inDevelopment }}</span><a v-if="project.github && !project.private" class="text-link card-repository" :aria-label="t.repository" :href="project.github" target="_blank" rel="noopener noreferrer">{{ t.github }} ↗</a></div></div></article></div></div>
      </section>

      <section v-else-if="currentRoute === 'services'" class="section page-section services-page">
        <div class="container">
          <header class="services-hero">
            <p class="eyebrow">{{ t.servicesEyebrow }}</p>
            <h1>{{ t.servicesTitle }}</h1>
            <p class="services-lead">{{ t.servicesLead }}</p>
            <p class="services-intro">{{ t.servicesIntro }}</p>
            <div class="button-row">
              <a class="button button-primary" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ32S-DKDk1irg5ODqUJGUMKz41FLTRoLJh0gwUDu18GhqYozyuLcLxKTE955yYV592Tg0iRFsMQ" target="_blank" rel="noopener noreferrer">{{ t.servicesCta }} ↗</a>
              <a class="button button-secondary" href="#contact" @click.prevent="navigate('contact')">{{ t.servicesContact }}</a>
            </div>
          </header>

          <section class="service-offerings"  :aria-label="t.services">
            <article class="service-card"><span class="service-number">01</span><h2>{{ t.serviceSetup }}</h2><p>{{ t.serviceSetupText }}</p></article>
            <article class="service-card"><span class="service-number">02</span><h2>{{ t.serviceManagement }}</h2><p>{{ t.serviceManagementText }}</p></article>
            <article class="service-card"><span class="service-number">03</span><h2>{{ t.serviceAutomation }}</h2><p>{{ t.serviceAutomationText }}</p></article>
          </section>

          <section class="service-process">
            <div class="section-heading section-heading-left"><p class="eyebrow">01 / {{ t.serviceProcessTitle }}</p><h2>{{ t.serviceProcessTitle }}</h2><p>{{ t.serviceProcessIntro }}</p></div>
            <div class="service-steps">
              <article><span class="service-number">01</span><h3>{{ t.serviceStepOne }}</h3><p>{{ t.serviceStepOneText }}</p></article>
              <article><span class="service-number">02</span><h3>{{ t.serviceStepTwo }}</h3><p>{{ t.serviceStepTwoText }}</p></article>
              <article><span class="service-number">03</span><h3>{{ t.serviceStepThree }}</h3><p>{{ t.serviceStepThreeText }}</p></article>
            </div>
          </section>

          <section class="service-guide">
            <header><p class="eyebrow">GUÍA DE TRABAJO</p><h2>{{ t.serviceGuideTitle }}</h2><p>{{ t.serviceGuideIntro }}</p></header>
            <ol>
              <li>{{ t.serviceGuideOne }}</li><li>{{ t.serviceGuideTwo }}</li>
              <li>{{ t.serviceGuideThree }}</li><li>{{ t.serviceGuideFour }}</li>
            </ol>
          </section>

          <section class="service-scope">
            <div class="section-heading section-heading-left"><p class="eyebrow">02 / {{ t.services }}</p><h2>{{ t.serviceScopeTitle }}</h2><p>{{ t.serviceScopeIntro }}</p></div>
            <ul class="service-scope-list">
              <li>{{ t.serviceScopeOne }}</li><li>{{ t.serviceScopeTwo }}</li><li>{{ t.serviceScopeThree }}</li>
              <li>{{ t.serviceScopeFour }}</li><li>{{ t.serviceScopeFive }}</li><li>{{ t.serviceScopeSix }}</li>
            </ul>
          </section>

          <section class="service-stores">
            <header class="service-stores-heading"><p class="eyebrow">VENDOALGO · E-COMMERCE</p><h2>{{ t.serviceStoresTitle }}</h2><p>{{ t.serviceStoresIntro }}</p></header>
            <div class="service-store-grid">
              <a class="service-store-card" href="https://fumig.ar/" target="_blank" rel="noopener noreferrer">
                <div class="service-store-image"><img src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Ffumig.ar%2F?w=1100" alt="Vista previa de FumigAR" loading="lazy" @error="$event.target.style.display='none'"><span class="service-store-domain">fumig.ar</span></div>
                <div class="service-store-copy"><p class="eyebrow">{{ t.serviceStoreLabel }}</p><h3>{{ t.storeFumigar }}</h3><p>{{ t.storeFumigarDesc }}</p><span class="text-link">{{ t.serviceStoreVisit }} ↗</span></div>
              </a>
              <a class="service-store-card" href="https://cctvstore.vendoalgo.com/" target="_blank" rel="noopener noreferrer">
                <div class="service-store-image"><img src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Fcctvstore.vendoalgo.com%2F?w=1100" alt="Vista previa de CCTV Store" loading="lazy" @error="$event.target.style.display='none'"><span class="service-store-domain">cctvstore.vendoalgo.com</span></div>
                <div class="service-store-copy"><p class="eyebrow">{{ t.serviceStoreLabel }}</p><h3>{{ t.storeCctv }}</h3><p>{{ t.storeCctvDesc }}</p><span class="text-link">{{ t.serviceStoreVisit }} ↗</span></div>
              </a>
              <a class="service-store-card" href="https://redesparabalcon.com.ar/" target="_blank" rel="noopener noreferrer">
                <div class="service-store-image"><img src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Fredesparabalcon.com.ar%2F?w=1100" alt="Vista previa de Redes para Balcón" loading="lazy" @error="$event.target.style.display='none'"><span class="service-store-domain">redesparabalcon.com.ar</span></div>
                <div class="service-store-copy"><p class="eyebrow">{{ t.serviceStoreLabel }}</p><h3>{{ t.storeRedes }}</h3><p>{{ t.storeRedesDesc }}</p><span class="text-link">{{ t.serviceStoreVisit }} ↗</span></div>
              </a>
              <a class="service-store-card" href="https://tiendarg.com.ar/" target="_blank" rel="noopener noreferrer">
                <div class="service-store-image"><img src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Ftiendarg.com.ar%2F?w=1100" alt="Vista previa de TiendARG" loading="lazy" @error="$event.target.style.display='none'"><span class="service-store-domain">tiendarg.com.ar</span></div>
                <div class="service-store-copy"><p class="eyebrow">{{ t.serviceStoreLabel }}</p><h3>{{ t.storeTiendarg }}</h3><p>{{ t.storeTiendargDesc }}</p><span class="text-link">{{ t.serviceStoreVisit }} ↗</span></div>
              </a>
            </div>
            <p class="service-stores-note">{{ t.serviceStoresNote }}</p>
          </section>

          <section class="service-evidence">
            <article class="service-evidence-card"><p class="eyebrow">VENDOALGO</p><h2>{{ t.serviceExperienceTitle }}</h2><p>{{ t.serviceExperienceText }}</p><div class="button-row"><a class="text-link" href="https://vendoalgo.com/" target="_blank" rel="noopener noreferrer">{{ t.servicePlatformLink }} ↗</a><a class="text-link" href="#project/vendoalgo" @click.prevent="navigate('project/vendoalgo')">{{ t.serviceProjectLink }} →</a></div></article>
            <article class="service-evidence-card service-demo-card"><p class="eyebrow">DEMO CONCEPTUAL</p><h2>{{ t.serviceDemoTitle }}</h2><p>{{ t.serviceDemoText }}</p><a class="text-link" href="https://pedro-2577.github.io/Kalua/" target="_blank" rel="noopener noreferrer">{{ t.serviceDemoLink }} ↗</a></article>
          </section>

          <section class="service-final">
            <div><p class="eyebrow">{{ t.services }}</p><h2>{{ t.serviceFinalTitle }}</h2><p>{{ t.serviceFinalText }}</p></div>
            <a class="button button-light" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ32S-DKDk1irg5ODqUJGUMKz41FLTRoLJh0gwUDu18GhqYozyuLcLxKTE955yYV592Tg0iRFsMQ" target="_blank" rel="noopener noreferrer">{{ t.servicesCta }} ↗</a>
          </section>
        </div>
      </section>

      <section v-else-if="currentRoute === 'about'" class="section page-section cv-about">
        <div class="container">
          <div class="cv-intro-layout"><header class="cv-intro"><p class="eyebrow">04 / {{ t.about }}</p><h1>{{ t.aboutTitle }}</h1><p class="cv-lead">{{ t.aboutIntro }}</p><p>{{ t.storyOne }}</p><p>{{ t.storyTwo }}</p><div class="cv-intro-actions"><button class="button button-primary" type="button" @click="downloadResume">{{ t.resumeDownload }}</button></div></header>
            <figure class="about-portrait"><img :src="assetBase + 'pedro-about.png'" alt="Pedro Martín Méndez Carabán" width="666" height="888" loading="lazy" decoding="async"></figure>
          </div>
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
              <section class="info-panel"><h2>{{ profile.skillsTitle }}</h2><div v-for="area in profile.skills" :key="area.title" class="cv-skill-area"><h3>{{ area.title }}</h3><div class="tag-row"><span v-for="item in area.items" :key="item" class="tag" :class="{ 'tag-branded': technologyStyle(item) }" :style="technologyStyle(item)">{{ item }}</span></div></div></section>
              <section class="info-panel"><h2>{{ profile.languagesTitle }}</h2><p>{{ profile.languages }}</p><div class="quote-box"><strong>{{ profile.strengthsTitle }}</strong><p>{{ profile.strengths }}</p></div></section>
              <section class="info-panel"><h2>{{ t.workflowTitle }}</h2><p>{{ t.workflowText }}</p></section>
            </aside>
          </div>
        </div>
      </section>

      <section v-else-if="currentRoute === 'contact'" class="section page-section contact-page">
        <div class="container">
          <header class="contact-hero">
            <div>
              <p class="eyebrow">{{ t.contact }}</p>
              <h1>{{ t.contactTitle }}</h1>
              <p class="contact-hero-copy">{{ t.contactIntro }}</p>
              <p class="contact-personal"><span aria-hidden="true"></span>{{ t.contactPersonal }}</p>
            </div>
            <a class="button button-light contact-hero-cta" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ32S-DKDk1irg5ODqUJGUMKz41FLTRoLJh0gwUDu18GhqYozyuLcLxKTE955yYV592Tg0iRFsMQ" target="_blank" rel="noopener noreferrer">{{ t.contactBook }} <span aria-hidden="true">↗</span></a>
          </header>

          <div class="contact-methods">
            <a class="contact-method contact-method-meet" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ32S-DKDk1irg5ODqUJGUMKz41FLTRoLJh0gwUDu18GhqYozyuLcLxKTE955yYV592Tg0iRFsMQ" target="_blank" rel="noopener noreferrer">
              <span class="contact-method-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 13h3v3H8z"/></svg></span>
              <span class="contact-method-copy"><span class="eyebrow">{{ t.contactBookEyebrow }}</span><strong>{{ t.contactBook }}</strong><span>{{ t.contactBookText }}</span><em>{{ t.contactScheduleHint }} ↗</em></span>
            </a>
            <a class="contact-method" :href="`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(t.contactWhatsAppMessage)}`" target="_blank" rel="noopener noreferrer">
              <span class="contact-method-icon contact-icon-whatsapp" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 9.2c.5 2.3 2.3 4 4.7 4.7l1.1-1.1 2 .9c-.2 1.2-.9 1.9-2.2 2-3.7-.4-7-3.6-7.3-7.2.1-1.3.8-2 2-2.2l.9 2Z"/></svg></span>
              <span class="contact-method-copy"><span class="eyebrow">{{ t.whatsappLabel }}</span><strong>{{ t.contactWhatsappTitle }}</strong><span>{{ t.contactWhatsappText }}</span><em>{{ contact.phone }} ↗</em></span>
            </a>
            <a class="contact-method" :href="`mailto:${contact.email}`">
              <span class="contact-method-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span>
              <span class="contact-method-copy"><span class="eyebrow">{{ t.emailLabel }}</span><strong>{{ t.contactEmailTitle }}</strong><span>{{ t.contactEmailText }}</span><em>{{ contact.email }} ↗</em></span>
            </a>
            <a class="contact-method" :href="contact.linkedin" target="_blank" rel="noopener noreferrer">
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

    <footer class="site-footer"><div class="container footer-inner"><div><strong>{{ t.footer }}</strong><p>Vue · Vite · GitHub Pages</p></div><div class="footer-links"><a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub</a><a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a><a :href="`mailto:${contact.email}`">Email</a></div></div></footer>
  </div>
</template>
