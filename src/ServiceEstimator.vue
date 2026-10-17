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
const extras = [
  { id: 'automation', mode: 'both', es: 'Automatizar precios, stock o novedades', en: 'Automate prices, stock or new products', descEs: 'Según tus proveedores, las reglas de tu negocio y la frecuencia que necesites. Implementación y mantenimiento a cotizar.', descEn: 'Based on your suppliers, business rules and required schedule. Implementation and maintenance quoted separately.' },
  { id: 'ml', mode: 'once', es: 'Configurar Mercado Libre', en: 'Set up Mercado Libre', descEs: 'Configuración del módulo que contrates en VendoAlgo. Mis honorarios se cotizan aparte de la suscripción del módulo.', descEn: 'Setup of the VendoAlgo module you subscribe to. My setup fee is quoted separately from the module subscription.' },
  { id: 'arca', mode: 'once', es: 'Configurar facturación ARCA', en: 'Set up ARCA invoicing', descEs: 'Configuración de la facturación automática del módulo de VendoAlgo. Honorarios a cotizar; módulo mensual aparte.', descEn: 'Setup of automatic invoicing through the VendoAlgo module. Setup fee quoted separately; module subscription is separate.' },
  { id: 'maintenance', mode: 'monthly', es: 'Mantenimiento y asistencia', en: 'Maintenance and support', descEs: 'Acordamos qué cambios y atención necesitás cada mes. El alcance y los honorarios se definen antes de comenzar.', descEn: 'We agree on monthly changes and support. Scope and fees are confirmed before starting.' },
  { id: 'team', mode: 'once', es: 'Capacitar al equipo y preparar permisos', en: 'Train the team and set permissions', descEs: 'Capacitación según cada puesto y configuración de roles. El plan Pro permite asignar roles y permisos.', descEn: 'Role-specific training and permission setup. The Pro plan supports staff roles and permissions.' },
  { id: 'hiring', mode: 'once', es: 'Ayuda para conseguir personal', en: 'Help finding staff', descEs: 'Diseñador, operario, vendedor o community manager: búsqueda e incorporación según lo acordado. Sus honorarios o sueldos son aparte.', descEn: 'Designer, operator, salesperson or community manager: search and onboarding as agreed. Their fees or salaries are separate.' },
];
const checkedBasics = computed(() => options.filter(item => selected.value.includes(item.id)));
const checkedExtras = computed(() => extras.filter(item => selected.value.includes(item.id)));
const allBasics = computed(() => checkedBasics.value.length === options.length);
const partialBasics = computed(() => checkedBasics.value.length > 0 && !allBasics.value);
const hasSelection = computed(() => selected.value.length > 0);
const amount = computed(() => checkedBasics.value.reduce((sum, item) => sum + item.price, 0));
const pendingOnce = computed(() => checkedExtras.value.some(item => item.mode !== 'monthly'));
const pendingMonthly = computed(() => checkedExtras.value.some(item => item.mode !== 'once'));
const selectedModules = computed(() => storePlatformPricing.modules.filter(item => modules.value.includes(item.id)));
const proRequired = computed(() => modules.value.length > 0 || selected.value.includes('team'));
const effectivePlatform = computed(() => proRequired.value ? 'pro' : platform.value);
const platformCost = computed(() => effectivePlatform.value === 'unsure' ? null : (effectivePlatform.value === 'pro' ? storePlatformPricing.plans.pro.monthly : 0) + selectedModules.value.reduce((sum, item) => sum + item.monthly, 0));
const money = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
const title = item => es.value ? item.es : item.en;
const description = item => es.value ? item.descEs : item.descEn;
const quote = computed(() => es.value ? 'A cotizar' : 'To be quoted');
const onceLabel = computed(() => amount.value ? money(amount.value) + (pendingOnce.value ? (es.value ? ' + a cotizar' : ' + quote pending') : '') : pendingOnce.value ? quote.value : money(0));
const monthlyLabel = computed(() => pendingMonthly.value ? quote.value : money(0));
function toggleBasics(event) {
  const basicIds = options.map(item => item.id);
  selected.value = event.target.checked ? [...new Set([...selected.value, ...basicIds])] : selected.value.filter(id => !basicIds.includes(id));
}
const message = computed(() => {
  const lines = [
    es.value ? 'Hola Pedro, me interesan estos servicios para mi tienda:' : 'Hi Pedro, I am interested in these services for my store:',
    '',
    ...checkedBasics.value.map(item => '- ' + title(item) + ': ' + money(item.price) + (es.value ? ' por única vez' : ' one-time')),
    ...checkedExtras.value.map(item => '- ' + title(item) + ': ' + quote.value),
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
    es.value ? 'Estimación orientativa en ARS. Alcance e importe final a confirmar. Los conceptos a cotizar no están incluidos en los importes numéricos.' : 'Indicative estimate in ARS. Final scope and price to be confirmed. Items pending a quote are not included in numeric amounts.',
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
    <div class="estimate-layout">
      <div class="estimate-choices">
        <div class="estimate-package" :class="{ 'is-selected': checkedBasics.length }">
          <div class="estimate-package-heading">
            <label class="estimate-package-select">
              <input type="checkbox" :checked="allBasics" :indeterminate.prop="partialBasics" @change="toggleBasics">
              <span><strong>{{ es ? 'Puesta en marcha' : 'Store launch setup' }}</strong><span class="estimate-caption">{{ es ? '5 servicios · pago por única vez' : '5 services · one-time payment' }}</span></span>
            </label>
            <strong class="estimate-package-price">{{ money(150000) }}</strong>
            <button type="button" class="estimate-expand" :aria-expanded="expanded" aria-controls="launch-service-options" :aria-label="es ? 'Ver o editar los servicios de puesta en marcha' : 'View or edit launch services'" @click="expanded = !expanded"><span :class="{ 'is-open': expanded }" aria-hidden="true">⌄</span></button>
          </div>
          <p class="estimate-package-hint">{{ partialBasics ? (es ? 'Selección personalizada · ' : 'Custom selection · ') + money(amount) : (es ? 'Marcá la casilla para seleccionar todo. Abrí la flecha para elegir servicio por servicio.' : 'Check the box to select all. Open the arrow to choose individual services.') }}</p>
          <div v-show="expanded" id="launch-service-options" class="estimate-options">
            <label v-for="item in options" :key="item.id" class="estimate-option" :class="{ 'is-selected': selected.includes(item.id) }">
              <input v-model="selected" type="checkbox" :value="item.id">
              <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><span>{{ description(item) }}</span></span>
              <strong class="estimate-option-price">{{ money(item.price) }}</strong>
            </label>
          </div>
        </div>

        <details class="estimate-details">
          <summary>{{ es ? '¿Necesitás algo más? Ver otros servicios' : 'Need something else? See more services' }}<span v-if="checkedExtras.length" class="estimate-count">{{ checkedExtras.length }}</span></summary>
          <p class="estimate-note">{{ es ? 'Podés sumarlos a la consulta. Te paso un precio según el trabajo; no se incluyen como $0 en la estimación.' : 'Add these to your inquiry. I will quote the scope; they are not treated as free in the estimate.' }}</p>
          <label v-for="item in extras" :key="item.id" class="estimate-option">
            <input v-model="selected" type="checkbox" :value="item.id">
            <span class="estimate-option-copy"><strong>{{ title(item) }}</strong><span>{{ description(item) }}</span><em>{{ quote }}</em></span>
          </label>
        </details>

        <details class="estimate-details">
          <summary>{{ es ? 'VendoAlgo: plan y funciones adicionales' : 'VendoAlgo: plan and extra features' }}</summary>
          <p class="estimate-note">{{ es ? 'Se paga a VendoAlgo, separado de mis servicios. Si todavía no sabés qué necesitás, lo definimos al conversar.' : 'Paid to VendoAlgo separately from my services. If you are unsure what you need, I can help you choose.' }}</p>
          <label class="estimate-field">{{ es ? 'Plan de la plataforma' : 'Platform plan' }}
            <select v-model="platform" :disabled="proRequired">
              <option value="unsure">{{ es ? 'No lo sé todavía' : 'Not sure yet' }}</option>
              <option value="free">{{ es ? 'Gratis · hasta 50 productos activos' : 'Free · up to 50 active products' }}</option>
              <option value="pro">Pro · {{ money(storePlatformPricing.plans.pro.monthly) }}/{{ es ? 'mes' : 'month' }}</option>
            </select>
          </label>
          <p v-if="proRequired" class="estimate-note">{{ es ? 'Las funciones seleccionadas requieren Pro: se incluye en el costo de plataforma del resumen.' : 'The selected features require Pro, which is included in the platform cost in your summary.' }}</p>
          <fieldset class="estimate-modules"><legend>{{ es ? 'Módulos opcionales · requieren Pro' : 'Optional modules · require Pro' }}</legend>
            <label v-for="item in storePlatformPricing.modules" :key="item.id" class="estimate-module"><input v-model="modules" type="checkbox" :value="item.id"><span>{{ item.name }}</span><strong>{{ money(item.monthly) }}/{{ es ? 'mes' : 'month' }}</strong></label>
          </fieldset>
          <p class="estimate-note"><a :href="storePlatformPricing.sourceUrl" target="_blank" rel="noopener noreferrer">{{ es ? 'Consultar precios y condiciones de VendoAlgo' : 'See VendoAlgo pricing and terms' }} ↗</a></p>
          <p class="estimate-note">{{ es ? 'Las comisiones de cobro, el dominio y otros servicios externos, si corresponden, se abonan aparte.' : 'Payment processing fees, domain registration and other external services, where applicable, are separate.' }}</p>
        </details>
      </div>

      <aside class="estimate-summary" aria-labelledby="estimate-summary-title">
        <p class="eyebrow">{{ es ? 'TU SELECCIÓN' : 'YOUR SELECTION' }}</p>
        <h3 id="estimate-summary-title">{{ es ? 'Resumen estimado' : 'Estimated summary' }}</h3>
        <p v-if="!hasSelection" class="estimate-note">{{ es ? 'Elegí al menos un servicio para armar tu consulta.' : 'Choose at least one service to build your inquiry.' }}</p>
        <ul v-else class="estimate-selected-list">
          <li v-for="item in checkedBasics" :key="item.id"><span>{{ title(item) }}</span><strong>{{ money(item.price) }}</strong></li>
          <li v-for="item in checkedExtras" :key="item.id"><span>{{ title(item) }}</span><strong>{{ quote }}</strong></li>
        </ul>
        <div class="estimate-totals" role="status" aria-live="polite" aria-atomic="true">
          <div><span>{{ es ? 'Mis servicios · por única vez' : 'My services · one-time' }}</span><strong>{{ onceLabel }}</strong></div>
          <div><span>{{ es ? 'Mis servicios · por mes' : 'My services · per month' }}</span><strong>{{ monthlyLabel }}</strong></div>
          <div class="estimate-platform-total"><span>{{ es ? 'VendoAlgo · por mes, aparte' : 'VendoAlgo · per month, separate' }}</span><strong>{{ platformCost === null ? (es ? 'Plan por definir' : 'Plan to confirm') : money(platformCost) }}</strong></div>
        </div>
        <p v-if="hasSelection && !pendingMonthly" class="estimate-note">{{ es ? 'Los servicios seleccionados no requieren contratarme un abono mensual.' : 'The selected services do not require a monthly service retainer.' }}</p>
        <p v-if="pendingOnce || pendingMonthly" class="estimate-note">{{ es ? 'Hay servicios a cotizar: el total final queda pendiente. Los importes numéricos solo suman los conceptos con precio definido.' : 'Some services need a quote: the final total is pending. Numeric amounts only include items with a defined price.' }}</p>
        <p class="estimate-invoice">{{ es ? 'Emito factura por mis servicios.' : 'I issue invoices for my services.' }}</p>
        <p class="estimate-note">{{ es ? 'Valores orientativos en pesos argentinos. Confirmo con vos el alcance y el importe final antes de comenzar.' : 'Indicative amounts in Argentine pesos. I confirm the scope and final price with you before starting.' }}</p>
        <form @submit.prevent="contact">
          <label class="estimate-field">{{ es ? 'Tu nombre' : 'Your name' }}<input v-model="inquiry.name" autocomplete="name" required maxlength="100"></label>
          <label class="estimate-field">{{ es ? 'Negocio o web (opcional)' : 'Business or website (optional)' }}<input v-model="inquiry.business" maxlength="200"></label>
          <label class="estimate-field">{{ es ? 'Contame qué necesitás (opcional)' : 'Tell me what you need (optional)' }}<textarea v-model="inquiry.message" rows="3" maxlength="1200"></textarea></label>
          <button class="button button-primary" type="submit" value="whatsapp" :disabled="!hasSelection">{{ es ? 'Consultar por WhatsApp' : 'Ask via WhatsApp' }} ↗</button>
          <button class="button button-secondary" type="submit" value="email" :disabled="!hasSelection">{{ es ? 'Consultar por correo' : 'Ask via email' }} ↗</button>
          <p class="estimate-note">{{ es ? 'Se abre WhatsApp o tu aplicación de correo con el resumen y tu mensaje. Revisalo y envialo desde ahí; no se envía automáticamente.' : 'WhatsApp or your email app opens with your summary and message. Review and send it there; nothing is sent automatically.' }}</p>
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
.estimate-package-heading { display: flex; align-items: center; gap: 12px; padding: 20px 16px 12px; background: var(--soft); }
.estimate-package-select { display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer; margin: 0; min-width: 0; }
.estimate-package-select strong { font-size: 1.08rem; }
.estimate-caption { display: block; font-size: .78rem; font-weight: 400; color: var(--muted); margin-top: 5px; line-height: 1.4; }
.estimate-package-price { font-size: 1.05rem; white-space: nowrap; }
.estimate-expand { display: grid; place-items: center; flex: 0 0 44px; width: 44px; height: 44px; border: 1px solid var(--line); background: var(--surface); border-radius: 6px; color: var(--ink); cursor: pointer; }
.estimate-expand span { display: block; font-size: 1.6rem; line-height: 1; transition: transform .15s; }
.estimate-expand span.is-open { transform: rotate(180deg); }
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
  .estimate-package-heading { flex-wrap: wrap; gap: 8px; padding: 16px 12px 12px; }
  .estimate-package-select { flex-basis: calc(100% - 58px); }
  .estimate-package-price { order: 3; margin-left: 32px; }
  .estimate-package-hint { padding-inline: 12px; }
  .estimate-summary { padding: 20px 16px; }
  .estimate-options { padding-inline: 12px; }
  .estimate-option { grid-template-columns: 22px minmax(0, 1fr); }
  .estimate-option-price { grid-column: 2; }
  .estimate-module { grid-template-columns: 22px minmax(0, 1fr); }
  .estimate-module strong { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) { .estimate-expand span { transition: none; } }
</style>
