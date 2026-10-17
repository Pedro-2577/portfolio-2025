<script setup>
import { computed, ref } from 'vue';
import { storePlatformPricing } from './storeServices';

const props = defineProps({ language: { type: String, default: 'es' } });
const es = computed(() => props.language !== 'en');
const selected = ref([]);
const expanded = ref(false);
const platform = ref('unsure');
const modules = ref([]);
const inquiry = ref({ name: '', business: '', message: '' });
const options = [
  { id: 'design', price: 60000, es: 'Diseño de la tienda', en: 'Store design and visual setup', descEs: 'Preparo la portada, los colores y las páginas básicas con tu logo y tus textos. Los diseños especiales se presupuestan aparte.', descEn: 'Colors, homepage, navigation and basic pages using your logo and content. Setup on VendoAlgo; custom development is quoted separately.' },
  { id: 'catalog', price: 40000, es: 'Cargar hasta 40 productos', en: 'Initial upload of up to 40 products', descEs: 'Con las fotos, los precios y la información ordenada que me entregues. Más productos, muchas opciones como talles o colores, o productos de otra tienda se revisan aparte.', descEn: 'Using complete, organized photos, prices and data you provide. Larger catalogs, complex variants and migrations require review.' },
  { id: 'payments', price: 15000, es: 'Dejar listos los medios de pago', en: 'Payment setup', descEs: 'Dejo listas las opciones disponibles para que tus clientes puedan pagar. Las comisiones del medio de pago se cobran aparte.', descEn: 'Standard payment methods available on the platform, using your accounts and details. Payment processing fees are separate.' },
  { id: 'shipping', price: 20000, es: 'Dejar listos los envíos y el retiro', en: 'Shipping and pickup setup', descEs: 'Preparo las opciones básicas de envío y retiro, con tus precios de entrega. Los casos especiales se revisan antes de confirmar.', descEn: 'Basic delivery and pickup setup using available options and your rates. Special rules are reviewed before confirmation.' },
  { id: 'training', price: 15000, es: 'Aprender a usar la tienda · 1 hora', en: 'Initial training · 1 hour', descEs: 'Una hora para aprender las tareas de todos los días. Podés pedir más clases o ayuda para tus empleados si lo necesitás.', descEn: 'One session covering everyday store tasks. Additional training and team onboarding are quoted separately.' },
];
const serviceGroups = [
  {
    "id": "catalogue",
    "es": "Productos y diseño",
    "en": "Catalog and presentation",
    "introEs": "Para ampliar o reorganizar una tienda que ya existe.",
    "introEn": "Expand or reorganize an existing store."
  },
  {
    "id": "automation",
    "es": "Precios y productos al día",
    "en": "Automated tasks",
    "introEs": "Elegí qué querés mantener al día. Si varias tareas comparten proveedor o información, las evalúo juntas para evitar trabajo duplicado.",
    "introEn": "Choose what to keep up to date. Tasks sharing a supplier or information are assessed together to avoid duplicate work."
  },
  {
    "id": "configuration",
    "es": "Mercado Libre, facturas y envíos",
    "en": "Additional configuration",
    "introEs": "Funciones que podés sumar según cómo trabaja tu negocio.",
    "introEn": "Features to add based on how your business operates."
  },
  {
    "id": "team",
    "es": "Tu equipo de trabajo",
    "en": "Team and training",
    "introEs": "Ayuda para organizar a las personas que trabajan con tu tienda.",
    "introEn": "Help organizing the people who work with your store."
  },
  {
    "id": "support",
    "es": "Ayuda con tu tienda",
    "en": "Maintenance and support",
    "introEs": "Podés pedirme resolver algo puntual o acompañarte cada mes.",
    "introEn": "Ask for a specific fix or ongoing monthly support."
  }
];
const extras = [
  {
    "id": "migration",
    "group": "catalogue",
    "mode": "once",
    "es": "Pasar productos de otra tienda",
    "en": "Migrate products from another store",
    "descEs": "Paso los productos y sus datos desde tu tienda anterior. Esta opción reemplaza la carga inicial de esos mismos productos.",
    "descEn": "I review the source catalog and import the agreed products and data. An alternative to initial upload: the same products are not charged twice."
  },
  {
    "id": "more-products",
    "group": "catalogue",
    "mode": "once",
    "es": "Agregar más productos",
    "en": "Upload additional products",
    "descEs": "Cargo productos nuevos en una tienda que ya existe o sumo más de los 40 incluidos al empezar.",
    "descEn": "Expand an existing catalog or go beyond the initial 40 products. The quote specifies the additional quantity and included work."
  },
  {
    "id": "catalog-order",
    "group": "catalogue",
    "mode": "once",
    "es": "Ordenar los productos",
    "en": "Organize categories, variants and listings",
    "descEs": "Organizo las secciones y la información de tus productos, incluidos talles, colores u otras opciones.",
    "descEn": "Reorganize your existing catalog and adjust the information you supply to make products easier to find and choose."
  },
  {
    "id": "visual-changes",
    "group": "catalogue",
    "mode": "once",
    "es": "Mejorar el diseño de tu tienda actual",
    "en": "Adjust the design of an existing store",
    "descEs": "Ajusto la portada, los colores y las secciones con los textos y las imágenes que me entregues.",
    "descEn": "Adjust styles, homepage, sections and content using your materials. For a new store, choose the launch design service."
  },
  {
    "id": "auto-prices",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar los precios automáticamente",
    "en": "Update prices automatically",
    "descEs": "Los precios se actualizan con los costos de tu proveedor y los cálculos que acordemos.",
    "descEn": "Based on supplier costs and agreed rules, including input cost or margin calculations where needed."
  },
  {
    "id": "auto-stock",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar las cantidades disponibles",
    "en": "Update stock automatically",
    "descEs": "La cantidad de cada producto se actualiza con la información que acordemos usar.",
    "descEn": "Keep stock up to date using agreed information sources and schedule."
  },
  {
    "id": "auto-new",
    "group": "automation",
    "mode": "both",
    "es": "Agregar productos nuevos del proveedor",
    "en": "Add new supplier products",
    "descEs": "Preparo la incorporación de los productos nuevos que quieras vender.",
    "descEn": "Set up new product additions using your categories, information and criteria."
  },
  {
    "id": "auto-discontinued",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar productos que el proveedor deja de vender",
    "en": "Handle discontinued products",
    "descEs": "Acordamos si deben dejar de mostrarse o aparecer como no disponibles.",
    "descEn": "Agree how to handle products a supplier stops offering: update availability or deactivate them according to your rules."
  },
  {
    "id": "auto-offers",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar las ofertas automáticamente",
    "en": "Update offers automatically",
    "descEs": "Las ofertas cambian con los precios, las fechas y las condiciones que acordemos.",
    "descEn": "Set up promotional price changes based on agreed information, conditions and schedule."
  },
  {
    "id": "ml",
    "group": "configuration",
    "mode": "once",
    "es": "Conectar Mercado Libre con tu tienda",
    "en": "Set up Mercado Libre",
    "descEs": "Te ayudo a dejar funcionando la conexión disponible en VendoAlgo. Esa función tiene un costo mensual aparte.",
    "descEn": "Help connect and configure the VendoAlgo module you subscribe to. The module subscription is shown separately."
  },
  {
    "id": "arca",
    "group": "configuration",
    "mode": "once",
    "es": "Preparar las facturas automáticas (ARCA)",
    "en": "Set up automatic ARCA invoicing",
    "descEs": "Dejo lista la opción para que la tienda emita las facturas automáticamente. Esa función tiene un costo mensual aparte.",
    "descEn": "Configure the module using the required details and access. Its monthly subscription is shown separately."
  },
  {
    "id": "shipping-rules",
    "group": "configuration",
    "mode": "once",
    "es": "Preparar entregas con condiciones especiales",
    "en": "Set up special delivery rules",
    "descEs": "Organizo zonas, precios y condiciones de entrega que no entren en la preparación básica.",
    "descEn": "Review extra delivery zones, rates and conditions outside basic shipping setup."
  },
  {
    "id": "team-training",
    "group": "team",
    "mode": "once",
    "es": "Enseñar a tu equipo a usar la tienda",
    "en": "Train staff for their roles",
    "descEs": "Cada persona aprende las tareas que necesita hacer: cargar productos, atender ventas o preparar pedidos.",
    "descEn": "Teach the tasks each person needs: catalog, orders, sales or operations. Participants and sessions are agreed."
  },
  {
    "id": "roles",
    "group": "team",
    "mode": "once",
    "es": "Elegir qué puede hacer cada empleado",
    "en": "Set staff roles and permissions",
    "descEs": "Dejo definido qué puede ver y cambiar cada persona. Esta opción necesita el plan Pro de VendoAlgo.",
    "descEn": "Configure what each employee can see and do in the store. Requires the VendoAlgo Pro plan."
  },
  {
    "id": "hiring",
    "group": "team",
    "mode": "once",
    "es": "Ayudarte a buscar personal",
    "en": "Help find and onboard staff",
    "descEs": "Te ayudo a buscar y preparar a la persona que necesitás. El pago de esa persona se acuerda y se paga aparte.",
    "descEn": "Designer, operator, salesperson or community manager. Agree on the search and onboarding; that person's fees or salary are separate."
  },
  {
    "id": "maintenance",
    "group": "support",
    "mode": "monthly",
    "es": "Ayuda y mantenimiento cada mes",
    "en": "Monthly maintenance and support",
    "descEs": "Me ocupo de los cambios y problemas que acordemos. Si algo depende de VendoAlgo, sigo el pedido de solución.",
    "descEn": "Changes and issue handling within the agreed scope. I follow up on incidents requiring the VendoAlgo team's involvement."
  },
  {
    "id": "technical-help",
    "group": "support",
    "mode": "once",
    "es": "Ayuda con un problema de la tienda",
    "en": "Resolve a specific issue",
    "descEs": "Reviso qué está pasando y qué se puede hacer. Si hace falta más trabajo, te aviso antes de continuar.",
    "descEn": "Review the issue and propose an approach. If it depends on the platform, I escalate it and follow up."
  }
];
const details = ref({ productCount: '', source: '', suppliers: '', frequency: '', teamSize: '', roles: [], issue: '', catalogueNotes: '', configurationNotes: '', supportNotes: '' });
const staffRoles = [
  { id: 'designer', es: 'Diseñador', en: 'Designer' },
  { id: 'operator', es: 'Operario', en: 'Operator' },
  { id: 'sales', es: 'Vendedor', en: 'Salesperson' },
  { id: 'cm', es: 'Persona para manejar tus redes sociales', en: 'Community manager' },
];
// Proposed service estimates, 2026-10-17. These are Pedro's scoped rates,
// informed by published comparable services, not competitor quotes for each item.
// References: nudge.com.ar/diseno-de-tiendas-online-en-tiendanube/
// aotech.com.ar (migration and hourly training); vantage-growth.com/automatizacion
// julimarketing.com/desarrollo-ecommerce/ (monthly support).
const extraRates = {
  "migration": {
    "initial": 60000,
    "monthly": 0,
    "scopeEs": "Hasta 100 productos desde un archivo ordenado de tu tienda anterior.",
    "scopeEn": "Base: up to 100 products from an organized store export."
  },
  "more-products": {
    "initial": 15000,
    "monthly": 0,
    "scopeEs": "Una tanda de hasta 10 productos con fotos y datos completos.",
    "scopeEn": "Base: one batch of up to 10 extra products with complete materials."
  },
  "catalog-order": {
    "initial": 20000,
    "monthly": 0,
    "scopeEs": "Hasta 50 productos y 10 secciones del catálogo.",
    "scopeEn": "Base: review of up to 50 products and 10 categories."
  },
  "visual-changes": {
    "initial": 35000,
    "monthly": 0,
    "scopeEs": "Cambios en hasta 2 secciones, con tus textos e imágenes.",
    "scopeEn": "Base: adjustments to up to 2 sections using your materials."
  },
  "auto-prices": {
    "initial": 120000,
    "monthly": 25000,
    "scopeEs": "Un proveedor, hasta 100 productos y una actualización al día con cálculos sencillos. Incluye una revisión al mes y hasta una hora para pequeños ajustes de esta tarea. Si varias tareas usan el mismo proveedor, descuento la preparación y revisión que comparten.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-stock": {
    "initial": 110000,
    "monthly": 20000,
    "scopeEs": "Un proveedor, hasta 100 productos y una actualización al día con cálculos sencillos. Incluye una revisión al mes y hasta una hora para pequeños ajustes de esta tarea. Si varias tareas usan el mismo proveedor, descuento la preparación y revisión que comparten.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-new": {
    "initial": 130000,
    "monthly": 25000,
    "scopeEs": "Un proveedor, hasta 100 productos y una actualización al día con cálculos sencillos. Incluye una revisión al mes y hasta una hora para pequeños ajustes de esta tarea. Si varias tareas usan el mismo proveedor, descuento la preparación y revisión que comparten.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-discontinued": {
    "initial": 100000,
    "monthly": 18000,
    "scopeEs": "Un proveedor, hasta 100 productos y una actualización al día con cálculos sencillos. Incluye una revisión al mes y hasta una hora para pequeños ajustes de esta tarea. Si varias tareas usan el mismo proveedor, descuento la preparación y revisión que comparten.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-offers": {
    "initial": 100000,
    "monthly": 18000,
    "scopeEs": "Un proveedor, hasta 100 productos y una actualización al día con cálculos sencillos. Incluye una revisión al mes y hasta una hora para pequeños ajustes de esta tarea. Si varias tareas usan el mismo proveedor, descuento la preparación y revisión que comparten.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "ml": {
    "initial": 30000,
    "monthly": 0,
    "scopeEs": "Una cuenta de Mercado Libre y conexión inicial de hasta 50 productos.",
    "scopeEn": "Base: one account and initial linking of up to 50 products."
  },
  "arca": {
    "initial": 20000,
    "monthly": 0,
    "scopeEs": "Preparación para un CUIT, con los datos y las autorizaciones necesarias.",
    "scopeEn": "Base: technical setup for one tax ID with the required details and authorization."
  },
  "shipping-rules": {
    "initial": 25000,
    "monthly": 0,
    "scopeEs": "Hasta 5 zonas, con un precio de entrega definido para cada una.",
    "scopeEn": "Base: up to 5 zones with one defined rate per zone."
  },
  "team-training": {
    "initial": 30000,
    "monthly": 0,
    "scopeEs": "2 horas de clase para un grupo de hasta 5 personas.",
    "scopeEn": "Base: 2 hours of training for up to 5 people."
  },
  "roles": {
    "initial": 15000,
    "monthly": 0,
    "scopeEs": "Hasta 5 empleados y 3 grupos con distintas tareas permitidas.",
    "scopeEn": "Base: up to 5 employees and 3 permission profiles."
  },
  "hiring": {
    "initial": 90000,
    "monthly": 0,
    "scopeEs": "Ayuda para un puesto: revisar hasta 10 postulaciones, coordinar hasta 2 entrevistas y una hora para preparar a la persona elegida. Avisos pagos y sueldo se pagan aparte.",
    "scopeEn": "Base: one role, review of up to 10 applications, coordination of up to 2 interviews and one onboarding hour. Paid job ads and staff fees or salaries are separate."
  },
  "maintenance": {
    "initial": 0,
    "monthly": 45000,
    "scopeEs": "Hasta 2 horas al mes para consultas y cambios en la tienda. El cuidado de las tareas automáticas tiene su propio precio.",
    "scopeEn": "Base: up to 2 hours per month for store questions and changes. Automation maintenance is listed with those services."
  },
  "technical-help": {
    "initial": 15000,
    "monthly": 0,
    "scopeEs": "Una hora de revisión y ayuda. Si se necesita más tiempo, te lo presupuesto antes de seguir.",
    "scopeEn": "Base: one hour of review and assistance. Additional work is scoped before continuing."
  }
};
const sharedAutomation = { initial: 80000, monthly: 15000 };
const pricedExtras = extras.map(item => ({ ...item, ...extraRates[item.id] }));

const expandedGroups = ref({});
const groupOptions = group => pricedExtras.filter(item => item.group === group);
const groupSelected = group => groupOptions(group).filter(item => selected.value.includes(item.id));
const groupAllSelected = group => groupSelected(group).length === groupOptions(group).length;
const groupPartiallySelected = group => groupSelected(group).length > 0 && !groupAllSelected(group);
function toggleGroup(group, checked) {
  for (const item of groupOptions(group)) toggleExtra(item, checked);
}
const groupCaption = group => {
  const count = groupOptions(group).length;
  return count + (es.value ? ' servicios' : ' services');
};const modeLabel = item => item.mode === 'both' ? (es.value ? 'Preparación inicial + cuidado mensual' : 'Setup + monthly maintenance') : item.mode === 'monthly' ? (es.value ? 'Servicio mensual' : 'Monthly service') : (es.value ? 'Se paga una sola vez' : 'One-time service');
function toggleExtra(item, checked) {
  selected.value = checked ? [...new Set([...selected.value, item.id])] : selected.value.filter(id => id !== item.id);
  // Migration replaces the basic product upload; a visual adjustment replaces a new-store design.
  if (checked && item.id === 'migration') selected.value = selected.value.filter(id => id !== 'catalog');
  if (checked && item.id === 'visual-changes') selected.value = selected.value.filter(id => id !== 'design');
}
function toggleBasic(item, checked) {
  selected.value = checked ? [...new Set([...selected.value, item.id])] : selected.value.filter(id => id !== item.id);
  if (checked && item.id === 'catalog') selected.value = selected.value.filter(id => id !== 'migration');
  if (checked && item.id === 'design') selected.value = selected.value.filter(id => id !== 'visual-changes');
}
const checkedBasics = computed(() => options.filter(item => selected.value.includes(item.id)));
const checkedExtras = computed(() => pricedExtras.filter(item => selected.value.includes(item.id)));
const allBasics = computed(() => checkedBasics.value.length === options.length);
const partialBasics = computed(() => checkedBasics.value.length > 0 && !allBasics.value);
const hasSelection = computed(() => selected.value.length > 0);
const basicAmount = computed(() => checkedBasics.value.reduce((sum, item) => sum + item.price, 0));
const automationCount = computed(() => checkedExtras.value.filter(item => item.group === 'automation').length);
const sharedInitialSaving = computed(() => Math.max(0, automationCount.value - 1) * sharedAutomation.initial);
const sharedMonthlySaving = computed(() => Math.max(0, automationCount.value - 1) * sharedAutomation.monthly);
const amount = computed(() => basicAmount.value + checkedExtras.value.reduce((sum, item) => sum + (item.initial || 0), 0) - sharedInitialSaving.value);
const monthlyAmount = computed(() => checkedExtras.value.reduce((sum, item) => sum + (item.monthly || 0), 0) - sharedMonthlySaving.value);
const pendingOnce = computed(() => checkedExtras.value.some(item => item.mode !== 'monthly' && !Number.isFinite(item.initial)));
const pendingMonthly = computed(() => checkedExtras.value.some(item => item.mode !== 'once' && !Number.isFinite(item.monthly)));
const estimatedOnce = computed(() => checkedExtras.value.some(item => item.initial > 0));
const estimatedMonthly = computed(() => monthlyAmount.value > 0);
const requiredModuleIds = computed(() => [
  ...(selected.value.includes('ml') ? ['mercadolibre'] : []),
  ...(selected.value.includes('arca') ? ['invoicing'] : []),
]);
const selectedModules = computed(() => storePlatformPricing.modules.filter(item => modules.value.includes(item.id) || requiredModuleIds.value.includes(item.id)));
const proRequired = computed(() => selectedModules.value.length > 0 || selected.value.includes('roles'));
function toggleModule(id, checked) {
  modules.value = checked ? [...new Set([...modules.value, id])] : modules.value.filter(value => value !== id);
}
const effectivePlatform = computed(() => proRequired.value ? 'pro' : platform.value);
const platformCost = computed(() => effectivePlatform.value === 'unsure' ? null : (effectivePlatform.value === 'pro' ? storePlatformPricing.plans.pro.monthly : 0) + selectedModules.value.reduce((sum, item) => sum + item.monthly, 0));
const money = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
const title = item => es.value ? item.es : item.en;
const description = item => es.value ? item.descEs : item.descEn;
const quote = computed(() => es.value ? 'A cotizar' : 'To be quoted');
const fromLabel = computed(() => es.value ? 'Desde ' : 'From ');
const onceLabel = computed(() => (estimatedOnce.value ? fromLabel.value : '') + money(amount.value) + (pendingOnce.value ? (es.value ? ' + a cotizar' : ' + quote pending') : ''));
const monthlyLabel = computed(() => (estimatedMonthly.value ? fromLabel.value : '') + money(monthlyAmount.value) + (pendingMonthly.value ? (es.value ? ' + a cotizar' : ' + quote pending') : ''));
const itemFees = item => {
  const parts = [];
  if (item.initial) parts.push(fromLabel.value + money(item.initial) + (es.value ? ' por única vez' : ' one-time'));
  if (item.monthly) parts.push(fromLabel.value + money(item.monthly) + (es.value ? '/mes' : '/month'));
  return parts.join(' · ') || quote.value;
};
const itemScope = item => es.value ? item.scopeEs : item.scopeEn;
const platformFeatureName = item => !es.value ? item.name : ({ blog: 'Publicar artículos y noticias', coupons: 'Cupones de descuento', recovery: 'Recordar compras que quedaron sin terminar', shopping: 'Mostrar productos en Google', mercadolibre: 'Conectar Mercado Libre', ai: 'Herramientas extra de inteligencia artificial', invoicing: 'Emitir facturas automáticamente' })[item.id] || item.name;
const groupEstimate = group => {
  const items = groupSelected(group).length ? groupSelected(group) : groupOptions(group);
  const commonCount = group === 'automation' ? Math.max(0, items.length - 1) : 0;
  return {
    initial: items.reduce((sum, item) => sum + (item.initial || 0), 0) - commonCount * sharedAutomation.initial,
    monthly: items.reduce((sum, item) => sum + (item.monthly || 0), 0) - commonCount * sharedAutomation.monthly,
  };
};
function toggleBasics(event) {
  const basicIds = options.map(item => item.id);
  selected.value = event.target.checked ? [...new Set([...selected.value.filter(id => !['migration', 'visual-changes'].includes(id)), ...basicIds])] : selected.value.filter(id => !basicIds.includes(id));
}
// Bulk selection keeps the launch defaults; migration and visual changes are alternatives.
const bulkServiceIds = [...options.map(item => item.id), ...pricedExtras.filter(item => !['migration', 'visual-changes'].includes(item.id)).map(item => item.id)];
const allServicesSelected = computed(() => bulkServiceIds.every(id => selected.value.includes(id)));
function selectAllServices() { selected.value = [...bulkServiceIds]; }
function clearServices() {
  selected.value = [];
  modules.value = [];
  platform.value = 'unsure';
}
const contextLines = computed(() => {
  const lines = [];
  const add = (labelEs, labelEn, value) => { if (String(value).trim()) lines.push((es.value ? labelEs : labelEn) + ': ' + String(value).trim()); };
  if (groupSelected('catalogue').length) {
    if (['migration', 'more-products', 'catalog-order'].some(id => selected.value.includes(id))) add('¿Cuántos productos tenés, más o menos?', 'Approximate product count', details.value.productCount);
    add('Cambios en catálogo o presentación', 'Catalog or presentation changes', details.value.catalogueNotes);
  }
  if (groupSelected('configuration').length) add('Configuración que necesito', 'Configuration needed', details.value.configurationNotes);
  if (selected.value.includes('maintenance')) add('Tareas o asistencia mensual', 'Monthly tasks or support', details.value.supportNotes);
  if (selected.value.includes('migration')) add('Tienda o catálogo de origen', 'Source store or catalog', details.value.source);
  if (groupSelected('automation').length) {
    add('Proveedores, listas o páginas a usar', 'Suppliers or information sources', details.value.suppliers);
    add('Cuándo actualizar y cómo calcular los precios', 'Desired schedule or rules', details.value.frequency);
  }
  if (selected.value.includes('team-training') || selected.value.includes('roles')) add('Personas a capacitar / organizar', 'People to train / organize', details.value.teamSize);
  if (selected.value.includes('hiring') && details.value.roles.length) add('Personas que necesito', 'Staff roles needed', staffRoles.filter(role => details.value.roles.includes(role.id)).map(title).join(', '));
  if (selected.value.includes('technical-help')) add('Problema a resolver', 'Issue to resolve', details.value.issue);
  return lines.length ? ['', es.value ? 'Detalles de mi pedido:' : 'Request details:', ...lines] : [];
});
const message = computed(() => {
  const lines = [
    es.value ? 'Hola Pedro, me interesan estos servicios para mi tienda:' : 'Hi Pedro, I am interested in these services for my store:',
    '',
    ...checkedBasics.value.map(item => '- ' + title(item) + ': ' + money(item.price) + (es.value ? ' por única vez' : ' one-time')),
    ...checkedExtras.value.map(item => '- ' + title(item) + ': ' + itemFees(item)),
    ...(sharedInitialSaving.value ? [(es.value ? 'Preparación compartida (una fuente): -' : 'Shared setup (one source): -') + money(sharedInitialSaving.value)] : []),
    ...(sharedMonthlySaving.value ? [(es.value ? 'Descuento en el cuidado mensual: -' : 'Shared monthly review: -') + money(sharedMonthlySaving.value) + (es.value ? '/mes' : '/month')] : []),
    ...contextLines.value,
    '',
    (es.value ? 'Mi trabajo, una sola vez: ' : 'One-time service fees: ') + onceLabel.value,
    (es.value ? 'Mi trabajo, cada mes: ' : 'Monthly service fees: ') + monthlyLabel.value,
    (es.value ? 'VendoAlgo mensual (se paga aparte): ' : 'VendoAlgo monthly (paid separately): ') + (platformCost.value === null ? (es.value ? 'plan por definir' : 'plan to be confirmed') : money(platformCost.value)),
    (es.value ? 'Plan: ' : 'Plan: ') + (effectivePlatform.value === 'unsure' ? (es.value ? 'necesito orientación' : 'I need advice') : effectivePlatform.value === 'pro' ? 'Pro' : (es.value ? 'Gratis (hasta 50 productos activos)' : 'Free (up to 50 active products)')),
    ...selectedModules.value.map(item => '- ' + item.name + ': ' + money(item.monthly) + (es.value ? '/mes' : '/month')),
    '',
    (es.value ? 'Nombre: ' : 'Name: ') + inquiry.value.name.trim(),
    ...(inquiry.value.business.trim() ? [(es.value ? 'Negocio / web: ' : 'Business / website: ') + inquiry.value.business.trim()] : []),
    ...(inquiry.value.message.trim() ? ['', inquiry.value.message.trim()] : []),
    '',
    es.value ? 'Precio estimado en pesos argentinos para el trabajo indicado. Antes de empezar, confirmamos qué incluye y cuánto cuesta. Los descuentos en tareas automáticas son para tareas que usan el mismo proveedor. VendoAlgo y otros servicios pagos van aparte.' : 'Indicative estimate in ARS for published base scopes. Final price depends on quantity, sources and complexity. Automation savings assume one shared source. Platform, module and other external service fees are separate.',
  ];
  return lines.join('\n');
});
function contact(event) {
  if (!hasSelection.value) return;
  const channel = event.submitter?.value;
  if (channel === 'whatsapp') {
    window.open('https://wa.me/5491158471048?text=' + encodeURIComponent(message.value), '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = 'mailto:pedromendezcaraban@gmail.com?subject=' + encodeURIComponent(es.value ? 'Consulta por servicios para mi tienda' : 'Store services inquiry') + '&body=' + encodeURIComponent(message.value);
  }
}
</script>

<template>
  <div class="service-estimator">
    <header class="buyer-section-heading">
      <p class="eyebrow">{{ es ? 'ELEGÍ LO QUE NECESITÁS' : 'CHOOSE WHAT YOU NEED' }}</p>
      <h2 id="service-scope-title">{{ es ? '¿En qué te puedo ayudar?' : 'How can I help?' }}</h2>
      <p>{{ es ? 'Marcá lo que te interesa. Abrí la flecha para ver cada servicio y su precio.' : 'Choose what to delegate and see your estimate.' }}</p>
    </header>
    <div class="estimate-toolbar" aria-label="Selección de servicios">
      <span class="estimate-toolbar-count" role="status" aria-live="polite">{{ selected.length }} {{ es ? 'servicios seleccionados' : 'services selected' }}</span>
      <div class="estimate-toolbar-actions">
        <button type="button" @click="selectAllServices" :disabled="allServicesSelected">{{ es ? 'Seleccionar todo' : 'Select all' }}</button>
        <button type="button" @click="clearServices" :disabled="!hasSelection && !modules.length && platform === 'unsure'">{{ es ? 'Quitar todo' : 'Clear all' }}</button>
      </div>
    </div>
    <div class="estimate-layout">
      <div class="estimate-choices">
        <div class="estimate-package" :class="{ 'is-selected': checkedBasics.length }">
          <div class="estimate-package-heading">
            <label class="estimate-package-select">
              <input type="checkbox" :checked="allBasics" :indeterminate.prop="partialBasics" @change="toggleBasics">
              <span><strong>{{ es ? 'Crear mi tienda' : 'Store launch setup' }}</strong><span class="estimate-caption">{{ es ? '5 servicios · se paga una sola vez' : '5 services · one-time payment' }}</span></span>
            </label>
            <strong class="estimate-package-price">{{ money(partialBasics ? basicAmount : 150000) }}</strong>
            <button type="button" class="estimate-expand" :aria-expanded="expanded" aria-controls="launch-service-options" :aria-label="es ? 'Ver o editar los servicios de puesta en marcha' : 'View or edit launch services'" @click="expanded = !expanded"><svg :class="{ 'is-open': expanded }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
          </div>
          <div v-show="expanded" id="launch-service-options" class="estimate-options">
            <label v-for="item in options" :key="item.id" class="estimate-option" :class="{ 'is-selected': selected.includes(item.id) }">
              <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleBasic(item, $event.target.checked)">
              <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><span>{{ description(item) }}</span></span>
              <strong class="estimate-option-price">{{ money(item.price) }}</strong>
            </label>
          </div>
        </div>

        <div v-for="group in serviceGroups" :key="group.id" class="estimate-package estimate-category" :class="{ 'is-selected': groupSelected(group.id).length }">
          <div class="estimate-package-heading">
            <label class="estimate-package-select">
              <input type="checkbox" :checked="groupAllSelected(group.id)" :indeterminate.prop="groupPartiallySelected(group.id)" @change="toggleGroup(group.id, $event.target.checked)">
              <span><strong>{{ title(group) }}</strong><span class="estimate-caption">{{ groupCaption(group.id) }}</span></span>
            </label>
            <span class="estimate-package-price estimate-category-price"><strong v-if="groupEstimate(group.id).initial">{{ fromLabel }}{{ money(groupEstimate(group.id).initial) }}</strong><span v-if="groupEstimate(group.id).monthly">{{ fromLabel }}{{ money(groupEstimate(group.id).monthly) }}/{{ es ? 'mes' : 'month' }}</span></span>
            <button type="button" class="estimate-expand" :aria-expanded="!!expandedGroups[group.id]" :aria-controls="'service-group-' + group.id" :aria-label="(es ? 'Ver o editar: ' : 'View or edit: ') + title(group)" @click="expandedGroups[group.id] = !expandedGroups[group.id]">
              <svg :class="{ 'is-open': expandedGroups[group.id] }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
          </div>
          <div v-show="expandedGroups[group.id]" :id="'service-group-' + group.id" class="estimate-options estimate-category-options">
          <div v-for="item in pricedExtras.filter(service => service.group === group.id)" :key="item.id" class="estimate-service-item">
            <label class="estimate-option" :class="{ 'is-selected': selected.includes(item.id) }">
              <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleExtra(item, $event.target.checked)">
              <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><em class="estimate-service-fee">{{ itemFees(item) }}</em></span>
            </label>
            <details class="estimate-item-details">
              <summary>{{ es ? 'Qué incluye' : 'What is included' }}</summary>
              <p>{{ description(item) }}</p><p>{{ itemScope(item) }}</p>
            </details>
          </div>
          <details v-if="groupSelected(group.id).length" class="estimate-context estimate-context-disclosure">
            <summary>{{ es ? 'Contarme un poco más (opcional)' : 'Add context (optional)' }}</summary>
            <template v-if="group.id === 'catalogue'">
              <label v-if="['migration', 'more-products', 'catalog-order'].some(id => selected.includes(id))" class="estimate-field">{{ es ? '¿Cuántos productos tenés, más o menos?' : 'Approximate product count' }}<input v-model="details.productCount" inputmode="numeric" maxlength="40" :placeholder="es ? 'Ej.: 150 productos' : 'E.g. 150 products'"></label>
              <label v-if="selected.includes('migration')" class="estimate-field">{{ es ? 'Web o catálogo de origen' : 'Source website or catalog' }}<input v-model="details.source" maxlength="300" :placeholder="es ? 'Link o nombre de la tienda anterior' : 'Previous store name or link'"></label>
              <label class="estimate-field">{{ es ? '¿Qué querés cambiar o preparar?' : 'What would you like to change or prepare?' }}<textarea v-model="details.catalogueNotes" rows="2" maxlength="400"></textarea></label>
            </template>
            <label v-if="group.id === 'configuration'" class="estimate-field">{{ es ? '¿Qué necesitás dejar funcionando?' : 'What needs configuring?' }}<textarea v-model="details.configurationNotes" rows="2" maxlength="400" :placeholder="es ? 'Ej.: conectar Mercado Libre o entregar en ciertas zonas' : 'Tell me if you already have the module or which delivery rules you need'"></textarea></label>
            <template v-if="group.id === 'automation'">
              <label class="estimate-field">{{ es ? '¿De dónde salen los precios y las cantidades?' : 'Suppliers or information sources' }}<input v-model="details.suppliers" maxlength="300" :placeholder="es ? 'Ej.: dos proveedores, sus webs o listas de precios' : 'E.g. two suppliers, their websites or price lists'"></label>
              <label class="estimate-field">{{ es ? '¿Cada cuánto querés actualizar? ¿Cómo calculás tus precios?' : 'How often, and using which rules?' }}<textarea v-model="details.frequency" rows="2" maxlength="500" :placeholder="es ? 'Ej.: cada mañana, con el margen de cada categoría' : 'E.g. every morning, using each category’s margin'"></textarea></label>
            </template>
            <template v-if="group.id === 'team'">
              <label v-if="selected.includes('team-training') || selected.includes('roles')" class="estimate-field">{{ es ? '¿Cuántas personas y qué tareas hacen?' : 'How many people, and what do they do?' }}<input v-model="details.teamSize" maxlength="200" :placeholder="es ? 'Ej.: tres personas que cargan productos y preparan pedidos' : 'E.g. three people handling products and orders'"></label>
              <fieldset v-if="selected.includes('hiring')" class="estimate-staff-roles"><legend>{{ es ? '¿Qué perfiles te interesan?' : 'Which roles do you need?' }}</legend><label v-for="role in staffRoles" :key="role.id"><input v-model="details.roles" type="checkbox" :value="role.id"><span>{{ title(role) }}</span></label></fieldset>
            </template>
            <label v-if="group.id === 'support' && selected.includes('maintenance')" class="estimate-field">{{ es ? '¿Qué tareas querés delegar cada mes?' : 'What tasks would you like to delegate each month?' }}<textarea v-model="details.supportNotes" rows="2" maxlength="400"></textarea></label>
            <label v-if="group.id === 'support' && selected.includes('technical-help')" class="estimate-field">{{ es ? '¿Qué está pasando?' : 'What is happening?' }}<textarea v-model="details.issue" rows="2" maxlength="500"></textarea></label>
          </details>
          </div>
        </div>

        <details class="estimate-details">
          <summary>{{ es ? 'Cuánto cuesta usar VendoAlgo' : 'VendoAlgo: plan and extra features' }}</summary>
          <p class="estimate-note">{{ es ? 'VendoAlgo es donde funciona tu tienda. Su precio se paga aparte de mi trabajo. Si no sabés qué opción elegir, dejalo sin definir y te ayudo.' : 'Paid to VendoAlgo separately from my services. If you are unsure what you need, I can help you choose.' }}</p>
          <label class="estimate-field">{{ es ? 'Opción de VendoAlgo' : 'Platform plan' }}
            <select :value="effectivePlatform" :disabled="proRequired" @change="platform = $event.target.value">
              <option value="unsure">{{ es ? 'No lo sé todavía' : 'Not sure yet' }}</option>
              <option value="free">{{ es ? 'Gratis · hasta 50 productos activos' : 'Free · up to 50 active products' }}</option>
              <option value="pro">Pro · {{ money(storePlatformPricing.plans.pro.monthly) }}/{{ es ? 'mes' : 'month' }}</option>
            </select>
          </label>
          <p v-if="proRequired" class="estimate-note">{{ es ? 'Lo que elegiste necesita el plan Pro. La conexión con Mercado Libre y las facturas tienen un precio mensual extra, que ya aparece en el resumen. Si ya los pagás, no se cobran dos veces.' : 'The selected features require Pro. Mercado Libre and invoicing also include their monthly module in the summary. If you already pay for them, this is not an additional subscription.' }}</p>
          <fieldset class="estimate-modules"><legend>{{ es ? 'Funciones extra · necesitan el plan Pro' : 'Optional modules · require Pro' }}</legend>
            <label v-for="item in storePlatformPricing.modules" :key="item.id" class="estimate-module"><input type="checkbox" :checked="selectedModules.some(module => module.id === item.id)" :disabled="requiredModuleIds.includes(item.id)" @change="toggleModule(item.id, $event.target.checked)"><span>{{ platformFeatureName(item) }}</span><strong>{{ money(item.monthly) }}/{{ es ? 'mes' : 'month' }}</strong></label>
          </fieldset>
          <p class="estimate-note"><a :href="storePlatformPricing.sourceUrl" target="_blank" rel="noopener noreferrer">{{ es ? 'Consultar precios y condiciones de VendoAlgo' : 'See VendoAlgo pricing and terms' }} ↗</a></p>
          <p class="estimate-note">{{ es ? 'Las comisiones por cobrar una venta, la dirección web propia y otros servicios que contrates se pagan aparte.' : 'Payment processing fees, domain registration and other external services, where applicable, are separate.' }}</p>
        </details>
        <p class="estimate-help">{{ es ? '¿No sabés qué elegir?' : 'Not sure what to choose?' }} <a :href="'https://wa.me/5491158471048?text=' + encodeURIComponent(es ? 'Hola Pedro, necesito ayuda para saber qué servicios me convienen para mi tienda.' : 'Hi Pedro, I would like help choosing services for my store.')" target="_blank" rel="noopener noreferrer">{{ es ? 'Escribime y te ayudo' : 'Message me for help' }} ↗</a></p>

      </div>

      <aside class="estimate-summary" aria-labelledby="estimate-summary-title">
        <p class="eyebrow">{{ es ? 'TU SELECCIÓN' : 'YOUR SELECTION' }}</p>
        <h3 id="estimate-summary-title">{{ es ? 'Tu precio estimado' : 'Estimated summary' }}</h3>
        <p v-if="!hasSelection" class="estimate-note">{{ es ? 'Elegí un servicio para ver el precio. Es solo una consulta.' : 'Choose at least one service to build your inquiry.' }}</p>
        <p v-if="hasSelection" class="estimate-selection-count">{{ selected.length }} {{ es ? 'servicios elegidos' : 'services in your proposal' }}</p>

        <div class="estimate-totals" role="status" aria-live="polite" aria-atomic="true">
          <div><span>{{ es ? 'Mi trabajo · una sola vez' : 'My services · one-time' }}</span><strong>{{ onceLabel }}</strong></div>
          <div><span>{{ es ? 'Mi trabajo · cada mes' : 'My services · per month' }}</span><strong>{{ monthlyLabel }}</strong></div>
          <div class="estimate-platform-total"><span>{{ es ? 'VendoAlgo · cada mes, aparte' : 'VendoAlgo · per month, separate' }}</span><strong>{{ platformCost === null ? (es ? 'Te ayudo a elegir' : 'Plan to confirm') : money(platformCost) }}</strong></div>
        </div>
        <details v-if="hasSelection" class="estimate-summary-detail">
          <summary><span>{{ es ? 'Ver lo que elegí' : 'View selection details' }}</span><span class="estimate-count">{{ selected.length }}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
          <div class="estimate-detail-scroll" role="region" tabindex="0" :aria-label="es ? 'Servicios seleccionados y sus importes' : 'Selected services and fees'">
        <ul class="estimate-selected-list">
          <li v-for="item in checkedBasics" :key="item.id"><span>{{ title(item) }}</span><strong>{{ money(item.price) }}</strong></li>
          <li v-for="item in checkedExtras" :key="item.id"><span>{{ title(item) }}<small class="estimate-summary-mode">{{ modeLabel(item) }}</small></span><strong class="estimate-summary-fee">{{ itemFees(item) }}</strong></li>
          <li v-if="sharedInitialSaving" class="estimate-saving"><span>{{ es ? 'Descuento por usar el mismo proveedor' : 'Shared setup · one source' }}</span><strong>−{{ money(sharedInitialSaving) }}</strong></li>
          <li v-if="sharedMonthlySaving" class="estimate-saving"><span>{{ es ? 'Descuento en el cuidado mensual' : 'Shared monthly review' }}</span><strong>−{{ money(sharedMonthlySaving) }}/{{ es ? 'mes' : 'month' }}</strong></li>
        </ul>
          </div>
        </details>

        <p class="estimate-summary-footnote">{{ es ? 'Precios en pesos argentinos. Emito factura. Antes de empezar, confirmo qué incluye y cuánto cuesta.' : 'Estimate in ARS · Invoice provided · Scope and price confirmed before starting.' }}</p>
        <details class="estimate-summary-detail estimate-conditions">
          <summary><span>{{ es ? 'Cómo se calcula el precio' : 'Estimate scope and terms' }}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p v-if="hasSelection && !monthlyAmount && !pendingMonthly" class="estimate-note">{{ es ? 'Por los servicios que elegiste, no tenés que pagarme todos los meses.' : 'The selected services do not require a monthly service retainer.' }}</p>
        <p v-if="pendingOnce || pendingMonthly" class="estimate-note">{{ es ? 'Hay conceptos pendientes de cotizar. Los importes numéricos solo suman los conceptos con precio definido.' : 'Some services need a quote: the final total is pending. Numeric amounts only include items with a defined price.' }}</p>
        <p v-if="automationCount" class="estimate-note">{{ es ? 'Las actualizaciones automáticas se calculan para un proveedor, hasta 100 productos y una actualización al día. Si necesitás más, te paso el precio antes de empezar. Otros servicios pagos que hagan falta se suman aparte.' : 'Automations: estimate for one shared source, up to 100 products and one daily update. Extra sources, higher volumes, special rules or external service usage may change the price.' }}</p>

          <p class="estimate-note">{{ es ? 'VendoAlgo y sus funciones extra se pagan aparte de mi trabajo. También se pagan aparte las comisiones por venta y otros servicios que contrates. Tu mensaje incluye todo lo elegido, aunque el detalle esté cerrado.' : 'VendoAlgo, its modules, payment fees and external services are separate. Your inquiry includes the full list even when it is collapsed here.' }}</p>
        </details>
        <form class="estimate-contact-form" @submit.prevent="contact">
          <label class="estimate-field">{{ es ? 'Tu nombre' : 'Your name' }}<input v-model="inquiry.name" autocomplete="name" required maxlength="100"></label>
          <label class="estimate-field">{{ es ? 'Tu negocio y lo que necesitás (opcional)' : 'Your business and what you need (optional)' }}<textarea v-model="inquiry.message" rows="2" maxlength="1200"></textarea></label>
          <button class="button button-primary" type="submit" value="whatsapp" :disabled="!hasSelection">{{ es ? 'Consultar por WhatsApp' : 'Ask via WhatsApp' }} ↗</button>
          <button class="button button-secondary" type="submit" value="email" :disabled="!hasSelection">{{ es ? 'Consultar por correo' : 'Ask via email' }} ↗</button>
          <p class="estimate-note">{{ es ? 'Revisá y enviá tu consulta desde WhatsApp o tu correo. No se envía automáticamente.' : 'Review and send your inquiry in WhatsApp or your email app. Nothing is sent automatically.' }}</p>
        </form>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.estimate-layout { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); align-items: start; gap: 24px; }
.estimate-choices, .estimate-summary { min-width: 0; }
.estimate-package { border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.estimate-package.is-selected { border-color: #879b3d; }
.estimate-package-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto 44px; align-items: center; gap: 10px; padding: 18px 16px 10px; background: var(--soft); }
.estimate-package-select { display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer; margin: 0; min-width: 0; }
.estimate-package-select strong { font-size: 1.08rem; }
.estimate-caption { display: block; font-size: .78rem; font-weight: 400; color: var(--muted); margin-top: 5px; line-height: 1.4; }
.estimate-package-price { font-size: 1.05rem; white-space: nowrap; }
.estimate-expand { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; border-radius: 50%; color: var(--muted); cursor: pointer; transition: background-color .15s, color .15s; }
.estimate-expand:hover { background: var(--surface); color: var(--ink); }
.estimate-expand svg { display: block; flex-shrink: 0; transition: transform .2s ease; }
.estimate-expand svg.is-open { transform: rotate(180deg); }
.estimate-package-hint { margin: 0; padding: 0 16px 18px; color: var(--muted); background: var(--soft); font-size: .82rem; line-height: 1.5; }
.estimate-options { padding: 0 16px; }
.estimate-option { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: start; gap: 10px; padding: 18px 0; margin: 0; border-top: 1px solid var(--line); cursor: pointer; }
.estimate-option-copy { display: grid; gap: 7px; min-width: 0; }
.estimate-option-copy strong { font-size: .93rem; line-height: 1.4; }
.estimate-option-copy > span { font-size: .82rem; line-height: 1.6; color: var(--muted); }
.estimate-option-copy em { font-size: .78rem; color: var(--muted); font-style: normal; }
.estimate-option-price { font-size: .9rem; white-space: nowrap; line-height: 1.5; }
.service-estimator input[type=checkbox] { appearance: auto; width: 20px; height: 20px; margin: 2px 0 0; padding: 0; flex-shrink: 0; accent-color: #426a32; cursor: pointer; }
.estimate-details { margin-top: 16px; padding: 0 16px; border: 1px solid var(--line); border-radius: 8px; }
.estimate-details summary { padding: 18px 0; font-weight: 600; font-size: .9rem; line-height: 1.5; cursor: pointer; }
.estimate-details .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
.estimate-count { display: inline-block; margin-left: 8px; padding: 1px 7px; border-radius: 12px; background: var(--soft); font-size: .75rem; }
.estimate-note { font-size: .79rem; line-height: 1.6; color: var(--muted); margin: 12px 0; }
.estimate-note a { text-decoration: underline; text-underline-offset: 3px; }
.estimate-summary { padding: 24px; border: 1px solid var(--line); border-radius: 10px; background: var(--soft); }
.estimate-summary h3 { margin: 0 0 18px; font-size: 1.4rem; letter-spacing: -.03em; }
.estimate-selected-list { list-style: none; padding: 0; margin: 0 0 20px; }
.estimate-selected-list li { display: flex; justify-content: space-between; align-items: start; gap: 12px; padding: 8px 0; font-size: .79rem; line-height: 1.5; }
.estimate-selected-list strong { flex-shrink: 0; font-weight: 500; }
.estimate-totals { border-block: 1px solid var(--line); padding: 10px 0; }
.estimate-totals > div { display: grid; gap: 5px; padding: 10px 0; }
.estimate-totals span { font-size: .8rem; color: var(--muted); }
.estimate-totals strong { font-size: 1.25rem; }
.estimate-totals .estimate-platform-total { border-top: 1px solid var(--line); margin-top: 8px; }
.estimate-platform-total strong { font-size: 1rem; }
.estimate-invoice { margin: 16px 0 0; font-size: .85rem; font-weight: 600; }
.estimate-field { display: grid; gap: 7px; font-size: .82rem; font-weight: 500; margin: 16px 0; }
.estimate-field input, .estimate-field textarea, .estimate-field select { width: 100%; min-width: 0; padding: 11px 12px; border: 1px solid var(--line); border-radius: 5px; background: var(--surface); color: var(--ink); }
.estimate-field textarea { resize: vertical; }
.estimate-summary form .button { width: 100%; margin-top: 10px; min-height: 46px; font-size: .84rem; white-space: normal; text-align: center; }
.service-estimator button:disabled { cursor: not-allowed; opacity: .5; }
.estimate-modules { margin: 20px 0 0; padding: 0; border: 0; min-width: 0; }
.estimate-modules legend { font-size: .82rem; margin-bottom: 12px; color: var(--muted); }
.estimate-module { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 8px; align-items: start; font-size: .78rem; padding: 10px 0; cursor: pointer; }
.estimate-module strong { white-space: nowrap; font-weight: 500; }
.service-estimator :is(input, select, textarea, button, a, summary):focus-visible { outline: 3px solid #749b2e; outline-offset: 4px; }
@media (max-width: 900px) { .estimate-layout { grid-template-columns: 1fr; } }
@media (max-width: 500px) {
  .estimate-package-heading { grid-template-columns: minmax(0, 1fr) 44px; gap: 6px 8px; padding: 16px 12px 10px; }
  .estimate-package-select { grid-column: 1; grid-row: 1; }
  .estimate-package-price { grid-column: 1; grid-row: 2; margin-left: 32px; font-size: 1rem; }
  .estimate-expand { grid-column: 2; grid-row: 1 / 3; }
  .estimate-package-hint { padding-inline: 12px; }
  .estimate-summary { padding: 20px 16px; }
  .estimate-options { padding-inline: 12px; }
  .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
  .estimate-option-price { grid-column: 2; }
  .estimate-module { grid-template-columns: 22px minmax(0, 1fr); }
  .estimate-module strong { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) { .estimate-expand, .estimate-expand svg { transition: none; } }

.estimate-extra-heading { margin: 28px 0 8px; }
.estimate-extra-heading h3 { font-size: 1.08rem; margin: 0; letter-spacing: -.02em; }
.estimate-extra-heading .estimate-note { margin-top: 8px; }
.estimate-service-group summary { display: flex; align-items: center; gap: 8px; list-style: none; min-height: 56px; }
.estimate-service-group summary::-webkit-details-marker { display: none; }
.estimate-group-chevron { flex-shrink: 0; margin-left: auto; color: var(--muted); transition: transform .2s ease; }
.estimate-service-group[open] .estimate-group-chevron { transform: rotate(180deg); }
.estimate-context { border-top: 1px solid var(--line); padding-block: 14px 4px; }
.estimate-context-title { font-size: .82rem; font-weight: 600; margin: 0; }
.estimate-staff-roles { padding: 0; margin: 16px 0; border: 0; }
.estimate-staff-roles legend { font-size: .82rem; font-weight: 500; margin-bottom: 10px; }
.estimate-staff-roles label { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: .82rem; cursor: pointer; }
.estimate-summary-mode { display: block; margin-top: 3px; font-size: .71rem; color: var(--muted); line-height: 1.5; }
@media (prefers-reduced-motion: reduce) { .estimate-group-chevron { transition: none; } }

.estimate-category { margin-top: 16px; }
.estimate-quote-price { font-size: .85rem; font-weight: 500; color: var(--muted); }
.estimate-category-options > .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
.estimate-category .estimate-package-select strong { font-size: 1rem; }
.estimate-category-price { display: grid; gap: 4px; text-align: right; font-size: .82rem; font-weight: 500; }
.estimate-category-price strong { font-size: .9rem; }
.estimate-category-price > span { font-size: .75rem; color: var(--muted); }
.estimate-option-copy .estimate-service-fee { color: var(--ink); font-weight: 600; font-size: .83rem; }
.estimate-option-copy .estimate-scope { padding-left: 10px; border-left: 2px solid var(--line); font-size: .76rem; }
.estimate-selected-list .estimate-summary-fee { flex-shrink: 1; flex-basis: 45%; text-align: right; font-size: .73rem; min-width: 0; }
.estimate-saving { color: var(--muted); }
@media (max-width: 500px) { .estimate-category-price { text-align: left; } }

.estimate-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 14px 16px; margin: 0; border: 1px solid var(--line); border-radius: 8px; background: var(--soft); }
.estimate-toolbar-count { font-size: .85rem; font-weight: 600; }
.estimate-toolbar-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.estimate-toolbar-actions button { min-height: 42px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); font-size: .8rem; font-weight: 600; cursor: pointer; }
.estimate-toolbar-actions button:first-child { border-color: #819444; }
.estimate-toolbar-hint { font-size: .75rem; color: var(--muted); margin: 8px 0 20px; line-height: 1.5; }
.estimate-selection-count { margin: -8px 0 14px; font-size: .8rem; color: var(--muted); }
.estimate-summary-detail { margin-top: 14px; border-bottom: 1px solid var(--line); }
.estimate-summary-detail summary { display: flex; align-items: center; gap: 8px; cursor: pointer; list-style: none; padding: 10px 0; font-size: .8rem; font-weight: 600; }
.estimate-summary-detail summary::-webkit-details-marker { display: none; }
.estimate-summary-detail summary svg { margin-left: auto; flex-shrink: 0; transition: transform .2s; }
.estimate-summary-detail[open] summary svg { transform: rotate(180deg); }
.estimate-detail-scroll { max-height: 300px; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding-right: 8px; }
.estimate-detail-scroll .estimate-selected-list { margin-bottom: 8px; }
.estimate-summary-footnote { margin: 14px 0 8px; font-size: .76rem; line-height: 1.6; color: var(--muted); }
.estimate-conditions { margin-top: 0; }
.estimate-conditions summary { font-weight: 500; color: var(--muted); }
.estimate-contact-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.estimate-contact-form .estimate-field { margin: 12px 0; }
.estimate-contact-form .estimate-contact-row .estimate-field { margin-bottom: 0; }
.estimate-contact-form > .estimate-note { margin-bottom: 0; font-size: .74rem; }
@media (max-width: 380px) {
  .estimate-contact-row { grid-template-columns: 1fr; gap: 0; }
  .estimate-toolbar { padding: 12px; }
  .estimate-toolbar-actions { width: 100%; }
  .estimate-toolbar-actions button { flex: 1; }
}
@media (prefers-reduced-motion: reduce) { .estimate-summary-detail summary svg { transition: none; } }

.estimate-summary .estimate-summary-detail { padding: 0; }
.estimate-summary > .eyebrow { margin-bottom: 6px; }
.estimate-summary h3 { margin-bottom: 12px; }
.estimate-summary .estimate-totals > div { grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; padding-block: 9px; }
.estimate-summary .estimate-totals strong { font-size: 1.08rem; text-align: right; }
.estimate-summary .estimate-platform-total strong { font-size: .9rem; }
.estimate-contact-form { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 8px; }
.estimate-contact-form > :not(button) { grid-column: 1 / -1; }
.estimate-summary .estimate-contact-form .button { padding: 10px 8px; font-size: .78rem; }
@media (max-width: 380px) {
  .estimate-contact-form > button { grid-column: 1 / -1; }
  .estimate-summary .estimate-totals > div { grid-template-columns: 1fr; gap: 5px; }
  .estimate-summary .estimate-totals strong { text-align: left; }
}

/* A short first view; service scope remains available on demand. */
.estimate-toolbar { padding: 0; margin: 0 0 20px; border: 0; background: none; }
.estimate-toolbar-actions button { min-height: 36px; padding: 6px 10px; font-size: .76rem; }
.estimate-toolbar-count { font-size: .8rem; color: var(--muted); font-weight: 500; }
.estimate-package-heading { padding: 14px 16px; }
.estimate-caption { margin-top: 4px; font-size: .74rem; }
.estimate-category .estimate-package-select strong { font-size: .95rem; }
.estimate-category-price strong { font-size: .84rem; }
.estimate-service-item + .estimate-service-item { border-top: 1px solid var(--line); }
.estimate-service-item .estimate-option { border-top: 0; padding-bottom: 5px; }
.estimate-category-options .estimate-item-details { padding: 0 0 14px 32px; border: 0; }
.estimate-item-details summary { padding: 4px 0; font-size: .76rem; font-weight: 500; color: var(--muted); cursor: pointer; }
.estimate-item-details p { font-size: .8rem; color: var(--muted); line-height: 1.6; margin: 8px 0; }
.estimate-category-options .estimate-context-disclosure { padding: 12px 0; border-bottom: 0; }
.estimate-context-disclosure > summary { padding: 4px 0; font-size: .8rem; color: var(--muted); cursor: pointer; }
@media(max-width: 500px) { .estimate-package-heading { padding: 12px; } }

.estimate-help { font-size: .88rem; line-height: 1.65; color: var(--muted); margin: 20px 0 0; }
.estimate-help a { color: var(--ink); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
.estimate-item-details p { font-size: .88rem; line-height: 1.7; }
.estimate-category .estimate-package-select strong { font-size: 1rem; line-height: 1.4; }
.estimate-option-copy strong { font-size: .96rem; }
.estimate-option-copy > span { font-size: .86rem; line-height: 1.65; }
</style>
