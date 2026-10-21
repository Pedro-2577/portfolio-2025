<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { storePlatformPricing } from './storeServices';
import { recommendServices } from './serviceGuidance';
import { readServiceDraft, saveServiceDraft, clearServiceDraft } from './serviceDraft';

const props = defineProps({ language: { type: String, default: 'es' }, showPrices: { type: Boolean, default: false } });
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
// Indicative upper estimates vary with product count, suppliers and work required.
const basicUpper = { design: 100000, catalog: 80000, payments: 25000, shipping: 40000, training: 30000 };
const extraUpper = {"migration":[150000,0],"more-products":[45000,0],"catalog-order":[60000,0],"visual-changes":[100000,0],"auto-prices":[300000,60000],"auto-stock":[280000,55000],"auto-new":[350000,65000],"auto-discontinued":[250000,45000],"auto-offers":[250000,45000],"ml":[80000,0],"arca":[40000,0],"shipping-rules":[60000,0],"team-training":[75000,0],"roles":[40000,0],"hiring":[200000,0],"maintenance":[0,90000],"technical-help":[45000,0]};
const sharedAutomation = { initial: 80000, monthly: 15000, initialUpper: 160000, monthlyUpper: 30000 };
const pricedExtras = extras.map(item => ({ ...item, ...extraRates[item.id], initialUpper: extraUpper[item.id][0], monthlyUpper: extraUpper[item.id][1] }));

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
  const picked = groupSelected(group).length;
  return picked
    ? picked + (es.value ? ' de ' : ' of ') + count + (es.value ? ' servicios elegidos' : ' services selected')
    : count + (es.value ? ' servicios disponibles' : ' services available');
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
const sharedInitialSavingUpper = computed(() => Math.max(0, automationCount.value - 1) * sharedAutomation.initialUpper);
const sharedMonthlySavingUpper = computed(() => Math.max(0, automationCount.value - 1) * sharedAutomation.monthlyUpper);
const amount = computed(() => basicAmount.value + checkedExtras.value.reduce((sum, item) => sum + (item.initial || 0), 0) - sharedInitialSaving.value);
const monthlyAmount = computed(() => checkedExtras.value.reduce((sum, item) => sum + (item.monthly || 0), 0) - sharedMonthlySaving.value);
const pendingOnce = computed(() => checkedExtras.value.some(item => item.mode !== 'monthly' && !Number.isFinite(item.initial)));
const pendingMonthly = computed(() => checkedExtras.value.some(item => item.mode !== 'once' && !Number.isFinite(item.monthly)));
const estimatedOnce = computed(() => checkedExtras.value.some(item => item.initial > 0));
const estimatedMonthly = computed(() => monthlyAmount.value > 0);
const basicAmountUpper = computed(() => checkedBasics.value.reduce((sum, item) => sum + basicUpper[item.id], 0));
const amountUpper = computed(() => basicAmountUpper.value + checkedExtras.value.reduce((sum, item) => sum + item.initialUpper, 0) - Math.max(0, automationCount.value - 1) * sharedAutomation.initialUpper);
const monthlyAmountUpper = computed(() => checkedExtras.value.reduce((sum, item) => sum + item.monthlyUpper, 0) - Math.max(0, automationCount.value - 1) * sharedAutomation.monthlyUpper);
const requiredModuleIds = computed(() => [
  ...(selected.value.includes('ml') ? ['mercadolibre'] : []),
  ...(selected.value.includes('arca') ? ['invoicing'] : []),
  ...(automationCount.value ? ['ai'] : []),
]);
const selectedModules = computed(() => storePlatformPricing.modules.filter(item => modules.value.includes(item.id) || requiredModuleIds.value.includes(item.id)));
const proRequired = computed(() => selectedModules.value.length > 0 || selected.value.includes('roles'));
function toggleModule(id, checked) {
  modules.value = checked ? [...new Set([...modules.value, id])] : modules.value.filter(value => value !== id);
}
const effectivePlatform = computed(() => proRequired.value || catalogSize.value === 'over50' ? 'pro' : platform.value);
const platformCost = computed(() => effectivePlatform.value === 'unsure' ? null : (effectivePlatform.value === 'pro' ? storePlatformPricing.plans.pro.monthly : 0) + selectedModules.value.reduce((sum, item) => sum + item.monthly, 0));
const money = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
const moneyRange = (lower, upper) => lower === upper ? money(lower) : money(lower) + ' – ' + money(upper);
const title = item => es.value ? item.es : item.en;
const description = item => es.value ? item.descEs : item.descEn;
const quote = computed(() => es.value ? 'A cotizar' : 'To be quoted');
const fromLabel = computed(() => es.value ? 'Desde ' : 'From ');
const onceLabel = computed(() => moneyRange(amount.value, amountUpper.value));
const monthlyLabel = computed(() => moneyRange(monthlyAmount.value, monthlyAmountUpper.value));
const basicFees = item => moneyRange(item.price, basicUpper[item.id]);
const itemFees = item => {
  const parts = [];
  if (item.initial) parts.push(moneyRange(item.initial, item.initialUpper) + (es.value ? ' una vez' : ' one-time'));
  if (item.monthly) parts.push(moneyRange(item.monthly, item.monthlyUpper) + (es.value ? '/mes' : '/month'));
  return parts.join(' · ') || quote.value;
};
const itemScope = item => es.value ? item.scopeEs : item.scopeEn;
const platformFeatureName = item => !es.value ? item.name : ({ blog: 'Publicar artículos y noticias', coupons: 'Cupones de descuento', recovery: 'Recordar compras que quedaron sin terminar', shopping: 'Mostrar productos en Google', mercadolibre: 'Conectar Mercado Libre', ai: 'Conexión IA · para actualizaciones automáticas', invoicing: 'Emitir facturas automáticamente' })[item.id] || item.name;
const groupEstimate = group => {
  const items = groupSelected(group).length ? groupSelected(group) : groupOptions(group);
  const commonCount = group === 'automation' ? Math.max(0, items.length - 1) : 0;
  return {
    initial: items.reduce((sum, item) => sum + (item.initial || 0), 0) - commonCount * sharedAutomation.initial,
    monthly: items.reduce((sum, item) => sum + (item.monthly || 0), 0) - commonCount * sharedAutomation.monthly,
    initialUpper: items.reduce((sum, item) => sum + item.initialUpper, 0) - commonCount * sharedAutomation.initialUpper,
    monthlyUpper: items.reduce((sum, item) => sum + item.monthlyUpper, 0) - commonCount * sharedAutomation.monthlyUpper,
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
  catalogSize.value = businessAnswers.value.catalogSize || 'unsure';
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

const goal = ref('');
const selectionMode = ref('guided');
const questionnaireStarted = ref(false);
const helpKind = ref('');
const catalogSize = ref('unsure');
const workspace = ref(null);
const customServicesDetails = ref(null);
const openCustomGroups = ref([]);
const questionnaireStep = ref(0);
const businessAnswers = ref({ website: '', marketplace: '', products: '', catalogSize: '' });
const businessQuestions = [
  {
    id: 'website',
    es: '¿Ya tenés una página donde tus clientes puedan ver y comprar tus productos?',
    en: 'Do you already have a website where customers can see and buy your products?',
    options: [
      { id: 'yes', es: 'Sí, mi tienda está en VendoAlgo', en: 'Yes, my store is on VendoAlgo' },
      { id: 'other-platform', es: 'Sí, en otra plataforma; quiero evaluar pasarla a VendoAlgo', en: 'Yes, on another platform; I want to consider moving it to VendoAlgo' },
      { id: 'new', es: 'No, quiero crear una tienda en VendoAlgo', en: 'No, I want to create a store on VendoAlgo' },
      { id: 'other-channels', es: 'No; vendo por Mercado Libre, redes, WhatsApp o en un local', en: 'No; I sell on Mercado Libre, social media, WhatsApp or in a store' },
      { id: 'unsure', es: 'No estoy seguro; prefiero conversarlo', en: 'I am not sure; I would rather talk it through' },
    ],
  },
  {
    id: 'marketplace',
    es: '¿Vendés actualmente por Mercado Libre?',
    en: 'Do you currently sell on Mercado Libre?',
    options: [
      { id: 'already', es: 'Sí, ya vendo por ahí', en: 'Yes, I already sell there' },
      { id: 'interested', es: 'No, pero quiero empezar', en: 'No, but I would like to start' },
      { id: 'not-now', es: 'No me interesa por ahora', en: 'I am not interested right now' },
      { id: 'unsure', es: 'No sé; prefiero conversarlo', en: 'I am not sure; I would rather talk it through' },
    ],
  },
  {
    id: 'products',
    es: '¿Cómo conseguís los productos que vendés?',
    en: 'How do you get the products you sell?',
    options: [
      { id: 'suppliers', es: 'Los compro a proveedores', en: 'I buy them from suppliers' },
      { id: 'made-here', es: 'Los fabrico o preparo yo', en: 'I make or prepare them myself' },
      { id: 'both', es: 'Un poco de ambas', en: 'A bit of both' },
      { id: 'unsure', es: 'Todavía no vendo o no lo decidí', en: 'I do not sell yet or have not decided' },
    ],
  },
  {
    id: 'catalogSize',
    es: '¿Cuántos productos querés ofrecer en la tienda?',
    en: 'How many products would you like to offer in your store?',
    options: [
      { id: 'upto50', es: 'Hasta 50 productos', en: 'Up to 50 products' },
      { id: 'over50', es: 'Más de 50 productos', en: 'More than 50 products' },
      { id: 'unsure', es: 'No lo sé todavía', en: 'I am not sure yet' },
    ],
  },
];
const activeQuestion = computed(() => businessQuestions[questionnaireStep.value]);
const recommendation = computed(() => recommendServices(businessAnswers.value));
const answerLabels = {
  website: {
    yes: ['Tenés una tienda online en VendoAlgo', 'You have an online store on VendoAlgo'],
    'other-platform': ['Tenés una tienda online en otra plataforma y querés evaluar pasarla a VendoAlgo', 'You have an online store on another platform and want to consider moving it to VendoAlgo'],
    new: ['Querés crear una tienda online en VendoAlgo', 'You want to create an online store on VendoAlgo'],
    'other-channels': ['Hoy vendés por Mercado Libre, redes, WhatsApp o en un local, pero no tenés tienda online', 'You currently sell on Mercado Libre, social media, WhatsApp or in a store, but do not have an online store'],
    unsure: ['Todavía no sabés si necesitás una tienda online', 'You are not sure whether you need an online store'],
  },
  marketplace: {
    already: ['Ya vendés por Mercado Libre', 'You already sell on Mercado Libre'],
    interested: ['Te interesa vender por Mercado Libre', 'You are interested in selling on Mercado Libre'],
    'not-now': ['Mercado Libre no es una prioridad ahora', 'Mercado Libre is not a priority right now'],
    unsure: ['Todavía no definiste si querés vender por Mercado Libre', 'You have not decided whether to sell on Mercado Libre'],
  },
  products: {
    suppliers: ['Comprás productos a proveedores', 'You buy products from suppliers'],
    'made-here': ['Fabricás o preparás tus productos', 'You make or prepare your products'],
    both: ['Algunos los comprás y otros los fabricás o preparás', 'You buy some products and make or prepare others'],
    unsure: ['Todavía no vendés o no decidiste qué productos ofrecer', 'You are not selling yet or have not decided which products to offer'],
  },
};
const catalogSizeLabels = {
  upto50: ['Querés ofrecer hasta 50 productos', 'You want to offer up to 50 products'],
  over50: ['Querés ofrecer más de 50 productos', 'You want to offer more than 50 products'],
  unsure: ['La cantidad de productos está por definir', 'The product count is still to be decided'],
};
const guidanceSummary = computed(() => [
  ['website', businessAnswers.value.website],
  ['marketplace', businessAnswers.value.marketplace],
  ['products', businessAnswers.value.products],
  ['catalogSize', businessAnswers.value.catalogSize],
].map(([question, answer]) => (question === 'catalogSize' ? catalogSizeLabels : answerLabels[question])[answer]?.[es.value ? 0 : 1]).filter(Boolean).join(' · '));
const savedChoices = ref({});
const guidedGoals = [
  { id: 'launch', es: 'Quiero crear una tienda online en VendoAlgo', en: 'I want to create an online store on VendoAlgo', descEs: 'Empezar a vender con una tienda preparada para mi negocio.', descEn: 'Start selling with a store prepared for my business.' },
  { id: 'help', es: 'Ya tengo tienda y necesito ayuda', en: 'I have a store and need help', descEs: 'Hacer cambios, resolver un problema o recibir ayuda cada mes.', descEn: 'Make changes, fix an issue or get ongoing help.' },
  { id: 'updates', es: 'Quiero dejar de actualizar datos a mano', en: 'I want to stop updating things manually', descEs: 'Mantener precios, cantidades o productos al día.', descEn: 'Keep prices, quantities or products up to date.' },
  { id: 'custom', es: 'Elegí los servicios que necesitás', en: 'Choose the services you need', descEs: 'Ya marqué algunas opciones según tus respuestas. Podés sumar o sacar cualquiera.', descEn: 'I selected a few options based on your answers. Add or remove any of them.' },
];
const helpOptions = [
  { id: 'catalogue', es: 'Cambiar productos o el diseño', en: 'Change products or design' },
  { id: 'problem', es: 'Resolver un problema', en: 'Resolve an issue' },
  { id: 'monthly', es: 'Recibir ayuda todos los meses', en: 'Get help every month' },
  { id: 'team', es: 'Preparar o ampliar mi equipo', en: 'Train or expand my team' },
  { id: 'configuration', es: 'Mercado Libre, facturas o envíos', en: 'Mercado Libre, invoices or shipping' },
];
const currentGoal = computed(() => {
  if (goal.value === 'help' && recommendation.value.orientation) {
    return { id: 'help', es: 'Quiero orientación para mi negocio', en: 'I would like guidance for my business' };
  }
  const current = guidedGoals.find(item => item.id === goal.value);
  if (goal.value === 'custom') return {
    ...current,
    es: selectionMode.value === 'manual' ? 'Elegí los servicios que te interesan' : 'Revisá los servicios sugeridos',
    en: selectionMode.value === 'manual' ? 'Choose the services you are interested in' : 'Review your suggested services',
  };
  return current;
});
const relevantServices = computed(() => {
  if (goal.value === 'updates') return pricedExtras.filter(item => item.group === 'automation');
  if (goal.value !== 'help') return [];
  if (helpKind.value === 'problem') return pricedExtras.filter(item => item.id === 'technical-help');
  if (helpKind.value === 'monthly') return pricedExtras.filter(item => item.id === 'maintenance');
  return pricedExtras.filter(item => item.group === helpKind.value);
});
const guidedTitles = {
  'auto-prices': ['Los precios', 'Prices'],
  'auto-stock': ['Las cantidades disponibles', 'Available quantities'],
  'auto-new': ['Los productos nuevos de mis proveedores', 'New products from my suppliers'],
  'auto-discontinued': ['Los productos que mis proveedores dejan de vender', 'Discontinued supplier products'],
  'auto-offers': ['Las ofertas', 'Offers'],
};
const choiceTitle = item => guidedTitles[item.id] ? guidedTitles[item.id][es.value ? 0 : 1] : title(item);
function saveGoalChoices() {
  if (!goal.value) return;
  savedChoices.value[goal.value] = { selected: [...selected.value], helpKind: helpKind.value, modules: [...modules.value], catalogSize: catalogSize.value, platform: platform.value };
}
async function chooseGoal(id) {
  saveGoalChoices();
  const saved = savedChoices.value[id];
  goal.value = id;
  helpKind.value = saved?.helpKind || '';
  selected.value = saved ? [...saved.selected] : id === 'launch' ? options.map(item => item.id) : [];
  modules.value = saved ? [...saved.modules] : [];
  catalogSize.value = saved?.catalogSize || 'unsure';
  await nextTick();
  platform.value = saved?.platform || 'unsure';
  workspace.value?.focus({ preventScroll: true });
  workspace.value?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
async function changeGoal() {
  saveGoalChoices();
  goal.value = '';
  selectionMode.value = 'guided';
  questionnaireStarted.value = true;
  questionnaireStep.value = 0;
  await nextTick();
  document.getElementById('service-scope-title')?.focus({ preventScroll: true });
  document.getElementById('service-scope-title')?.scrollIntoView({ block: 'start', behavior: 'auto' });
}
async function openCatalog() {
  const previous = { selected: [...selected.value], modules: [...modules.value], catalogSize: catalogSize.value, platform: platform.value };
  selectionMode.value = 'manual';
  questionnaireStarted.value = false;
  await chooseGoal('custom');
  selected.value = previous.selected;
  modules.value = previous.modules;
  catalogSize.value = previous.catalogSize;
  platform.value = previous.platform;
  expanded.value = false;
  expandedGroups.value = {};
}
async function answerQuestion(optionId) {
  const question = activeQuestion.value;
  businessAnswers.value[question.id] = optionId;
  if (questionnaireStep.value < businessQuestions.length - 1) {
    questionnaireStep.value += 1;
    await nextTick();
    document.getElementById('business-question-title')?.focus({ preventScroll: true });
    return;
  }

  const suggestion = recommendation.value;
  await chooseGoal('custom');
  selected.value = [...suggestion.selected];
  catalogSize.value = businessAnswers.value.catalogSize || 'unsure';
  expanded.value = suggestion.expandLaunch;
  expandedGroups.value = {};
  openCustomGroups.value = [...suggestion.openGroups];
}
function setCustomGroupOpen(groupId, event) {
  const next = new Set(openCustomGroups.value);
  if (event.target.open) next.add(groupId);
  else next.delete(groupId);
  openCustomGroups.value = [...next];
}
async function exploreOtherServices(groupId = '') {
  if (!customServicesDetails.value) return;
  customServicesDetails.value.open = true;
  await nextTick();
  const category = groupId
    ? customServicesDetails.value.querySelector(`[data-service-group="${groupId}"]`)
    : null;
  if (category) category.open = true;
  (category || customServicesDetails.value).scrollIntoView({
    block: 'center',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}
function chooseHelp(kind) {
  helpKind.value = kind;
  selected.value = kind === 'problem' ? ['technical-help'] : kind === 'monthly' ? ['maintenance'] : [];
  modules.value = [];
}
const draftSchema = {
  questions: businessQuestions,
  services: [...options, ...pricedExtras].map(item => item.id),
  modules: storePlatformPricing.modules.map(item => item.id),
  groups: serviceGroups.map(item => item.id),
};
const restoredDraft = readServiceDraft(draftSchema);
if (restoredDraft) {
  selectionMode.value = restoredDraft.mode;
  questionnaireStarted.value = restoredDraft.started;
  businessAnswers.value = restoredDraft.answers;
  questionnaireStep.value = restoredDraft.step;
  goal.value = restoredDraft.completed ? 'custom' : '';
  selected.value = restoredDraft.selected;
  modules.value = restoredDraft.modules;
  catalogSize.value = restoredDraft.catalogSize;
  platform.value = restoredDraft.platform;
  expanded.value = restoredDraft.expanded;
  expandedGroups.value = restoredDraft.expandedGroups;
}
const draftSnapshot = computed(() => ({
  mode: selectionMode.value,
  started: questionnaireStarted.value,
  answers: { ...businessAnswers.value },
  step: questionnaireStep.value,
  completed: Boolean(goal.value),
  selected: [...selected.value],
  modules: [...modules.value],
  catalogSize: catalogSize.value,
  platform: platform.value,
  expanded: expanded.value,
  expandedGroups: { ...expandedGroups.value },
}));
watch(draftSnapshot, draft => {
  const started = draft.completed || Object.values(draft.answers).some(Boolean) || draft.selected.length > 0;
  if (started) saveServiceDraft(draft);
  else clearServiceDraft();
}, { deep: true, flush: 'post' });

async function restartQuestionnaire() {
  clearServiceDraft();
  businessAnswers.value = { website: '', marketplace: '', products: '', catalogSize: '' };
  questionnaireStep.value = 0;
  goal.value = '';
  selectionMode.value = 'guided';
  questionnaireStarted.value = true;
  helpKind.value = '';
  savedChoices.value = {};
  clearServices();
  expanded.value = false;
  expandedGroups.value = {};
  openCustomGroups.value = [];
  details.value = { productCount: '', source: '', suppliers: '', frequency: '', teamSize: '', roles: [], issue: '', catalogueNotes: '', configurationNotes: '', supportNotes: '' };
  inquiry.value = { name: '', business: '', message: '' };
  await nextTick();
  document.getElementById('business-question-title')?.focus({ preventScroll: true });
  document.getElementById('service-scope-title')?.scrollIntoView({ block: 'start', behavior: 'auto' });
}

watch([catalogSize, automationCount], ([size, automaticTasks]) => {
  platform.value = size === 'over50' ? 'pro' : size === 'upto50' && !automaticTasks ? 'free' : 'unsure';
});
// Automation platform requirements confirmed by Pedro: Pro plus the AI connection module.
const platformPending = computed(() => platformCost.value === null);
const monthlyTotalLower = computed(() => platformPending.value ? null : monthlyAmount.value + platformCost.value);
const monthlyTotalUpper = computed(() => platformPending.value ? null : monthlyAmountUpper.value + platformCost.value);
const guidanceUrl = computed(() => 'https://wa.me/5491158471048?text=' + encodeURIComponent(
  (es.value ? 'Hola Pedro, quiero que me ayudes a elegir lo que necesita mi negocio.' : 'Hi Pedro, I would like help choosing what my business needs.') +
  ''
));

const message = computed(() => {
  const lines = [
    es.value ? 'Hola Pedro, me interesan estos servicios para mi tienda:' : 'Hi Pedro, I am interested in these services for my store:',
    ...(currentGoal.value && goal.value !== 'custom' ? [(es.value ? 'Por dónde empezar: ' : 'Starting point: ') + title(currentGoal.value)] : []),
    ...(businessAnswers.value.website ? [(es.value ? 'Tienda online: ' : 'Online store: ') + ({ yes: es.value ? 'ya tengo una en VendoAlgo' : 'already have one on VendoAlgo', 'other-platform': es.value ? 'tengo una en otra plataforma y quiero evaluar pasarla a VendoAlgo' : 'have one on another platform and want to consider moving it to VendoAlgo', new: es.value ? 'quiero crear una en VendoAlgo' : 'want to create one on VendoAlgo', 'other-channels': es.value ? 'todavía no tengo; vendo por Mercado Libre, redes, WhatsApp o en un local' : 'do not have one yet; I sell on Mercado Libre, social media, WhatsApp or in a store', unsure: es.value ? 'todavía no lo sé' : 'not sure' }[businessAnswers.value.website])] : []),
    ...(businessAnswers.value.marketplace ? [(es.value ? 'Mercado Libre: ' : 'Mercado Libre: ') + ({ already: es.value ? 'ya vendo' : 'already sell there', interested: es.value ? 'me interesa empezar' : 'interested in starting', 'not-now': es.value ? 'no por ahora' : 'not right now', unsure: es.value ? 'no estoy seguro' : 'not sure' }[businessAnswers.value.marketplace])] : []),
    ...(businessAnswers.value.products ? [(es.value ? 'Origen de productos: ' : 'Product source: ') + ({ suppliers: es.value ? 'compro a proveedores' : 'buy from suppliers', 'made-here': es.value ? 'fabrico o preparo mis productos' : 'make or prepare my products', both: es.value ? 'compro algunos y fabrico o preparo otros' : 'buy some and make or prepare others', unsure: es.value ? 'todavía no vendo o no lo decidí' : 'not selling yet or have not decided' }[businessAnswers.value.products])] : []),
    '',
    ...checkedBasics.value.map(item => '- ' + title(item) + (props.showPrices ? ': ' + basicFees(item) + (es.value ? ' una vez' : ' one-time') : '')),
    ...checkedExtras.value.map(item => '- ' + title(item) + (props.showPrices ? ': ' + itemFees(item) : '')),
    ...(props.showPrices && sharedInitialSaving.value ? [(es.value ? 'Preparación compartida (una fuente): -' : 'Shared setup (one source): -') + moneyRange(sharedInitialSaving.value, sharedInitialSavingUpper.value)] : []),
    ...(props.showPrices && sharedMonthlySaving.value ? [(es.value ? 'Descuento en el cuidado mensual: -' : 'Shared monthly review: -') + moneyRange(sharedMonthlySaving.value, sharedMonthlySavingUpper.value) + (es.value ? '/mes' : '/month')] : []),
    ...(catalogSize.value !== 'unsure' ? [(es.value ? 'Productos que quiero vender: ' : 'Products I want to sell: ') + (catalogSize.value === 'upto50' ? (es.value ? 'hasta 50' : 'up to 50') : (es.value ? 'más de 50' : 'more than 50'))] : []),
    ...contextLines.value,
    '',
    ...(props.showPrices && hasSelection.value ? [
    (es.value ? 'Mi trabajo, una sola vez: ' : 'One-time service fees: ') + onceLabel.value,
    (es.value ? 'Mi trabajo, cada mes: ' : 'Monthly service fees: ') + monthlyLabel.value,
    (es.value ? 'VendoAlgo mensual (se paga aparte): ' : 'VendoAlgo monthly (paid separately): ') + (platformPending.value ? (es.value ? 'costo por confirmar' : 'cost to be confirmed') : money(platformCost.value)),
    (es.value ? 'Plan: ' : 'Plan: ') + (effectivePlatform.value === 'unsure' ? (es.value ? 'necesito orientación' : 'I need advice') : effectivePlatform.value === 'pro' ? 'Pro' : (es.value ? 'Gratis (hasta 50 productos activos)' : 'Free (up to 50 active products)')),
    ...selectedModules.value.map(item => '- ' + item.name + ': ' + money(item.monthly) + (es.value ? '/mes' : '/month')),
    ] : []),
    '',
    (es.value ? 'Nombre: ' : 'Name: ') + inquiry.value.name.trim(),
    ...(inquiry.value.business.trim() ? [(es.value ? 'Negocio / web: ' : 'Business / website: ') + inquiry.value.business.trim()] : []),
    ...(inquiry.value.message.trim() ? ['', inquiry.value.message.trim()] : []),
    '',
    props.showPrices ? (es.value ? 'Rangos orientativos en pesos argentinos. El precio depende de la cantidad de productos, proveedores y trabajo necesario. Confirmamos el presupuesto antes de empezar. VendoAlgo se paga aparte.' : 'Indicative ranges in ARS. Final price depends on products, suppliers and work required. We confirm a quote before starting. VendoAlgo is separate.') : (es.value ? 'Quisiera que conversemos sobre lo que necesito y me pases un presupuesto.' : 'I would like to discuss what I need and receive a quote.'),
  ];
  return lines.join('\n');
});
function showPaymentTerms() {
  document.getElementById('service-payment')?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
function contact(event) {
  if (!goal.value && !hasSelection.value) return;
  const channel = event.submitter?.value;
  if (channel === 'whatsapp') {
    window.open('https://wa.me/5491158471048?text=' + encodeURIComponent(message.value), '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = 'mailto:pedromendezcaraban@gmail.com?subject=' + encodeURIComponent(es.value ? 'Consulta por servicios para mi tienda' : 'Store services inquiry') + '&body=' + encodeURIComponent(message.value);
  }
}

</script>


<template>
  <div class="guided-service service-estimator" :class="{ 'has-prices': showPrices, 'without-prices': !showPrices }">
    <header v-if="!goal" class="guided-intro">
      <p class="eyebrow">{{ es ? 'ELEGÍ TUS SERVICIOS' : 'CHOOSE YOUR SERVICES' }}</p>
      <h2 id="service-scope-title" tabindex="-1">{{ questionnaireStarted ? (es ? 'Te ayudo a elegir servicios' : 'Let me help you choose services') : (es ? '¿En qué te puedo ayudar?' : 'How can I help your business?') }}</h2>
      <p>{{ questionnaireStarted ? (es ? 'Al terminar vas a poder revisar y cambiar los servicios sugeridos.' : 'When you finish, you can review and change the suggested services.') : (es ? 'Podés pedir un presupuesto por una tarea o por varias.' : 'Request a quote for one task or several services.') }}</p>
    </header>
    <div v-if="!goal && !questionnaireStarted" class="guided-start" :aria-label="es ? 'Elegir cómo preparar la consulta' : 'Choose how to prepare your inquiry'">
      <article class="guided-entry guided-entry-primary">
        <h3>{{ es ? 'Quiero que me sugieras servicios' : 'Help me find the right services' }}</h3>
        <p>{{ es ? '4 preguntas sobre tu negocio y una selección que podés cambiar.' : 'Four questions about your business, then a selection you can change.' }}</p>
        <button type="button" class="button button-primary" @click="changeGoal">{{ es ? 'Responder 4 preguntas' : 'Answer 4 questions' }} <span aria-hidden="true">→</span></button>
      </article>
      <article class="guided-entry">
        <h3>{{ es ? 'Prefiero elegir por mi cuenta' : 'I prefer to choose for myself' }}</h3>
        <p>{{ es ? 'Mirá el catálogo y marcá las tareas que te interesen.' : 'Browse the catalog and select the tasks that interest you.' }}</p>
        <button type="button" class="button guided-catalog-button" @click="openCatalog">{{ es ? 'Ver todos los servicios' : 'See all services' }} <span aria-hidden="true">→</span></button>
      </article>
    </div>
    <div v-else-if="!goal" class="business-questionnaire">
      <div class="questionnaire-progress">
        <span aria-live="polite">{{ es ? 'Pregunta' : 'Question' }} {{ questionnaireStep + 1 }} {{ es ? 'de' : 'of' }} {{ businessQuestions.length }}</span>
        <div class="questionnaire-actions"><button v-if="questionnaireStep > 0" type="button" @click="questionnaireStep -= 1">{{ es ? '← Anterior' : '← Back' }}</button><button type="button" v-if="businessAnswers.website || hasSelection" class="guided-reset" :title="es ? 'Borrar las respuestas y los servicios guardados y volver a la primera pregunta' : 'Clear saved answers and services and return to the first question'" @click="restartQuestionnaire"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 11a9 9 0 1 1 2.6 6.4"/><path d="M3 4v7h7"/></svg><span>{{ es ? 'Reiniciar preguntas' : 'Restart questions' }}</span></button></div>
      </div>
      <progress class="questionnaire-bar" :value="questionnaireStep + 1" :max="businessQuestions.length" :aria-label="es ? 'Avance de las preguntas' : 'Question progress'"></progress>
      <h3 id="business-question-title" tabindex="-1">{{ es ? activeQuestion.es : activeQuestion.en }}</h3>
      <div class="questionnaire-options" role="group" aria-labelledby="business-question-title">
        <button v-for="option in activeQuestion.options" :key="option.id" type="button" :aria-pressed="businessAnswers[activeQuestion.id] === option.id" :class="{ 'is-selected': businessAnswers[activeQuestion.id] === option.id }" @click="answerQuestion(option.id)">
          {{ es ? option.es : option.en }}
        </button>
      </div>
      <p class="guided-save-note">{{ es ? 'Tu avance queda guardado en este navegador.' : 'Your progress is saved in this browser.' }}</p>
      <p class="guided-question-shortcut"><button type="button" class="guided-text-button" @click="openCatalog">{{ es ? 'Prefiero ver los servicios sin responder' : 'Browse services without answering' }} →</button></p>
      <p class="guided-help">{{ es ? '¿Preferís hablarlo? ' : 'Would you rather talk it through? ' }}<a :href="guidanceUrl" target="_blank" rel="noopener noreferrer">{{ es ? 'Escribime y te oriento' : 'Message me for guidance' }} ↗</a></p>
    </div>

    <section v-else ref="workspace" class="guided-workspace" tabindex="-1" aria-labelledby="guided-goal-title">
      <div class="guided-current">
        <div><p class="eyebrow">{{ es ? 'TU NEGOCIO' : 'YOUR BUSINESS' }}</p><h2 id="guided-goal-title">{{ title(currentGoal) }}</h2></div>
        <div class="guided-draft-actions"><button type="button" class="guided-text-button" @click="changeGoal">{{ selectionMode === 'manual' ? (es ? 'Ayudame a elegir' : 'Help me choose') : (es ? 'Cambiar mis respuestas' : 'Change my answers') }}</button><button type="button" class="guided-reset" :title="es ? 'Borrar las respuestas y los servicios guardados y volver a la primera pregunta' : 'Clear saved answers and services and return to the first question'" @click="restartQuestionnaire"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 11a9 9 0 1 1 2.6 6.4"/><path d="M3 4v7h7"/></svg><span>{{ es ? 'Reiniciar preguntas' : 'Restart questions' }}</span></button></div>
      </div>
      <p class="guided-result-instruction">{{ selectionMode === 'manual' ? (es ? 'Marcá los servicios que te interesen. Abrí «Qué incluye» cuando necesites más detalle.' : 'Select the services that interest you. Open “What is included” when you need details.') : (es ? 'Marqué estos servicios según tus respuestas. Podés agregar o quitar cualquiera antes de consultarme.' : 'I selected these services based on your answers. Add or remove any before contacting me.') }}</p>
      <details v-if="businessAnswers.website" class="guided-recommendation" aria-labelledby="guidance-result-title">
        <summary id="guidance-result-title">{{ es ? 'Ver mis respuestas' : 'View my answers' }}</summary>
        <p>{{ guidanceSummary }}</p>
      </details>
      <div class="guided-layout">
        <div v-if="goal === 'custom'" class="guided-bulk guided-catalog-toolbar"><strong>{{ es ? '1. Elegí los servicios' : '1. Choose services' }}</strong><span role="status" aria-live="polite">{{ selected.length }} {{ es ? 'elegidos' : 'selected' }}</span><button type="button" @click="selectAllServices" :disabled="allServicesSelected">{{ es ? 'Seleccionar todo' : 'Select all' }}</button><button type="button" @click="clearServices" :disabled="!hasSelection && !modules.length">{{ es ? 'Quitar todo' : 'Clear all' }}</button></div>
        <div class="guided-main">
          <div v-if="goal === 'custom'" class="estimate-choices guided-custom-catalog">
        <div class="estimate-package" :class="{ 'is-selected': checkedBasics.length }">
          <div class="estimate-package-heading">
            <label class="estimate-package-select">
              <input type="checkbox" :checked="allBasics" :indeterminate.prop="partialBasics" @change="toggleBasics">
              <span><strong>{{ es ? 'Crear tienda en VendoAlgo' : 'Create a VendoAlgo store' }}</strong><span class="estimate-caption">{{ checkedBasics.length ? checkedBasics.length + (es ? ' de ' : ' of ') + options.length + (es ? ' tareas elegidas · por única vez' : ' tasks selected · one-time') : (es ? '5 tareas disponibles · por única vez' : '5 tasks available · one-time') }}</span></span>
            </label>
            <strong v-if="showPrices" class="estimate-package-price">{{ moneyRange(partialBasics ? basicAmount : 150000, partialBasics ? basicAmountUpper : 275000) }}</strong>
            <button type="button" class="estimate-expand" :aria-expanded="expanded" aria-controls="launch-service-options" :aria-label="es ? 'Ver o editar los servicios de puesta en marcha' : 'View or edit launch services'" @click="expanded = !expanded"><svg :class="{ 'is-open': expanded }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
          </div>
          <div v-show="expanded" id="launch-service-options" class="estimate-options">
            <div v-for="item in options" :key="item.id" class="estimate-service-item estimate-launch-item" :class="{ 'is-selected': selected.includes(item.id) }">
              <label class="estimate-option">
                <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleBasic(item, $event.target.checked)">
                <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><em v-if="showPrices" class="estimate-service-fee">{{ basicFees(item) }} · {{ es ? 'por única vez' : 'one-time' }}</em></span>
              </label>
              <details class="estimate-item-details">
                <summary>{{ es ? 'Qué incluye' : 'What is included' }}</summary>
                <p>{{ description(item) }}</p>
              </details>
            </div>
          </div>
        </div>

        <div v-for="group in serviceGroups" :key="group.id" class="estimate-package estimate-category" :class="{ 'is-selected': groupSelected(group.id).length }">
          <div class="estimate-package-heading">
            <label class="estimate-package-select">
              <input type="checkbox" :checked="groupAllSelected(group.id)" :indeterminate.prop="groupPartiallySelected(group.id)" @change="toggleGroup(group.id, $event.target.checked)">
              <span><strong>{{ title(group) }}</strong><span class="estimate-caption">{{ groupCaption(group.id) }}</span></span>
            </label>
            <span v-if="showPrices && groupSelected(group.id).length" class="estimate-package-price estimate-category-price"><strong v-if="groupEstimate(group.id).initial">{{ moneyRange(groupEstimate(group.id).initial, groupEstimate(group.id).initialUpper) }}</strong><span v-if="groupEstimate(group.id).monthly">{{ moneyRange(groupEstimate(group.id).monthly, groupEstimate(group.id).monthlyUpper) }}/{{ es ? 'mes' : 'month' }}</span></span>
            <button type="button" class="estimate-expand" :aria-expanded="!!expandedGroups[group.id]" :aria-controls="'service-group-' + group.id" :aria-label="(es ? 'Ver o editar: ' : 'View or edit: ') + title(group)" @click="expandedGroups[group.id] = !expandedGroups[group.id]">
              <svg :class="{ 'is-open': expandedGroups[group.id] }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
          </div>
          <div v-show="expandedGroups[group.id]" :id="'service-group-' + group.id" class="estimate-options estimate-category-options">
          <div v-for="item in pricedExtras.filter(service => service.group === group.id)" :key="item.id" class="estimate-service-item" :class="{ 'is-selected': selected.includes(item.id) }">
            <label class="estimate-option" :class="{ 'is-selected': selected.includes(item.id) }">
              <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleExtra(item, $event.target.checked)">
              <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><em v-if="showPrices" class="estimate-service-fee">{{ itemFees(item) }}</em></span>
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
              <label class="estimate-field">{{ es ? '¿Dónde consultás hoy los precios y las cantidades?'  : 'Where do you check your prices and available quantities?' }}<input v-model="details.suppliers" maxlength="300" :placeholder="es ? 'Ej.: dos proveedores, sus webs o listas de precios' : 'E.g. two suppliers, their websites or price lists'"></label>
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


          </div>
          <div v-if="goal === 'launch'" class="guided-panel">
            <p class="guided-kicker">{{ es ? 'PUESTA EN MARCHA' : 'STORE SETUP' }}</p>
            <h3>{{ es ? 'Tu tienda preparada para empezar' : 'Your store prepared to get started' }}</h3>
            <div v-if="showPrices" class="guided-launch-price">
              <strong>{{ amount ? onceLabel : (es ? 'Elegí las tareas que necesitás' : 'Choose the tasks you need') }}</strong>
              <span>{{ es ? 'Estimado por mi trabajo inicial · VendoAlgo se paga aparte' : 'Estimated initial service fee · VendoAlgo is separate' }}</span>
            </div>
            <p>{{ es ? 'Preparo tu tienda en VendoAlgo y te enseño a usarla:' : 'I prepare your VendoAlgo store and show you how to use it:' }}</p>
            <ul class="guided-benefits">
              <li>{{ es ? 'Diseño con tu logo, colores y textos.' : 'Design using your logo, colors and content.' }}</li>
              <li>{{ es ? 'Hasta 40 productos, con los datos y fotos que me pases.' : 'Upload of up to 40 products using the data and photos you provide.' }}</li>
              <li>{{ es ? 'Pagos, envíos y retiro configurados.' : 'Payment, delivery and pickup options.' }}</li>
              <li>{{ es ? 'Una hora de capacitación para manejar tu tienda.' : 'One hour to learn everyday tasks.' }}</li>
            </ul>
            <details class="guided-disclosure">
              <summary>{{ es ? 'Ver o ajustar las tareas incluidas' : 'View or adjust included tasks' }}</summary>
              <label v-for="item in options" :key="item.id" class="guided-option">
                <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleBasic(item, $event.target.checked)">
                <span><strong>{{ title(item) }}</strong><small>{{ description(item) }}</small><em v-if="showPrices">{{ basicFees(item) }} · {{ es ? 'una sola vez' : 'one-time' }}</em></span>
              </label>
            </details>
          </div>

          <div v-if="goal === 'help'" class="guided-panel">
            <h3>{{ es ? '¿Con qué necesitás ayuda?' : 'What do you need help with?' }}</h3>
            <div class="help-choice-list">
              <button v-for="item in helpOptions" :key="item.id" type="button" :class="{ 'is-chosen': helpKind === item.id }" :aria-pressed="helpKind === item.id" @click="chooseHelp(item.id)">{{ title(item) }}<span aria-hidden="true">›</span></button>
            </div>
          </div>

          <div v-if="goal === 'updates' || (goal === 'help' && helpKind)" class="guided-panel">
            <h3>{{ goal === 'updates' ? (es ? '¿Qué querés mantener al día?' : 'What would you like to keep up to date?') : (es ? 'Estas opciones pueden ayudarte' : 'These options may help') }}</h3>
            <p v-if="goal === 'updates'">{{ es ? 'Marcá solo lo que necesitás. Acordamos de dónde tomar la información y cuándo hacer los cambios.' : 'Choose only what you need. We agree where the information comes from and when updates happen.' }}</p>
            <div v-for="item in relevantServices" :key="item.id" class="guided-service-item">
              <label class="guided-option">
                <input type="checkbox" :checked="selected.includes(item.id)" @change="toggleExtra(item, $event.target.checked)">
                <span><strong>{{ choiceTitle(item) }}</strong><em v-if="showPrices">{{ itemFees(item) }}</em></span>
              </label>
              <details class="guided-item-details"><summary>{{ es ? 'Qué incluye' : 'What is included' }}</summary><p>{{ description(item) }}</p><p>{{ itemScope(item) }}</p></details>
            </div>
          </div>



          <details v-if="goal !== 'custom'" id="guided-custom-services" ref="customServicesDetails" class="guided-custom">
            <summary>{{ es ? 'Elegir otros servicios' : 'Choose other services' }}</summary>
            <p class="guided-muted">{{ es ? 'Podés agregar o quitar tareas. Si no sabés qué elegir, lo vemos juntos.' : 'Add or remove tasks. If you are unsure, we can choose together.' }}</p>
            <div class="guided-bulk"><span>{{ selected.length }} {{ es ? 'elegidos' : 'selected' }}</span><button type="button" @click="selectAllServices" :disabled="allServicesSelected">{{ es ? 'Seleccionar todo' : 'Select all' }}</button><button type="button" @click="clearServices" :disabled="!hasSelection && !modules.length">{{ es ? 'Quitar todo' : 'Clear all' }}</button></div>
            <details class="guided-category" :open="expanded" @toggle="expanded = $event.target.open">
              <summary>{{ es ? 'Crear mi tienda' : 'Create my store' }}<span>{{ checkedBasics.length }}/5</span></summary>
              <label class="guided-all"><input type="checkbox" :checked="allBasics" :indeterminate.prop="partialBasics" @change="toggleBasics">{{ es ? 'Elegir las cinco tareas' : 'Choose all five tasks' }}</label>
              <label v-for="item in options" :key="item.id" class="guided-option"><input type="checkbox" :checked="selected.includes(item.id)" @change="toggleBasic(item, $event.target.checked)"><span><strong>{{ title(item) }}</strong><em v-if="showPrices">{{ basicFees(item) }} · {{ es ? 'una sola vez' : 'one-time' }}</em></span></label>
            </details>
            <details v-for="group in serviceGroups" :key="group.id" class="guided-category" :data-service-group="group.id" :open="openCustomGroups.includes(group.id)" @toggle="setCustomGroupOpen(group.id, $event)">
              <summary>{{ title(group) }}<span>{{ groupSelected(group.id).length }}/{{ groupOptions(group.id).length }}</span></summary>
              <label class="guided-all"><input type="checkbox" :checked="groupAllSelected(group.id)" :indeterminate.prop="groupPartiallySelected(group.id)" @change="toggleGroup(group.id, $event.target.checked)">{{ es ? 'Elegir todo este grupo' : 'Choose this whole group' }}</label>
              <div v-for="item in groupOptions(group.id)" :key="item.id" class="guided-service-item">
                <label class="guided-option"><input type="checkbox" :checked="selected.includes(item.id)" @change="toggleExtra(item, $event.target.checked)"><span><strong>{{ title(item) }}</strong><em v-if="showPrices">{{ itemFees(item) }}</em></span></label>
                <details class="guided-item-details"><summary>{{ es ? 'Qué incluye' : 'What is included' }}</summary><p>{{ description(item) }}</p><p>{{ itemScope(item) }}</p></details>
              </div>
            </details>
          </details>

          <fieldset v-if="goal !== 'custom' && selected.includes('hiring')" class="guided-staff">
            <legend>{{ es ? '¿A quién necesitás? (opcional)' : 'Who do you need? (optional)' }}</legend>
            <label v-for="role in staffRoles" :key="role.id"><input v-model="details.roles" type="checkbox" :value="role.id">{{ title(role) }}</label>
          </fieldset>
          <p class="guided-help">{{ es ? 'También podés dejar que te oriente.' : 'You can also ask me for guidance.' }} <a :href="guidanceUrl" target="_blank" rel="noopener noreferrer">{{ es ? 'Hablar con Pedro' : 'Talk to Pedro' }} ↗</a></p>
        </div>

        <aside class="guided-summary" aria-labelledby="guided-summary-title">
          <p class="eyebrow">{{ es ? '2. PEDÍ UN PRESUPUESTO' : '2. REQUEST A QUOTE' }}</p>
          <h3 id="guided-summary-title">{{ es ? (showPrices && hasSelection ? 'Tu estimado' : 'Consultá por tu selección') : (showPrices && hasSelection ? 'Your estimate' : 'Ask about your selection') }}</h3>
          <template v-if="hasSelection">
            <p class="guided-summary-count">{{ selected.length }} {{ es ? 'tareas elegidas' : 'tasks selected' }}</p>
            <div v-if="showPrices" class="guided-costs" role="status" aria-live="polite" aria-atomic="true">
              <div><span>{{ es ? 'Mi trabajo · al empezar' : 'My work · initially' }}</span><strong>{{ amount ? onceLabel : (es ? 'Sin pago inicial' : 'No initial fee') }}</strong></div>
              <div><span>{{ es ? 'Mi trabajo · cada mes' : 'My work · monthly' }}</span><strong>{{ monthlyAmount ? monthlyLabel : (es ? 'Sin pago mensual' : 'No monthly fee') }}</strong></div>
              <div class="guided-platform-cost"><span>{{ es ? 'VendoAlgo · cada mes, aparte' : 'VendoAlgo · monthly, separate' }}</span><strong>{{ platformPending ? (es ? 'Pendiente de definir' : 'To be confirmed') : money(platformCost) }}</strong></div>
              <p v-if="platformPending" class="guided-pending">{{ es ? 'El estimado todavía no incluye el costo de VendoAlgo. Lo confirmo con vos antes de empezar.' : 'VendoAlgo is not yet included in the estimate. I confirm this cost with you before starting.' }}</p>
              <div v-else class="guided-monthly-total"><span>{{ es ? 'Total mensual estimado' : 'Estimated monthly total' }}</span><strong>{{ moneyRange(monthlyTotalLower, monthlyTotalUpper) }}</strong></div>
            </div>
            <details class="guided-summary-details">
              <summary>{{ es ? 'Ver las tareas que elegí' : 'View my selected tasks' }}</summary>
              <div class="guided-summary-scroll" tabindex="0" role="region" :aria-label="es ? 'Listado de tareas elegidas' : 'Selected task list'">
                <ul><li v-for="item in checkedBasics" :key="item.id"><span>{{ title(item) }}</span><small v-if="showPrices">{{ basicFees(item) }}</small></li><li v-for="item in checkedExtras" :key="item.id"><span>{{ title(item) }}</span><small v-if="showPrices">{{ itemFees(item) }}</small></li></ul>
                <p v-if="showPrices && sharedInitialSaving" class="guided-muted">{{ es ? 'Preparación compartida descontada: ' : 'Shared setup discount: ' }}{{ moneyRange(sharedInitialSaving, sharedInitialSavingUpper) }}</p>
                <p v-if="showPrices && sharedMonthlySaving" class="guided-muted">{{ es ? 'Cuidado mensual compartido descontado: ' : 'Shared monthly care discount: ' }}{{ moneyRange(sharedMonthlySaving, sharedMonthlySavingUpper) }}/{{ es ? 'mes' : 'month' }}</p>
              </div>
            </details>
          </template>
          <p v-else class="guided-muted">{{ es ? 'Podés elegir una tarea o contarme qué te pasa. No hace falta que sepas cómo resolverlo.' : 'Choose a task or tell me what is happening. You do not need to know how to solve it.' }}</p>

          <p v-if="showPrices && hasSelection" class="guided-range-note">{{ es ? 'Rangos en pesos argentinos. El precio cambia con los productos, proveedores y trabajo necesario. Recibís un presupuesto antes de contratar.' : 'Ranges in Argentine pesos. Pricing varies with products, suppliers and work needed. You receive a quote before hiring.' }}</p>
          <button v-if="showPrices && hasSelection" type="button" class="guided-payment-link" @click="showPaymentTerms">{{ es ? 'Podés pagar el trabajo inicial en cuotas · ver condiciones' : 'Pay initial fees in installments · see terms' }}</button>
          <p v-if="showPrices && hasSelection" class="guided-contact-note">{{ es ? 'Cuotas acordadas en USD, pagaderas en pesos al cambio pactado. El importe en pesos puede variar.' : 'Installments agreed in USD, payable in pesos at the agreed rate. Peso amounts may vary.' }}</p>
          <details v-if="showPrices && hasSelection" class="guided-price-details">
            <summary>{{ es ? 'Qué incluye el precio y qué se paga aparte' : 'What is included and what costs extra' }}</summary>
            <p>{{ es ? 'Los valores más bajos corresponden al trabajo base de cada tarea. Más productos, proveedores o condiciones especiales pueden aumentar el presupuesto. Si tu caso supera lo previsto, te lo aclaro antes de comenzar.' : 'Lower figures apply to each task’s base scope. Extra products, suppliers or special conditions may increase the quote. Work outside those scopes is confirmed before starting.' }}</p>
            <p v-if="automationCount">{{ es ? 'Las tareas automáticas se estiman para un proveedor, hasta 100 productos y una actualización diaria. Las tareas que usan el mismo proveedor comparten parte de la preparación y revisión: esa parte se descuenta. El abono incluye una revisión mensual y hasta una hora de ajustes menores. Una ampliación o un cambio que requiera rehacer una parte importante se presupuesta antes. No cobro un extra por el solo hecho de cambiar una herramienta por decisión mía.' : 'Automations assume one supplier, up to 100 products and one daily update. Tasks using the same supplier share discounted setup and review. The fee includes a monthly review and up to one hour of minor adjustments. Extensions or substantial rework are quoted beforehand. Tool changes I choose do not themselves create extra fees.' }}</p>
            <p>{{ es ? 'VendoAlgo es donde funciona tu tienda. Su plan y las funciones extra se pagan aparte de mi trabajo. Las comisiones de cobro, la dirección web propia y otros servicios que hagan falta también van aparte.' : 'VendoAlgo is where your store runs. Its plan and extra features are paid separately from my work. Payment fees, your domain and other required services are also separate.' }}</p>
            <label class="guided-field">{{ es ? 'Si ya conocés tu plan de VendoAlgo' : 'If you already know your VendoAlgo plan' }}<select :value="effectivePlatform" :disabled="proRequired || catalogSize === 'over50'" @change="platform = $event.target.value"><option value="unsure">{{ es ? 'Lo definimos juntos' : 'We will choose together' }}</option><option value="free">{{ es ? 'Gratis · hasta 50 productos activos' : 'Free · up to 50 active products' }}</option><option value="pro">Pro · {{ money(storePlatformPricing.plans.pro.monthly) }}/{{ es ? 'mes' : 'month' }}</option></select></label>
            <p v-if="proRequired">{{ es ? 'Las tareas elegidas necesitan el plan Pro. Si elegiste actualizaciones automáticas, también necesitan Conexión IA. Las funciones necesarias ya están sumadas al costo de VendoAlgo.' : 'Selected tasks require Pro. Automatic updates also need the AI Connection module. Required features are included in the VendoAlgo cost.' }}</p>
            <details class="guided-platform-extras"><summary>{{ es ? 'Ver las funciones extra de VendoAlgo' : 'See extra VendoAlgo features' }}</summary>
              <label v-for="item in storePlatformPricing.modules" :key="item.id" class="guided-platform-option"><input type="checkbox" :checked="selectedModules.some(module => module.id === item.id)" :disabled="requiredModuleIds.includes(item.id)" @change="toggleModule(item.id, $event.target.checked)"><span>{{ platformFeatureName(item) }}</span><small>{{ money(item.monthly) }}/{{ es ? 'mes' : 'month' }}</small></label>
            </details>
            <a :href="storePlatformPricing.sourceUrl" target="_blank" rel="noopener noreferrer">{{ es ? 'Ver precios oficiales de VendoAlgo' : 'See official VendoAlgo prices' }} ↗</a>
          </details>

          <p class="guided-handoff">{{ es ? 'Te confirmo las tareas, el precio y los plazos por escrito antes de empezar.' : 'I confirm the work, price and schedule in writing before starting.' }}</p>
          <form class="guided-contact" @submit.prevent="contact">
            <label class="guided-field">{{ es ? 'Tu nombre' : 'Your name' }}<input v-model="inquiry.name" autocomplete="name" required maxlength="100"></label>
            <label class="guided-field">{{ es ? 'Contame sobre tu negocio (opcional)' : 'Tell me about your business (optional)' }}<textarea v-model="inquiry.message" rows="3" maxlength="1200" :placeholder="es ? 'Qué vendés y qué te gustaría resolver' : 'What you sell and what you want to resolve'"></textarea></label>
            <button type="submit" value="whatsapp" class="button button-primary">{{ es ? 'Consultar por WhatsApp' : 'Ask on WhatsApp' }} ↗</button>
            <button type="submit" value="email" class="guided-email-button">{{ es ? 'Prefiero consultar por correo' : 'I prefer email' }} ↗</button>
            <p class="guided-contact-note">{{ es ? 'Se abre tu app con el mensaje preparado para que lo revises y lo envíes.' : 'Your app opens with a prepared message for you to review and send.' }}</p>
          </form>
          <p class="guided-invoice">{{ es ? 'Hablás conmigo, Pedro. Emito factura por mi trabajo.' : 'You speak directly with me, Pedro. I issue invoices for my work.' }}</p>
        </aside>
      </div>
    </section>
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

.without-prices .estimate-package-heading { grid-template-columns: minmax(0, 1fr) 44px; }
.without-prices .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
.estimate-package-price { white-space: normal; max-width: 180px; line-height: 1.5; }
.estimate-option-price { white-space: normal; text-align: right; }
.estimate-summary .estimate-totals strong { max-width: 205px; line-height: 1.5; }
@media (max-width: 500px) { .estimate-package-price { max-width: none; } }

/* Visible grouped choices are the primary service selection. */
.estimate-choices { display: grid; gap: 12px; }
.estimate-package-heading { min-height: 88px; padding: 16px; }
.estimate-package-select { min-height: 44px; }
.estimate-category-price { max-width: 180px; font-size: .9rem; }
.estimate-caption { font-size: .85rem; line-height: 1.5; }
.estimate-note { font-size: .88rem; line-height: 1.7; }
.estimate-option-copy > span { font-size: .9rem; }
.estimate-category-options .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
.service-estimator input[type="radio"] { appearance: auto; width: 20px; height: 20px; flex: 0 0 20px; padding: 0; }
@media(max-width: 500px) {
  .estimate-package-heading { padding: 12px; }
  .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
  .estimate-option-price { grid-column: 2; text-align: left; }
}



.guided-service { color: var(--ink); }
.guided-intro { max-width: 43rem; margin-bottom: 2rem; }
.guided-intro h2, .guided-current h2 { margin: .5rem 0 1rem; font-size: clamp(1.7rem, 3.4vw, 2.65rem); line-height: 1.13; letter-spacing: -.04em; }
.guided-intro p:last-child { color: var(--muted); font-size: 1.05rem; line-height: 1.7; }
.business-questionnaire { max-width: 52rem; padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--line); border-radius: .7rem; background: var(--surface); }
.questionnaire-progress { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem; color: var(--muted); font-size: .85rem; }
.questionnaire-progress button { min-height: 40px; padding: .45rem 0; border: 0; background: transparent; color: var(--ink); font: inherit; text-decoration: underline; text-underline-offset: .2rem; cursor: pointer; }
.business-questionnaire h3 { max-width: 38rem; margin: 0 0 1.1rem; font-size: clamp(1.2rem, 2.5vw, 1.5rem); line-height: 1.35; letter-spacing: -.025em; }
.questionnaire-options { display: grid; gap: .65rem; }
.questionnaire-options button { display: flex; justify-content: space-between; align-items: center; gap: 1rem; width: 100%; min-height: 52px; padding: .85rem 1rem; border: 1px solid var(--line); border-radius: .5rem; background: var(--surface); color: var(--ink); text-align: left; font: inherit; line-height: 1.5; cursor: pointer; transition: border-color .15s, background-color .15s; }
.questionnaire-options button::after { content: '→'; flex: 0 0 auto; color: var(--muted); }
.questionnaire-options button:hover, .questionnaire-options button.is-selected { border-color: #718c38; background: var(--soft); }
.questionnaire-options button:focus-visible, .questionnaire-progress button:focus-visible { outline: 3px solid #749b2e; outline-offset: 3px; }
.questionnaire-options button:focus-visible { outline-offset: 2px; }
.goal-list { display: grid; gap: .85rem; max-width: 52rem; }
.goal-choice { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; width: 100%; padding: 1.5rem; border: 1px solid var(--line); background: var(--surface); color: var(--ink); text-align: left; border-radius: .65rem; cursor: pointer; transition: border-color .15s, background .15s; }
.goal-choice:hover { border-color: var(--ink); background: var(--soft); }
.goal-choice svg { flex-shrink: 0; }
.goal-copy { display: grid; gap: .5rem; }
.goal-copy strong { font-size: 1.1rem; line-height: 1.4; }
.goal-copy > span { color: var(--muted); line-height: 1.6; }
.goal-copy small { font-size: .9rem; font-weight: 600; }
.guided-help { margin: 1.5rem 0 0; color: var(--muted); font-size: .95rem; line-height: 1.8; }
.guided-help a { color: var(--ink); font-weight: 650; text-underline-offset: .2rem; }
.guided-workspace, #service-scope-title, #guided-custom-services { scroll-margin-top: 7rem; }
.guided-workspace:focus, #service-scope-title:focus { outline: none; }
.guided-current { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.75rem; }
.guided-current h2 { max-width: 40rem; margin-bottom: 0; }
.guided-draft-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .25rem 1rem; }
.guided-save-note { margin: 0 0 1.75rem; color: var(--muted); font-size: .82rem; line-height: 1.6; }
.questionnaire-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: .9rem; }
.guided-draft-actions { align-items: center; }
.guided-reset, .questionnaire-progress .guided-reset { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 44px; padding: .65rem .85rem; border: 1px solid var(--ink); border-radius: .45rem; background: var(--soft); color: var(--ink); font: inherit; font-size: .875rem; font-weight: 600; line-height: 1.25; text-decoration: none; cursor: pointer; white-space: nowrap; }
.guided-reset svg { flex: 0 0 auto; }
.guided-reset:hover:not(:disabled) { background: var(--surface); }
.guided-reset:focus-visible { outline: 3px solid #749b2e; outline-offset: 3px; }
.guided-reset:disabled { opacity: .45; cursor: default; border-color: var(--line); }
@media (max-width: 600px) {
  .questionnaire-progress { flex-wrap: wrap; gap: .5rem; }
  .questionnaire-actions { width: 100%; justify-content: space-between; }
}
@media (max-width: 700px) { .guided-draft-actions { justify-content: flex-start; } }
.guided-recommendation { max-width: 63%; margin: -.75rem 0 1.5rem; padding: .9rem 1.1rem; border-left: 3px solid #718c38; background: var(--soft); border-radius: .35rem; }
.guided-recommendation h3 { margin: 0 0 .35rem; font-size: 1rem; }
.guided-recommendation p { margin: 0; color: var(--muted); font-size: .92rem; line-height: 1.6; }
.guided-text-button { flex-shrink: 0; padding: .7rem 0; background: transparent; border: 0; color: var(--ink); font-size: .9rem; text-decoration: underline; text-underline-offset: .25rem; cursor: pointer; }
.guided-layout { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(21rem, .85fr); gap: clamp(1.25rem, 2.5vw, 2rem); align-items: start; }
.guided-main { min-width: 0; display: grid; gap: 1.25rem; }
.guided-panel { padding: 1.65rem; border: 1px solid var(--line); border-radius: .65rem; background: var(--surface); }
.guided-panel h3, .guided-summary h3 { margin: 0 0 .85rem; font-size: 1.35rem; line-height: 1.3; letter-spacing: -.025em; }
.guided-panel > p:not(.guided-kicker) { color: var(--muted); line-height: 1.7; margin: 0 0 1rem; }
.guided-kicker { font-size: .75rem; font-weight: 700; letter-spacing: .1em; color: var(--muted); margin: 0 0 .8rem; }
.guided-benefits { padding-left: 1.2rem; margin: 1.25rem 0; line-height: 1.7; }
.guided-benefits li + li { margin-top: .5rem; }
.guided-service details { border-radius: 0; box-shadow: none; }
.guided-service summary { cursor: pointer; line-height: 1.5; font-size: .95rem; font-weight: 600; padding: .85rem 0; }
.guided-service details > summary::marker { color: var(--muted); }
.guided-disclosure, .guided-summary-details, .guided-price-details { padding: 0; border: 0; border-top: 1px solid var(--line); background: transparent; }
.guided-option { display: flex; align-items: flex-start; gap: .85rem; padding: 1rem 0; cursor: pointer; line-height: 1.5; }
.guided-option input, .guided-all input, .guided-staff input, .guided-platform-option input { width: 1.15rem; height: 1.15rem; flex-shrink: 0; margin: .15rem 0 0; accent-color: #27565b; }
.guided-option > span { display: grid; gap: .4rem; min-width: 0; }
.guided-option strong { font-size: 1rem; font-weight: 650; }
.guided-option small, .guided-option em { font-size: .9rem; color: var(--muted); font-style: normal; line-height: 1.6; }
.guided-option em { color: var(--ink); }
.help-choice-list { display: grid; gap: .5rem; }
.help-choice-list button { display: flex; gap: 1rem; justify-content: space-between; align-items: center; padding: .9rem 1rem; min-height: 3rem; border: 1px solid var(--line); border-radius: .35rem; background: transparent; color: var(--ink); text-align: left; font-size: .95rem; line-height: 1.5; cursor: pointer; }
.help-choice-list button.is-chosen { border-color: var(--ink); background: var(--soft); font-weight: 650; }
.guided-service-item + .guided-service-item { border-top: 1px solid var(--line); }
.guided-item-details { padding: 0 0 .8rem 2rem; border: 0; background: transparent; }
.guided-item-details summary { font-weight: 400; font-size: .85rem; padding: 0; color: var(--muted); }
.guided-item-details p { font-size: .9rem; color: var(--muted); line-height: 1.7; margin: .6rem 0 0; }
.guided-staff { border: 0; margin: 0; padding: 0; min-width: 0; }
.guided-staff legend { padding: 0; font-weight: 600; font-size: .95rem; line-height: 1.6; margin-bottom: .85rem; }
.guided-field { display: grid; gap: .5rem; font-size: .9rem; font-weight: 600; line-height: 1.6; }
.guided-field input, .guided-field textarea, .guided-field select { box-sizing: border-box; width: 100%; min-width: 0; padding: .8rem .9rem; border: 1px solid var(--line); border-radius: .3rem; background: var(--surface); color: var(--ink); font: inherit; font-weight: 400; line-height: 1.5; }
.guided-field textarea { resize: vertical; }
.guided-field input::placeholder, .guided-field textarea::placeholder { color: var(--muted); opacity: 1; }
.guided-custom { padding: .2rem 1.3rem; border: 1px solid var(--line); border-radius: .65rem !important; background: transparent; }
.guided-muted { color: var(--muted); font-size: .9rem; line-height: 1.7; }
.guided-bulk { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1rem; padding: .6rem 0 1rem; font-size: .85rem; }
.guided-bulk > span { margin-right: auto; color: var(--muted); }
.guided-bulk button { padding: .65rem 0; border: 0; background: transparent; color: var(--ink); text-decoration: underline; text-underline-offset: .2rem; cursor: pointer; }
.guided-bulk button:disabled { opacity: .45; cursor: default; }
.guided-category { padding: 0; border: 0; border-top: 1px solid var(--line); background: transparent; }
.guided-category > summary span { float: right; color: var(--muted); margin-left: .6rem; font-size: .85rem; font-weight: 400; }
.guided-all { display: flex; align-items: center; gap: .85rem; padding: .75rem 0; font-size: .9rem; cursor: pointer; }
.guided-staff { padding: 1rem 0; }
.guided-staff label { display: flex; align-items: flex-start; gap: .8rem; padding: .7rem 0; font-size: .95rem; }
.guided-summary { padding: 1.65rem; border: 1px solid var(--line); border-radius: .65rem; background: var(--soft); min-width: 0; }
.guided-summary .eyebrow { font-size: .7rem; margin: 0 0 .85rem; }
.guided-summary-count { color: var(--muted); font-size: .9rem; margin: .5rem 0 1.25rem; }
.guided-costs { display: grid; gap: 1rem; margin-bottom: 1.25rem; }
.guided-costs > div { display: grid; gap: .35rem; }
.guided-costs span { font-size: .9rem; line-height: 1.5; color: var(--muted); }
.guided-costs strong { font-size: 1.15rem; line-height: 1.5; overflow-wrap: anywhere; }
.guided-platform-cost { padding-top: 1rem; border-top: 1px solid var(--line); }
.guided-pending { font-size: .85rem; line-height: 1.6; margin: -.35rem 0 0; color: var(--muted); }
.guided-monthly-total { border-top: 1px solid var(--line); padding-top: 1rem; }
.guided-summary-scroll { max-height: 18rem; overflow-y: auto; overscroll-behavior: contain; }
.guided-summary-scroll ul { list-style: none; padding: 0; margin: 0; }
.guided-summary-scroll li { display: grid; gap: .25rem; padding: .65rem 0; font-size: .9rem; line-height: 1.6; }
.guided-summary-scroll small { color: var(--muted); }
.guided-range-note { font-size: .85rem; line-height: 1.7; color: var(--muted); }
.guided-price-details p { color: var(--muted); font-size: .9rem; line-height: 1.7; }
.guided-price-details > a { display: inline-block; padding: .75rem 0; font-size: .9rem; color: var(--ink); }
.guided-platform-extras { border: 0; padding: .5rem 0; background: transparent; }
.guided-platform-option { display: flex; align-items: flex-start; gap: .65rem; font-size: .85rem; padding: .7rem 0; line-height: 1.5; }
.guided-platform-option span { flex: 1; }
.guided-platform-option small { font-size: .8rem; white-space: nowrap; }
.guided-handoff { margin-top: 1.25rem; }
.guided-handoff > strong { font-size: 1rem; }
.guided-handoff p { margin: .6rem 0 1.25rem; color: var(--muted); font-size: .9rem; line-height: 1.7; }
.guided-contact { display: grid; gap: 1rem; }
.guided-contact .button { width: 100%; white-space: normal; text-align: center; min-height: 3rem; line-height: 1.5; }
.guided-email-button { border: 0; padding: .5rem; min-height: 2.75rem; background: transparent; color: var(--ink); text-decoration: underline; text-underline-offset: .2rem; cursor: pointer; font-size: .9rem; }
.guided-contact-note, .guided-invoice { color: var(--muted); font-size: .8rem; line-height: 1.7; margin: 0; }
.guided-invoice { border-top: 1px solid var(--line); margin-top: 1.25rem; padding-top: 1rem; }
.guided-service button:focus-visible, .guided-service a:focus-visible, .guided-service summary:focus-visible, .guided-service input:focus-visible, .guided-service textarea:focus-visible, .guided-service select:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
@media(max-width: 1100px) {
  .guided-recommendation { max-width: 100%; }
  .guided-layout { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
  .guided-summary { max-width: none; }
}
@media(max-width: 600px) {
  .business-questionnaire { padding: 1rem; }
  .guided-current { display: grid; gap: .5rem; }
  .guided-current h2 { font-size: 1.85rem; }
  .guided-text-button { justify-self: start; min-height: 2.75rem; }
  .goal-choice { padding: 1.15rem; gap: 1rem; }
  .goal-copy strong { font-size: 1rem; }
  .goal-copy > span { font-size: .9rem; }
  .guided-panel, .guided-summary { padding: 1.2rem; }
  .guided-custom { padding: .15rem 1rem; }
  .guided-platform-option { flex-wrap: wrap; }
  .guided-platform-option small { margin-left: 1.8rem; }
}
@media(prefers-reduced-motion: reduce) { .goal-choice { transition: none; } }

/* Keep native choice controls independent of the site's full-width text inputs. */
.guided-service input[type="checkbox"] { appearance: auto; padding: 0; border-radius: .15rem; }
.guided-launch-price { display: grid; gap: .4rem; padding: 0 0 1.2rem; margin-bottom: 1.2rem; border-bottom: 1px solid var(--line); }
.guided-launch-price strong { font-size: clamp(1.45rem, 3vw, 2rem); line-height: 1.25; letter-spacing: -.035em; }
.guided-launch-price span { font-size: .85rem; line-height: 1.6; color: var(--muted); }
.guided-panel .guided-benefits { display: grid; gap: .55rem; list-style: none; padding: 0; margin: 1.1rem 0; }
.guided-benefits li { position: relative; padding-left: 1.45rem; line-height: 1.55; }
.guided-benefits li::before { content: '✓'; position: absolute; left: 0; color: var(--muted); font-weight: 700; }
.guided-benefits li + li { margin-top: 0; }
@media(max-width: 1100px) {
  .guided-recommendation { max-width: 100%; }
  .guided-main { display: contents; }
  .guided-panel { order: 1; }
  .guided-summary { order: 3; }
  .guided-custom { order: 4; }
  .guided-staff { order: 5; }
  .guided-layout > .guided-help, .guided-main > .guided-help { order: 6; }
  .guided-layout { gap: 1.25rem; }
}
@media(max-width: 420px) {
}


.guided-custom-catalog { display: grid; gap: 12px; }
.guided-custom-catalog .estimate-package-heading { min-height: 80px; }
@media(max-width:1100px) { .guided-custom-catalog { order: 1; } }
.guided-payment-link { display: block; border: 0; background: transparent; padding: .65rem 0; margin: .5rem 0; color: var(--ink); text-align: left; text-decoration: underline; text-underline-offset: .2rem; font-size: .9rem; line-height: 1.6; cursor: pointer; }

/* Keep services readable as cards, with one aligned column for the inquiry. */
.guided-recommendation { max-width: none; }
.guided-layout > .guided-catalog-toolbar { grid-column: 1 / -1; margin: 0; padding: 0; min-height: 44px; }
.guided-custom-catalog { gap: 1rem; }
.guided-custom-catalog .estimate-category { margin-top: 0; }
.guided-custom-catalog .estimate-package-heading { min-height: 80px; padding: 1rem; }
.guided-custom-catalog .estimate-package-select > span { min-width: 0; }
.guided-custom-catalog .estimate-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: stretch; gap: .75rem; padding: 1rem; border-top: 1px solid var(--line); }
.guided-custom-catalog .estimate-option { grid-template-columns: 20px minmax(0, 1fr); gap: .75rem; min-width: 0; }
.guided-custom-catalog .estimate-service-item { margin: 0; padding: 0; border: 1px solid var(--line); border-radius: .55rem; background: var(--surface); min-width: 0; transition: border-color .15s, background-color .15s; }
.guided-custom-catalog .estimate-service-item.is-selected { border-color: #879b3d; background: var(--soft); }
.guided-custom-catalog .estimate-service-item:hover { border-color: var(--ink); }
.guided-custom-catalog #launch-service-options > .estimate-launch-item:last-child:nth-child(odd) { grid-column: 1 / -1; }
.guided-custom-catalog .estimate-option-copy strong { font-size: .96rem; line-height: 1.45; }
.guided-custom-catalog .estimate-option-copy > span { font-size: .86rem; line-height: 1.65; }
.guided-custom-catalog .estimate-option-price { grid-column: 2; text-align: left; font-size: .88rem; }
.guided-custom-catalog .estimate-service-item .estimate-option { padding: 1rem 1rem .5rem; border: 0; }
.guided-custom-catalog .estimate-item-details { padding: 0 1rem 1rem 3rem; }
.guided-custom-catalog .estimate-item-details summary { min-height: 32px; padding: .25rem 0; font-size: .83rem; }
.guided-custom-catalog .estimate-item-details p { font-size: .86rem; overflow-wrap: anywhere; }
.guided-custom-catalog .estimate-context-disclosure { grid-column: 1 / -1; margin: .25rem 0 0; padding: .75rem 0 0; border-top: 1px solid var(--line); }
.guided-custom-catalog .estimate-context-disclosure > summary { padding: .5rem 0; font-size: .86rem; }
.guided-custom-catalog .estimate-field { min-width: 0; }
@media (min-width: 1101px) {
  .guided-layout { grid-template-columns: minmax(0, 1fr) minmax(19rem, 21rem); gap: 1.5rem; }
  .guided-summary { padding: 1.5rem; }
}
@media (max-width: 600px) {
  .guided-custom-catalog .estimate-options { grid-template-columns: minmax(0, 1fr); gap: .65rem; padding: .75rem; }
  .guided-custom-catalog .estimate-package-heading { padding: .75rem; }
  .guided-layout > .guided-catalog-toolbar { gap: .25rem .8rem; }
}
@media (prefers-reduced-motion: reduce) {
  .guided-custom-catalog .estimate-option, .guided-custom-catalog .estimate-service-item { transition: none; }
}


/* Explain the outcome before asking questions; keep detail available on demand. */
.guided-start { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.guided-entry { display: flex; flex-direction: column; align-items: flex-start; gap: .75rem; min-width: 0; padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--line); border-radius: .75rem; background: var(--surface); }
.guided-entry-primary { border-color: #879b3d; background: var(--soft); }
.guided-start .guided-entry h3 { margin: 0; font-size: 1.2rem; line-height: 1.35; }
.guided-entry p { max-width: 40ch; margin: 0 0 .5rem; color: var(--muted); font-size: 1rem; line-height: 1.6; }
.guided-entry .button { gap: .75rem; margin-top: auto; max-width: 100%; min-height: 48px; white-space: normal; text-align: left; }
.guided-catalog-button { border: 1px solid var(--ink); background: transparent; color: var(--ink); }
.questionnaire-bar { display: block; appearance: none; width: 100%; height: 5px; margin: 0 0 1.5rem; border: 0; border-radius: 20px; background: var(--line); accent-color: #879b3d; }
.questionnaire-bar::-webkit-progress-bar { border-radius: 20px; background: var(--line); }
.questionnaire-bar::-webkit-progress-value { border-radius: 20px; background: #879b3d; }
.questionnaire-bar::-moz-progress-bar { border-radius: 20px; background: #879b3d; }
.guided-question-shortcut { margin: .25rem 0 0; }
.business-questionnaire .guided-save-note { margin-top: 1rem; margin-bottom: .25rem; }
.business-questionnaire .guided-help { margin-top: .5rem; font-size: .85rem; }
.guided-service p.guided-result-instruction { color: var(--ink); max-width: 65ch; margin: -.25rem 0 1.25rem; font-size: 1rem; line-height: 1.65; }
.guided-service details.guided-recommendation { margin: 0 0 1.5rem; padding: 0; border: 0; border-bottom: 1px solid var(--line); background: transparent; }
.guided-recommendation > summary { padding: .65rem 0; color: var(--muted); font-size: .85rem; font-weight: 500; }
.guided-recommendation > p { max-width: 75ch; padding-bottom: 1rem; font-size: .9rem; }
.guided-catalog-toolbar > strong { font-size: 1rem; }
.guided-summary p.guided-handoff { margin: 1rem 0 1.25rem; color: var(--muted); font-size: .9rem; line-height: 1.6; }
@media (max-width: 650px) {
  .guided-workspace, #service-scope-title, #guided-custom-services { scroll-margin-top: 180px; }
  .guided-start { grid-template-columns: minmax(0, 1fr); }
  .guided-entry .button { width: 100%; justify-content: space-between; }
  .guided-catalog-toolbar > strong { width: 100%; }
}

</style>