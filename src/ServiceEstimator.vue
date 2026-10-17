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
  { id: 'design', price: 60000, es: 'Diseño y configuración visual', en: 'Store design and visual setup', descEs: 'Colores, portada, navegación y páginas básicas con tu logo y contenido. Configuración sobre VendoAlgo; un diseño a medida se cotiza aparte.', descEn: 'Colors, homepage, navigation and basic pages using your logo and content. Setup on VendoAlgo; custom development is quoted separately.' },
  { id: 'catalog', price: 40000, es: 'Carga inicial de hasta 40 productos', en: 'Initial upload of up to 40 products', descEs: 'Con fotos, precios y datos completos y ordenados que me entregues. Catálogos más grandes, variantes complejas o migraciones requieren revisión.', descEn: 'Using complete, organized photos, prices and data you provide. Larger catalogs, complex variants and migrations require review.' },
  { id: 'payments', price: 15000, es: 'Configuración de cobros', en: 'Payment setup', descEs: 'Medios de cobro habituales disponibles en la plataforma, con tus cuentas y datos. Las comisiones del medio de pago se abonan aparte.', descEn: 'Standard payment methods available on the platform, using your accounts and details. Payment processing fees are separate.' },
  { id: 'shipping', price: 20000, es: 'Configuración de envíos y retiro', en: 'Shipping and pickup setup', descEs: 'Configuración básica de entrega y retiro según las opciones disponibles y tus tarifas. Reglas especiales se revisan antes de confirmar.', descEn: 'Basic delivery and pickup setup using available options and your rates. Special rules are reviewed before confirmation.' },
  { id: 'training', price: 15000, es: 'Capacitación inicial · 1 hora', en: 'Initial training · 1 hour', descEs: 'Una sesión para aprender las tareas habituales de tu tienda. Capacitación adicional y preparación de equipos se cotizan aparte.', descEn: 'One session covering everyday store tasks. Additional training and team onboarding are quoted separately.' },
];
const serviceGroups = [
  {
    "id": "catalogue",
    "es": "Catálogo y presentación",
    "en": "Catalog and presentation",
    "introEs": "Para ampliar o reorganizar una tienda que ya existe.",
    "introEn": "Expand or reorganize an existing store."
  },
  {
    "id": "automation",
    "es": "Tareas automáticas",
    "en": "Automated tasks",
    "introEs": "Elegí qué querés mantener al día. Si varias tareas comparten proveedor o información, las evalúo juntas para evitar trabajo duplicado.",
    "introEn": "Choose what to keep up to date. Tasks sharing a supplier or information are assessed together to avoid duplicate work."
  },
  {
    "id": "configuration",
    "es": "Configuraciones adicionales",
    "en": "Additional configuration",
    "introEs": "Funciones que podés sumar según cómo trabaja tu negocio.",
    "introEn": "Features to add based on how your business operates."
  },
  {
    "id": "team",
    "es": "Equipo y capacitación",
    "en": "Team and training",
    "introEs": "Ayuda para organizar a las personas que trabajan con tu tienda.",
    "introEn": "Help organizing the people who work with your store."
  },
  {
    "id": "support",
    "es": "Mantenimiento y asistencia",
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
    "es": "Migrar productos de otra tienda",
    "en": "Migrate products from another store",
    "descEs": "Reviso el catálogo de origen e importo los productos y datos acordados. Es una alternativa a la carga inicial: no cobro dos veces por los mismos productos.",
    "descEn": "I review the source catalog and import the agreed products and data. An alternative to initial upload: the same products are not charged twice."
  },
  {
    "id": "more-products",
    "group": "catalogue",
    "mode": "once",
    "es": "Cargar productos adicionales",
    "en": "Upload additional products",
    "descEs": "Para ampliar el catálogo existente o superar los 40 productos de la carga inicial. Indico en la propuesta la cantidad adicional y el trabajo incluido.",
    "descEn": "Expand an existing catalog or go beyond the initial 40 products. The quote specifies the additional quantity and included work."
  },
  {
    "id": "catalog-order",
    "group": "catalogue",
    "mode": "once",
    "es": "Organizar categorías, variantes y fichas",
    "en": "Organize categories, variants and listings",
    "descEs": "Reordeno el catálogo existente y ajusto la información que me entregues para que sea más fácil encontrar y elegir productos.",
    "descEn": "Reorganize your existing catalog and adjust the information you supply to make products easier to find and choose."
  },
  {
    "id": "visual-changes",
    "group": "catalogue",
    "mode": "once",
    "es": "Ajustar el diseño de una tienda existente",
    "en": "Adjust the design of an existing store",
    "descEs": "Cambios en estilos, portada, secciones y contenido con el material que me entregues. Para una tienda nueva, elegí el diseño de puesta en marcha.",
    "descEn": "Adjust styles, homepage, sections and content using your materials. For a new store, choose the launch design service."
  },
  {
    "id": "auto-prices",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar precios automáticamente",
    "en": "Update prices automatically",
    "descEs": "Según los costos de tus proveedores y las reglas que acordemos. Puede incluir cálculos por insumos o márgenes según tu negocio.",
    "descEn": "Based on supplier costs and agreed rules, including input cost or margin calculations where needed."
  },
  {
    "id": "auto-stock",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar stock automáticamente",
    "en": "Update stock automatically",
    "descEs": "Mantengo las existencias al día con las fuentes de información y la frecuencia que acordemos.",
    "descEn": "Keep stock up to date using agreed information sources and schedule."
  },
  {
    "id": "auto-new",
    "group": "automation",
    "mode": "both",
    "es": "Incorporar novedades de proveedores",
    "en": "Add new supplier products",
    "descEs": "Preparo la incorporación de productos nuevos según las categorías, datos y criterios que definas.",
    "descEn": "Set up new product additions using your categories, information and criteria."
  },
  {
    "id": "auto-discontinued",
    "group": "automation",
    "mode": "both",
    "es": "Gestionar productos que dejan de ofrecerse",
    "en": "Handle discontinued products",
    "descEs": "Definimos qué hacer cuando un proveedor deja de ofrecer un producto: actualizar su disponibilidad o desactivarlo según tus reglas.",
    "descEn": "Agree how to handle products a supplier stops offering: update availability or deactivate them according to your rules."
  },
  {
    "id": "auto-offers",
    "group": "automation",
    "mode": "both",
    "es": "Actualizar ofertas automáticamente",
    "en": "Update offers automatically",
    "descEs": "Preparo los cambios de precios promocionales según la información, las condiciones y los horarios que acordemos.",
    "descEn": "Set up promotional price changes based on agreed information, conditions and schedule."
  },
  {
    "id": "ml",
    "group": "configuration",
    "mode": "once",
    "es": "Configurar Mercado Libre",
    "en": "Set up Mercado Libre",
    "descEs": "Te ayudo a conectar y configurar el módulo que contrates en VendoAlgo. La suscripción del módulo se muestra aparte.",
    "descEn": "Help connect and configure the VendoAlgo module you subscribe to. The module subscription is shown separately."
  },
  {
    "id": "arca",
    "group": "configuration",
    "mode": "once",
    "es": "Configurar facturación automática ARCA",
    "en": "Set up automatic ARCA invoicing",
    "descEs": "Preparo la configuración del módulo con los datos y accesos que correspondan. Su suscripción mensual se muestra aparte.",
    "descEn": "Configure the module using the required details and access. Its monthly subscription is shown separately."
  },
  {
    "id": "shipping-rules",
    "group": "configuration",
    "mode": "once",
    "es": "Preparar reglas especiales de entrega",
    "en": "Set up special delivery rules",
    "descEs": "Reviso zonas, tarifas y condiciones adicionales que no entren en la configuración básica de envíos.",
    "descEn": "Review extra delivery zones, rates and conditions outside basic shipping setup."
  },
  {
    "id": "team-training",
    "group": "team",
    "mode": "once",
    "es": "Capacitar al equipo según cada puesto",
    "en": "Train staff for their roles",
    "descEs": "Enseño las tareas que necesita cada persona: catálogo, pedidos, ventas u operación. Definimos participantes y sesiones.",
    "descEn": "Teach the tasks each person needs: catalog, orders, sales or operations. Participants and sessions are agreed."
  },
  {
    "id": "roles",
    "group": "team",
    "mode": "once",
    "es": "Asignar roles y permisos",
    "en": "Set staff roles and permissions",
    "descEs": "Configuro qué puede ver y hacer cada empleado en la tienda. Esta función requiere el plan Pro de VendoAlgo.",
    "descEn": "Configure what each employee can see and do in the store. Requires the VendoAlgo Pro plan."
  },
  {
    "id": "hiring",
    "group": "team",
    "mode": "once",
    "es": "Ayudarte a conseguir e incorporar personal",
    "en": "Help find and onboard staff",
    "descEs": "Diseñador, operario, vendedor o community manager. Acordamos la búsqueda y su incorporación; los honorarios o sueldos de esa persona son aparte.",
    "descEn": "Designer, operator, salesperson or community manager. Agree on the search and onboarding; that person's fees or salary are separate."
  },
  {
    "id": "maintenance",
    "group": "support",
    "mode": "monthly",
    "es": "Mantenimiento y asistencia mensual",
    "en": "Monthly maintenance and support",
    "descEs": "Cambios y atención de problemas dentro del alcance que acordemos. Doy seguimiento a las incidencias que necesiten intervención del equipo de VendoAlgo.",
    "descEn": "Changes and issue handling within the agreed scope. I follow up on incidents requiring the VendoAlgo team's involvement."
  },
  {
    "id": "technical-help",
    "group": "support",
    "mode": "once",
    "es": "Resolver un problema puntual",
    "en": "Resolve a specific issue",
    "descEs": "Reviso qué está pasando y te propongo cómo abordarlo. Si depende de la plataforma, elevo el reclamo y le doy seguimiento.",
    "descEn": "Review the issue and propose an approach. If it depends on the platform, I escalate it and follow up."
  }
];
const details = ref({ productCount: '', source: '', suppliers: '', frequency: '', teamSize: '', roles: [], issue: '', catalogueNotes: '', configurationNotes: '', supportNotes: '' });
const staffRoles = [
  { id: 'designer', es: 'Diseñador', en: 'Designer' },
  { id: 'operator', es: 'Operario', en: 'Operator' },
  { id: 'sales', es: 'Vendedor', en: 'Salesperson' },
  { id: 'cm', es: 'Community manager', en: 'Community manager' },
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
    "scopeEs": "Base: hasta 100 productos desde un archivo exportado y ordenado de una tienda.",
    "scopeEn": "Base: up to 100 products from an organized store export."
  },
  "more-products": {
    "initial": 15000,
    "monthly": 0,
    "scopeEs": "Base: una tanda de hasta 10 productos adicionales con material completo.",
    "scopeEn": "Base: one batch of up to 10 extra products with complete materials."
  },
  "catalog-order": {
    "initial": 20000,
    "monthly": 0,
    "scopeEs": "Base: revisión de hasta 50 productos y 10 categorías.",
    "scopeEn": "Base: review of up to 50 products and 10 categories."
  },
  "visual-changes": {
    "initial": 35000,
    "monthly": 0,
    "scopeEs": "Base: ajustes en hasta 2 secciones con tu material.",
    "scopeEn": "Base: adjustments to up to 2 sections using your materials."
  },
  "auto-prices": {
    "initial": 120000,
    "monthly": 25000,
    "scopeEs": "Base: un proveedor o fuente, hasta 100 productos, una actualización diaria y reglas simples. El abono cubre revisión mensual y hasta una hora de ajustes menores de esta tarea. Si combinás tareas sobre la misma fuente, la preparación y revisión comunes se cuentan una sola vez.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-stock": {
    "initial": 110000,
    "monthly": 20000,
    "scopeEs": "Base: un proveedor o fuente, hasta 100 productos, una actualización diaria y reglas simples. El abono cubre revisión mensual y hasta una hora de ajustes menores de esta tarea. Si combinás tareas sobre la misma fuente, la preparación y revisión comunes se cuentan una sola vez.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-new": {
    "initial": 130000,
    "monthly": 25000,
    "scopeEs": "Base: un proveedor o fuente, hasta 100 productos, una actualización diaria y reglas simples. El abono cubre revisión mensual y hasta una hora de ajustes menores de esta tarea. Si combinás tareas sobre la misma fuente, la preparación y revisión comunes se cuentan una sola vez.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-discontinued": {
    "initial": 100000,
    "monthly": 18000,
    "scopeEs": "Base: un proveedor o fuente, hasta 100 productos, una actualización diaria y reglas simples. El abono cubre revisión mensual y hasta una hora de ajustes menores de esta tarea. Si combinás tareas sobre la misma fuente, la preparación y revisión comunes se cuentan una sola vez.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "auto-offers": {
    "initial": 100000,
    "monthly": 18000,
    "scopeEs": "Base: un proveedor o fuente, hasta 100 productos, una actualización diaria y reglas simples. El abono cubre revisión mensual y hasta una hora de ajustes menores de esta tarea. Si combinás tareas sobre la misma fuente, la preparación y revisión comunes se cuentan una sola vez.",
    "scopeEn": "Base: one supplier or source, up to 100 products, one daily update and simple rules. The monthly fee covers a monthly review and up to one hour of minor task adjustments. Shared setup and review for tasks using the same source are counted once."
  },
  "ml": {
    "initial": 30000,
    "monthly": 0,
    "scopeEs": "Base: una cuenta y vinculación inicial de hasta 50 productos.",
    "scopeEn": "Base: one account and initial linking of up to 50 products."
  },
  "arca": {
    "initial": 20000,
    "monthly": 0,
    "scopeEs": "Base: configuración técnica para un CUIT con datos y autorizaciones disponibles.",
    "scopeEn": "Base: technical setup for one tax ID with the required details and authorization."
  },
  "shipping-rules": {
    "initial": 25000,
    "monthly": 0,
    "scopeEs": "Base: hasta 5 zonas con una tarifa definida por zona.",
    "scopeEn": "Base: up to 5 zones with one defined rate per zone."
  },
  "team-training": {
    "initial": 30000,
    "monthly": 0,
    "scopeEs": "Base: 2 horas de capacitación para hasta 5 personas.",
    "scopeEn": "Base: 2 hours of training for up to 5 people."
  },
  "roles": {
    "initial": 15000,
    "monthly": 0,
    "scopeEs": "Base: hasta 5 empleados y 3 perfiles de permisos.",
    "scopeEn": "Base: up to 5 employees and 3 permission profiles."
  },
  "hiring": {
    "initial": 90000,
    "monthly": 0,
    "scopeEs": "Base: un perfil, revisión de hasta 10 postulaciones, coordinación de hasta 2 entrevistas y una hora de incorporación. Publicaciones pagas, sueldos y honorarios del personal aparte.",
    "scopeEn": "Base: one role, review of up to 10 applications, coordination of up to 2 interviews and one onboarding hour. Paid job ads and staff fees or salaries are separate."
  },
  "maintenance": {
    "initial": 0,
    "monthly": 45000,
    "scopeEs": "Base: hasta 2 horas al mes para consultas y cambios en la tienda. El mantenimiento de automatizaciones se detalla en sus propios servicios.",
    "scopeEn": "Base: up to 2 hours per month for store questions and changes. Automation maintenance is listed with those services."
  },
  "technical-help": {
    "initial": 15000,
    "monthly": 0,
    "scopeEs": "Base: una hora de revisión y asistencia. Si hace falta más trabajo, te paso el alcance antes de continuar.",
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
  const modes = groupOptions(group).map(item => item.mode);
  const mode = modes.every(value => value === 'once') ? (es.value ? 'pago por única vez' : 'one-time payment') : modes.every(value => value === 'monthly') ? (es.value ? 'servicio mensual' : 'monthly service') : (es.value ? 'pago único y mensual según servicio' : 'one-time and monthly by service');
  return count + (es.value ? ' servicios · ' : ' services · ') + mode;
};
const modeLabel = item => item.mode === 'both' ? (es.value ? 'Implementación + mantenimiento mensual' : 'Setup + monthly maintenance') : item.mode === 'monthly' ? (es.value ? 'Servicio mensual' : 'Monthly service') : (es.value ? 'Trabajo por única vez' : 'One-time service');
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
    if (['migration', 'more-products', 'catalog-order'].some(id => selected.value.includes(id))) add('Cantidad aproximada de productos', 'Approximate product count', details.value.productCount);
    add('Cambios en catálogo o presentación', 'Catalog or presentation changes', details.value.catalogueNotes);
  }
  if (groupSelected('configuration').length) add('Configuración que necesito', 'Configuration needed', details.value.configurationNotes);
  if (selected.value.includes('maintenance')) add('Tareas o asistencia mensual', 'Monthly tasks or support', details.value.supportNotes);
  if (selected.value.includes('migration')) add('Tienda o catálogo de origen', 'Source store or catalog', details.value.source);
  if (groupSelected('automation').length) {
    add('Proveedores o fuentes a usar', 'Suppliers or information sources', details.value.suppliers);
    add('Frecuencia o reglas deseadas', 'Desired schedule or rules', details.value.frequency);
  }
  if (selected.value.includes('team-training') || selected.value.includes('roles')) add('Personas a capacitar / organizar', 'People to train / organize', details.value.teamSize);
  if (selected.value.includes('hiring') && details.value.roles.length) add('Perfiles que necesito', 'Staff roles needed', staffRoles.filter(role => details.value.roles.includes(role.id)).map(title).join(', '));
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
    ...(sharedMonthlySaving.value ? [(es.value ? 'Revisión mensual compartida: -' : 'Shared monthly review: -') + money(sharedMonthlySaving.value) + (es.value ? '/mes' : '/month')] : []),
    ...contextLines.value,
    '',
    (es.value ? 'Honorarios por única vez: ' : 'One-time service fees: ') + onceLabel.value,
    (es.value ? 'Honorarios mensuales: ' : 'Monthly service fees: ') + monthlyLabel.value,
    (es.value ? 'VendoAlgo mensual (se paga aparte): ' : 'VendoAlgo monthly (paid separately): ') + (platformCost.value === null ? (es.value ? 'plan por definir' : 'plan to be confirmed') : money(platformCost.value)),
    (es.value ? 'Plan: ' : 'Plan: ') + (effectivePlatform.value === 'unsure' ? (es.value ? 'necesito orientación' : 'I need advice') : effectivePlatform.value === 'pro' ? 'Pro' : (es.value ? 'Gratis (hasta 50 productos activos)' : 'Free (up to 50 active products)')),
    ...selectedModules.value.map(item => '- ' + item.name + ': ' + money(item.monthly) + (es.value ? '/mes' : '/month')),
    '',
    (es.value ? 'Nombre: ' : 'Name: ') + inquiry.value.name.trim(),
    ...(inquiry.value.business.trim() ? [(es.value ? 'Negocio / web: ' : 'Business / website: ') + inquiry.value.business.trim()] : []),
    ...(inquiry.value.message.trim() ? ['', inquiry.value.message.trim()] : []),
    '',
    es.value ? 'Estimación orientativa en ARS para los alcances base publicados. Importe final a confirmar según cantidad, fuentes y complejidad. Los ahorros de automatización suponen una única fuente compartida. VendoAlgo, módulos y otros servicios externos se abonan aparte.' : 'Indicative estimate in ARS for published base scopes. Final price depends on quantity, sources and complexity. Automation savings assume one shared source. Platform, module and other external service fees are separate.',
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
      <h2 id="service-scope-title">{{ es ? 'Armá tu propuesta' : 'Build your proposal' }}</h2>
      <p>{{ es ? 'Seleccioná servicios por separado o marcá la puesta en marcha completa. Podés ajustar cada detalle antes de consultarme.' : 'Choose individual services or select the complete launch setup. Adjust the details before getting in touch.' }}</p>
    </header>
    <div class="estimate-toolbar" aria-label="Selección de servicios">
      <span class="estimate-toolbar-count" role="status" aria-live="polite">{{ selected.length }} {{ es ? 'servicios seleccionados' : 'services selected' }}</span>
      <div class="estimate-toolbar-actions">
        <button type="button" @click="selectAllServices" :disabled="allServicesSelected">{{ es ? 'Seleccionar todo' : 'Select all' }}</button>
        <button type="button" @click="clearServices" :disabled="!hasSelection && !modules.length && platform === 'unsure'">{{ es ? 'Quitar todo' : 'Clear all' }}</button>
      </div>
    </div>
    <p class="estimate-toolbar-hint">{{ es ? 'Las alternativas que se reemplazan entre sí se eligen por separado.' : 'Mutually exclusive alternatives can be chosen individually.' }}</p>
    <div class="estimate-layout">
      <div class="estimate-choices">
        <div class="estimate-package" :class="{ 'is-selected': checkedBasics.length }">
          <div class="estimate-package-heading">
            <label class="estimate-package-select">
              <input type="checkbox" :checked="allBasics" :indeterminate.prop="partialBasics" @change="toggleBasics">
              <span><strong>{{ es ? 'Puesta en marcha' : 'Store launch setup' }}</strong><span class="estimate-caption">{{ es ? '5 servicios · pago por única vez' : '5 services · one-time payment' }}</span></span>
            </label>
            <strong class="estimate-package-price">{{ money(partialBasics ? basicAmount : 150000) }}</strong>
            <button type="button" class="estimate-expand" :aria-expanded="expanded" aria-controls="launch-service-options" :aria-label="es ? 'Ver o editar los servicios de puesta en marcha' : 'View or edit launch services'" @click="expanded = !expanded"><svg :class="{ 'is-open': expanded }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
          </div>
          <p class="estimate-package-hint">{{ partialBasics ? (es ? 'Selección personalizada · ' : 'Custom selection · ') + money(basicAmount) : (es ? 'Todo lo necesario para empezar. Desplegá el detalle para personalizarlo.' : 'Everything you need to get started. Expand the details to customize it.') }}</p>
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
          <p class="estimate-package-hint">{{ groupSelected(group.id).length ? (groupPartiallySelected(group.id) ? (es ? 'Selección personalizada · ' : 'Custom selection · ') : '') + groupSelected(group.id).length + (es ? ' servicios seleccionados · estimado orientativo' : ' services selected · indicative estimate') : (es ? group.introEs : group.introEn) }}</p>
          <div v-show="expandedGroups[group.id]" :id="'service-group-' + group.id" class="estimate-options estimate-category-options">
          <label v-for="item in pricedExtras.filter(service => service.group === group.id)" :key="item.id" class="estimate-option" :class="{ 'is-selected': selected.includes(item.id) }">
            <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleExtra(item, $event.target.checked)">
            <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><span>{{ description(item) }}</span><span class="estimate-scope">{{ itemScope(item) }}</span><em class="estimate-service-fee">{{ itemFees(item) }}</em></span>
          </label>
          <div v-if="groupSelected(group.id).length" class="estimate-context">
            <p class="estimate-context-title">{{ es ? 'Si querés, sumá un poco de contexto' : 'Add some context if you like' }}</p>
            <template v-if="group.id === 'catalogue'">
              <label v-if="['migration', 'more-products', 'catalog-order'].some(id => selected.includes(id))" class="estimate-field">{{ es ? 'Cantidad aproximada de productos' : 'Approximate product count' }}<input v-model="details.productCount" inputmode="numeric" maxlength="40" :placeholder="es ? 'Ej.: 150 productos' : 'E.g. 150 products'"></label>
              <label v-if="selected.includes('migration')" class="estimate-field">{{ es ? 'Web o catálogo de origen' : 'Source website or catalog' }}<input v-model="details.source" maxlength="300" :placeholder="es ? 'Link o nombre de la tienda anterior' : 'Previous store name or link'"></label>
              <label class="estimate-field">{{ es ? '¿Qué querés cambiar o preparar?' : 'What would you like to change or prepare?' }}<textarea v-model="details.catalogueNotes" rows="2" maxlength="400"></textarea></label>
            </template>
            <label v-if="group.id === 'configuration'" class="estimate-field">{{ es ? '¿Qué necesitás configurar?' : 'What needs configuring?' }}<textarea v-model="details.configurationNotes" rows="2" maxlength="400" :placeholder="es ? 'Contame si ya tenés el módulo o qué reglas de entrega necesitás' : 'Tell me if you already have the module or which delivery rules you need'"></textarea></label>
            <template v-if="group.id === 'automation'">
              <label class="estimate-field">{{ es ? 'Proveedores o fuentes de información' : 'Suppliers or information sources' }}<input v-model="details.suppliers" maxlength="300" :placeholder="es ? 'Ej.: dos proveedores, sus webs o listas de precios' : 'E.g. two suppliers, their websites or price lists'"></label>
              <label class="estimate-field">{{ es ? '¿Cada cuánto y con qué reglas?' : 'How often, and using which rules?' }}<textarea v-model="details.frequency" rows="2" maxlength="500" :placeholder="es ? 'Ej.: cada mañana, con el margen de cada categoría' : 'E.g. every morning, using each category’s margin'"></textarea></label>
            </template>
            <template v-if="group.id === 'team'">
              <label v-if="selected.includes('team-training') || selected.includes('roles')" class="estimate-field">{{ es ? '¿Cuántas personas y qué tareas hacen?' : 'How many people, and what do they do?' }}<input v-model="details.teamSize" maxlength="200" :placeholder="es ? 'Ej.: tres personas que cargan productos y preparan pedidos' : 'E.g. three people handling products and orders'"></label>
              <fieldset v-if="selected.includes('hiring')" class="estimate-staff-roles"><legend>{{ es ? '¿Qué perfiles te interesan?' : 'Which roles do you need?' }}</legend><label v-for="role in staffRoles" :key="role.id"><input v-model="details.roles" type="checkbox" :value="role.id"><span>{{ title(role) }}</span></label></fieldset>
            </template>
            <label v-if="group.id === 'support' && selected.includes('maintenance')" class="estimate-field">{{ es ? '¿Qué tareas querés delegar cada mes?' : 'What tasks would you like to delegate each month?' }}<textarea v-model="details.supportNotes" rows="2" maxlength="400"></textarea></label>
            <label v-if="group.id === 'support' && selected.includes('technical-help')" class="estimate-field">{{ es ? '¿Qué está pasando?' : 'What is happening?' }}<textarea v-model="details.issue" rows="2" maxlength="500"></textarea></label>
            <p class="estimate-note">{{ es ? 'Los valores corresponden al alcance base de cada servicio. Cantidades, fuentes o reglas adicionales se presupuestan antes de comenzar.' : 'Prices apply to each service’s base scope. Extra quantities, sources or rules are quoted before work begins.' }}</p>
          </div>
          </div>
        </div>

        <details class="estimate-details">
          <summary>{{ es ? 'VendoAlgo: plan y funciones adicionales' : 'VendoAlgo: plan and extra features' }}</summary>
          <p class="estimate-note">{{ es ? 'Se paga a VendoAlgo, separado de mis servicios. Si todavía no sabés qué necesitás, lo definimos al conversar.' : 'Paid to VendoAlgo separately from my services. If you are unsure what you need, I can help you choose.' }}</p>
          <label class="estimate-field">{{ es ? 'Plan de la plataforma' : 'Platform plan' }}
            <select :value="effectivePlatform" :disabled="proRequired" @change="platform = $event.target.value">
              <option value="unsure">{{ es ? 'No lo sé todavía' : 'Not sure yet' }}</option>
              <option value="free">{{ es ? 'Gratis · hasta 50 productos activos' : 'Free · up to 50 active products' }}</option>
              <option value="pro">Pro · {{ money(storePlatformPricing.plans.pro.monthly) }}/{{ es ? 'mes' : 'month' }}</option>
            </select>
          </label>
          <p v-if="proRequired" class="estimate-note">{{ es ? 'Las funciones seleccionadas requieren Pro. Mercado Libre y facturación también incluyen su módulo mensual en el resumen. Si ya los pagás, no son una suscripción adicional.' : 'The selected features require Pro. Mercado Libre and invoicing also include their monthly module in the summary. If you already pay for them, this is not an additional subscription.' }}</p>
          <fieldset class="estimate-modules"><legend>{{ es ? 'Módulos opcionales · requieren Pro' : 'Optional modules · require Pro' }}</legend>
            <label v-for="item in storePlatformPricing.modules" :key="item.id" class="estimate-module"><input type="checkbox" :checked="selectedModules.some(module => module.id === item.id)" :disabled="requiredModuleIds.includes(item.id)" @change="toggleModule(item.id, $event.target.checked)"><span>{{ item.name }}</span><strong>{{ money(item.monthly) }}/{{ es ? 'mes' : 'month' }}</strong></label>
          </fieldset>
          <p class="estimate-note"><a :href="storePlatformPricing.sourceUrl" target="_blank" rel="noopener noreferrer">{{ es ? 'Consultar precios y condiciones de VendoAlgo' : 'See VendoAlgo pricing and terms' }} ↗</a></p>
          <p class="estimate-note">{{ es ? 'Las comisiones de cobro, el dominio y otros servicios externos, si corresponden, se abonan aparte.' : 'Payment processing fees, domain registration and other external services, where applicable, are separate.' }}</p>
        </details>
      </div>

      <aside class="estimate-summary" aria-labelledby="estimate-summary-title">
        <p class="eyebrow">{{ es ? 'TU SELECCIÓN' : 'YOUR SELECTION' }}</p>
        <h3 id="estimate-summary-title">{{ es ? 'Resumen estimado' : 'Estimated summary' }}</h3>
        <p v-if="!hasSelection" class="estimate-note">{{ es ? 'Elegí al menos un servicio para armar tu consulta.' : 'Choose at least one service to build your inquiry.' }}</p>
        <p v-if="hasSelection" class="estimate-selection-count">{{ selected.length }} {{ es ? 'servicios en tu propuesta' : 'services in your proposal' }}</p>

        <div class="estimate-totals" role="status" aria-live="polite" aria-atomic="true">
          <div><span>{{ es ? 'Mis servicios · por única vez' : 'My services · one-time' }}</span><strong>{{ onceLabel }}</strong></div>
          <div><span>{{ es ? 'Mis servicios · por mes' : 'My services · per month' }}</span><strong>{{ monthlyLabel }}</strong></div>
          <div class="estimate-platform-total"><span>{{ es ? 'VendoAlgo · por mes, aparte' : 'VendoAlgo · per month, separate' }}</span><strong>{{ platformCost === null ? (es ? 'Plan por definir' : 'Plan to confirm') : money(platformCost) }}</strong></div>
        </div>
        <details v-if="hasSelection" class="estimate-summary-detail">
          <summary><span>{{ es ? 'Ver detalle de la selección' : 'View selection details' }}</span><span class="estimate-count">{{ selected.length }}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
          <div class="estimate-detail-scroll" role="region" tabindex="0" :aria-label="es ? 'Servicios seleccionados y sus importes' : 'Selected services and fees'">
        <ul class="estimate-selected-list">
          <li v-for="item in checkedBasics" :key="item.id"><span>{{ title(item) }}</span><strong>{{ money(item.price) }}</strong></li>
          <li v-for="item in checkedExtras" :key="item.id"><span>{{ title(item) }}<small class="estimate-summary-mode">{{ modeLabel(item) }}</small></span><strong class="estimate-summary-fee">{{ itemFees(item) }}</strong></li>
          <li v-if="sharedInitialSaving" class="estimate-saving"><span>{{ es ? 'Preparación compartida · una fuente' : 'Shared setup · one source' }}</span><strong>−{{ money(sharedInitialSaving) }}</strong></li>
          <li v-if="sharedMonthlySaving" class="estimate-saving"><span>{{ es ? 'Revisión mensual compartida' : 'Shared monthly review' }}</span><strong>−{{ money(sharedMonthlySaving) }}/{{ es ? 'mes' : 'month' }}</strong></li>
        </ul>
          </div>
        </details>

        <p class="estimate-summary-footnote">{{ es ? 'Estimado en ARS · Emito factura · Confirmo el alcance y el precio antes de comenzar.' : 'Estimate in ARS · Invoice provided · Scope and price confirmed before starting.' }}</p>
        <details class="estimate-summary-detail estimate-conditions">
          <summary><span>{{ es ? 'Alcance y condiciones del estimado' : 'Estimate scope and terms' }}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p v-if="hasSelection && !monthlyAmount && !pendingMonthly" class="estimate-note">{{ es ? 'Los servicios seleccionados no requieren contratarme un abono mensual.' : 'The selected services do not require a monthly service retainer.' }}</p>
        <p v-if="pendingOnce || pendingMonthly" class="estimate-note">{{ es ? 'Hay conceptos pendientes de cotizar. Los importes numéricos solo suman los conceptos con precio definido.' : 'Some services need a quote: the final total is pending. Numeric amounts only include items with a defined price.' }}</p>
        <p v-if="automationCount" class="estimate-note">{{ es ? 'Automatizaciones: estimado para una fuente compartida, hasta 100 productos y una actualización diaria. Más fuentes, mayor volumen, reglas especiales o consumo de servicios externos pueden cambiar el importe.' : 'Automations: estimate for one shared source, up to 100 products and one daily update. Extra sources, higher volumes, special rules or external service usage may change the price.' }}</p>

          <p class="estimate-note">{{ es ? 'VendoAlgo, sus módulos, comisiones de cobro y servicios externos se pagan aparte. El resumen que me envíes incluye el listado completo, aunque lo tengas plegado.' : 'VendoAlgo, its modules, payment fees and external services are separate. Your inquiry includes the full list even when it is collapsed here.' }}</p>
        </details>
        <form class="estimate-contact-form" @submit.prevent="contact">
          <div class="estimate-contact-row"><label class="estimate-field">{{ es ? 'Tu nombre' : 'Your name' }}<input v-model="inquiry.name" autocomplete="name" required maxlength="100"></label>
          <label class="estimate-field">{{ es ? 'Negocio o web (opcional)' : 'Business or website (optional)' }}<input v-model="inquiry.business" maxlength="200"></label></div>
          <label class="estimate-field">{{ es ? 'Contame qué necesitás (opcional)' : 'Tell me what you need (optional)' }}<textarea v-model="inquiry.message" rows="2" maxlength="1200"></textarea></label>
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
</style>
