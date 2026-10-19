<script setup>
import { vReveal } from './portfolioMotion';
import { computed, ref } from 'vue';
const props = defineProps({ language: { type: String, default: 'es' }, part: { type: String, default: 'tour' }, showPrices: { type: Boolean, default: false } });
const copy = {
  "es": {
    "tourLabel": "RECORRIDO POR UNA TIENDA REAL",
    "tourTitle": "Mirá lo que podría recibir tu negocio.",
    "tourIntro": "Este ejemplo es FumigAR, una tienda en funcionamiento. Su diseño y productos son propios de ese negocio; preparo tu tienda según lo que acordemos para el tuyo.",
    "steps": [
      {
        "id": "catalog",
        "title": "Encontrar un producto",
        "short": "Catálogo",
        "body": "El cliente recorre los productos, busca lo que necesita y filtra por categoría. Yo puedo cargar o migrar tu catálogo y organizar sus datos.",
        "image": "service-demo-fumigar-catalog.jpg",
        "alt": "Catálogo real de FumigAR con categorías y productos",
        "url": "https://fumig.ar/productos",
        "link": "Explorar el catálogo real"
      },
      {
        "id": "product",
        "title": "Conocer qué está comprando",
        "short": "Producto",
        "body": "En la ficha encuentra fotos, descripción, opciones y precio. Preparo la información con el material que me entregues y los cambios que acordemos.",
        "image": "service-demo-fumigar-product.jpg",
        "alt": "Ficha real de un producto en FumigAR",
        "url": "https://fumig.ar/producto/jeringa-gel-mata-cucarachas-veneno-insecticida-60-gramos",
        "link": "Abrir la ficha real"
      },
      {
        "id": "purchase",
        "title": "Preparar su compra",
        "short": "Compra",
        "body": "El cliente revisa lo que eligió y continúa con la compra. Configuro los medios de pago, las formas de entrega y las condiciones que necesite tu tienda.",
        "image": "service-demo-fumigar-cart.jpg",
        "alt": "Carrito de compra de FumigAR con un producto de ejemplo",
        "url": "https://fumig.ar/",
        "link": "Recorrer la tienda real"
      }
    ],
    "captureNote": "Capturas de FumigAR · octubre de 2026. Los productos, precios y pantallas pueden cambiar.",
    "caseLabel": "EL TRABAJO DETRÁS DE LA TIENDA",
    "caseTitle": "En FumigAR también me ocupo de lo que no se ve.",
    "caseText": "Además de migrar los productos y preparar la tienda, dejé los precios actualizándose automáticamente cada mañana según los costos de los insumos del proveedor.",
    "caseResult": "Ellos no tienen que repetir esa actualización a mano cada mañana.",
    "caseScope": "Para tu negocio acordamos qué datos actualizar, de dónde tomar la información y en qué horarios. El alcance se confirma antes de contratar.",
    "processLabel": "CÓMO TRABAJAMOS",
    "processTitle": "Desde tu consulta hasta la tienda en marcha.",
    "process": [
      {
        "title": "Me contás qué necesitás",
        "body": "Qué vendés, si ya tenés tienda y qué tareas querés delegar. Si no sabés qué elegir, te oriento."
      },
      {
        "title": "Recibís una propuesta por escrito",
        "body": "Tareas incluidas, precio, forma de pago y tiempos. Detallo aparte el plan de VendoAlgo y otros gastos necesarios."
      },
      {
        "title": "Preparo el trabajo y lo revisamos",
        "body": "Me entregás los datos, materiales y accesos acordados. Configuro lo contratado y revisamos el resultado juntos."
      },
      {
        "title": "Seguís con la ayuda que elijas",
        "body": "Podés contratar capacitación, tareas puntuales o seguimiento mensual. Te explico qué incluye cada opción."
      }
    ],
    "faqLabel": "ANTES DE DECIDIR",
    "faqTitle": "Las dudas más habituales.",
    "faq": [
      {
        "q": "¿Tengo que dejar Mercado Libre?",
        "a": "No. Podés sumar una tienda propia y seguir vendiendo en Mercado Libre. La conexión entre ambos es una función opcional de VendoAlgo que se contrata aparte; te ayudo a evaluar si la necesitás."
      },
      {
        "q": "¿Tengo que saber de tecnología?",
        "a": "No hace falta que sepas configurar una tienda. Yo me ocupo de las tareas que acordemos. Si vos o tu equipo van a manejarla, puedo incluir capacitación para las tareas habituales."
      },
      {
        "q": "¿Qué tengo que entregarte?",
        "a": "Depende del trabajo: los datos y fotos de tus productos, logo y colores si los tenés, formas de cobro y entrega, y los accesos necesarios. Si querés actualizar datos automáticamente, también reviso las fuentes de información y tus reglas de precios."
      },
      {
        "q": "¿Puedo contratar una sola tarea?",
        "a": "Sí. Podés pedirme una carga de productos, un cambio, una configuración o una actualización automática. No necesitás contratar todos los servicios."
      },
      {
        "q": "¿Qué se paga aparte de tu trabajo?",
        "a": "El plan y las funciones opcionales de VendoAlgo que necesites, las comisiones del medio de cobro, el dominio si lo contratás y otros servicios externos acordados. Lo detallo en la propuesta para que puedas evaluar el costo completo."
      },
      {
        "q": "¿Podés actualizar precios, stock y productos de cualquier proveedor?",
        "a": "Reviso primero de dónde sale la información, cómo se accede y qué cambios necesitás. Con eso confirmo qué puedo automatizar y su costo. No prometo una conexión antes de revisar tu caso."
      },
      {
        "q": "¿Cuánto tarda?",
        "a": "Confirmo los tiempos después de revisar el alcance y los materiales disponibles. La propuesta indica qué necesito de vos y cuándo está previsto el trabajo; no todos los pedidos requieren lo mismo."
      },
      {
        "q": "¿Qué pasa si hay un problema?",
        "a": "Atiendo lo que esté incluido en la asistencia contratada. Si el problema requiere intervención del equipo de VendoAlgo, elevo el reclamo y le doy seguimiento. El presupuesto aclara qué mantenimiento se incluye."
      },
      {
        "q": "¿Tengo que pagarte mantenimiento todos los meses?",
        "a": "No por el solo hecho de armarte una tienda. Podés contratar ayuda puntual. Las tareas automáticas y otros servicios continuos tienen su propio alcance y abono, que acordamos por separado."
      },
      {
        "q": "¿Qué incluye el abono de una tarea automática?",
        "a": "El funcionamiento de la tarea acordada, una revisión mensual y hasta una hora para ajustes menores. Si un cambio exige rehacer una parte importante o sumar funciones, te explico las opciones y presupuesto ese trabajo antes de avanzar. Los cambios de herramienta que yo decida para prestar el mismo servicio no generan por sí solos un cargo adicional."
      },
      {
        "q": "¿Qué pasa si dejo de contratar tu gestión?",
        "a": "Antes de comenzar acordamos la titularidad y los accesos de las cuentas. Si termina mi gestión, coordinamos la entrega de lo trabajado y qué tareas dejan de estar a mi cargo. La continuidad de la tienda depende también de mantener los servicios de VendoAlgo que correspondan."
      },
      {
        "q": "¿Podés ayudarme con empleados o redes sociales?",
        "a": "Puedo ayudarte a buscar y capacitar a un diseñador, operario, vendedor o community manager, y preparar sus permisos en la tienda. El sueldo, los honorarios de esa persona y los avisos pagos no están incluidos en mi ayuda para la búsqueda."
      },
      {
        "q": "¿Cómo empiezo?",
        "a": "Elegí una de las opciones de ayuda o marcá los servicios que te interesan. Podés preparar una consulta por WhatsApp o correo, o agendar una charla. Yo reviso el pedido y te confirmo la propuesta antes de que contrates."
      }
    ],
    "paymentTitle": "Podés pagar la inversión inicial en cuotas.",
    "paymentIntro": "Ofrezco hasta 6 cuotas para mis honorarios iniciales, según el importe y el proyecto.",
    "paymentTerms": "El presupuesto financiado se acuerda en dólares. Podés pagar en pesos al tipo de cambio definido en la propuesta: el importe en pesos de cada cuota puede variar. Dejamos por escrito la cotización de referencia, la fecha de conversión y los vencimientos antes de empezar.",
    "paymentSeparate": "Mis servicios mensuales y los cargos de VendoAlgo se pagan por separado. Emito factura por mi trabajo.",
    "pricingFaq": "¿Cuánto cuestan tus servicios?",
    "pricingAnswer": "Elijo con vos las tareas necesarias y te paso un presupuesto. Distingo el trabajo inicial, mi ayuda mensual si la necesitás y el costo de VendoAlgo. Podés pedir solo una tarea o empezar con lo básico y sumar después."
  },
  "en": {
    "tourLabel": "EXPLORE A REAL STORE",
    "tourTitle": "See what your business could receive.",
    "tourIntro": "This example is FumigAR, a working store. Its design and products belong to that business; I prepare your store around the scope we agree for yours.",
    "steps": [
      {
        "id": "catalog",
        "title": "Find a product",
        "short": "Catalog",
        "body": "Customers browse, search and filter by category. I can upload or migrate your catalog and organize its information.",
        "image": "service-demo-fumigar-catalog.jpg",
        "alt": "FumigAR’s actual catalog with categories and products",
        "url": "https://fumig.ar/productos",
        "link": "Explore the real catalog"
      },
      {
        "id": "product",
        "title": "Understand the product",
        "short": "Product",
        "body": "Product pages show photos, descriptions, options and prices. I prepare information using the materials you provide and the changes we agree.",
        "image": "service-demo-fumigar-product.jpg",
        "alt": "An actual FumigAR product page",
        "url": "https://fumig.ar/producto/jeringa-gel-mata-cucarachas-veneno-insecticida-60-gramos",
        "link": "Open the actual product"
      },
      {
        "id": "purchase",
        "title": "Prepare the purchase",
        "short": "Purchase",
        "body": "Customers review their selection and continue buying. I configure the agreed payment methods, delivery options and store conditions.",
        "image": "service-demo-fumigar-cart.jpg",
        "alt": "FumigAR shopping cart containing an example product",
        "url": "https://fumig.ar/",
        "link": "Explore the real store"
      }
    ],
    "captureNote": "FumigAR screenshots · October 2026. Products, prices and screens may change.",
    "caseLabel": "BEHIND THE STORE",
    "caseTitle": "At FumigAR, I also handle work you cannot see.",
    "caseText": "Alongside the catalog migration and store setup, I configured automatic daily price updates based on the supplier’s input costs.",
    "caseResult": "They do not have to repeat that update manually every morning.",
    "caseScope": "For your business, we agree which information to update, its sources and the schedule. The scope is confirmed before hiring.",
    "processLabel": "WORKING TOGETHER",
    "processTitle": "From your inquiry to the agreed work.",
    "process": [
      {
        "title": "Tell me what you need",
        "body": "What you sell, whether you already have a store and what you want to delegate. I help you choose if you are unsure."
      },
      {
        "title": "Receive a written proposal",
        "body": "Included tasks, price, payment terms and schedule. VendoAlgo and any other necessary costs are listed separately."
      },
      {
        "title": "I prepare the work and we review it",
        "body": "You supply the agreed information, materials and access. I configure the work and we review the result together."
      },
      {
        "title": "Continue with the help you choose",
        "body": "You can hire training, individual tasks or monthly assistance. I explain what each option includes."
      }
    ],
    "faqLabel": "BEFORE YOU DECIDE",
    "faqTitle": "Common questions.",
    "faq": [
      {
        "q": "Do I have to leave Mercado Libre?",
        "a": "No. You can add your own store and keep selling on Mercado Libre. Connecting both is an optional VendoAlgo feature purchased separately; I help you assess whether you need it."
      },
      {
        "q": "Do I need technical skills?",
        "a": "You do not need to know how to configure a store. I handle the agreed tasks. Training for your everyday work can be included if you or your staff will operate it."
      },
      {
        "q": "What do I need to provide?",
        "a": "Depending on the work: product information and photos, branding if available, payment and delivery choices, and the necessary access. For automatic updates, I also review sources and pricing rules."
      },
      {
        "q": "Can I hire a single task?",
        "a": "Yes. Product uploads, a change, configuration or one automatic task can be quoted separately."
      },
      {
        "q": "What costs extra?",
        "a": "Required VendoAlgo plans and optional features, payment processing fees, a domain if purchased, and any agreed external services. They are itemized in the proposal."
      },
      {
        "q": "Can you update data from any supplier?",
        "a": "I first review the information source, access and required changes. Then I confirm what can be automated and its cost."
      },
      {
        "q": "How long does it take?",
        "a": "I confirm the schedule after reviewing scope and available materials. The proposal explains what I need from you and the planned timing."
      },
      {
        "q": "What happens if something goes wrong?",
        "a": "I handle issues within the assistance you purchase. When VendoAlgo needs to intervene, I report and follow up on the issue. Included maintenance is specified in the quote."
      },
      {
        "q": "Is monthly maintenance mandatory?",
        "a": "Not simply because I set up a store. You may hire occasional help. Automations and other ongoing services have separately agreed scopes and fees."
      },
      {
        "q": "What does an automation’s monthly fee include?",
        "a": "The agreed task, a monthly review and up to one hour of minor adjustments. If a change requires substantial rework or new features, I explain the options and quote that work before proceeding. Tool changes I choose to provide the same service do not themselves create an extra charge."
      },
      {
        "q": "What if I stop hiring you?",
        "a": "Before starting, we agree account ownership and access. If my service ends, we coordinate handover and identify which tasks stop being my responsibility. Store continuity also depends on maintaining the relevant VendoAlgo services."
      },
      {
        "q": "Can you help with staff or social media?",
        "a": "I can help you find and train a designer, operator, salesperson or community manager and configure store permissions. Their salary, fees and paid recruitment ads are separate."
      },
      {
        "q": "How do I start?",
        "a": "Choose a guided option or individual services. Prepare a WhatsApp or email inquiry or book a conversation. I review your request and confirm a proposal before you hire me."
      }
    ],
    "paymentTitle": "Pay the initial investment in installments.",
    "paymentIntro": "Up to 6 installments for my initial fees, depending on amount and project.",
    "paymentTerms": "Financed quotes are agreed in US dollars. You may pay in Argentine pesos using the exchange rate specified in the proposal; the peso amount of each installment may vary. The rate source, conversion date and due dates are agreed in writing before starting.",
    "paymentSeparate": "My recurring services and VendoAlgo fees are separate. I issue invoices for my work.",
    "pricingFaq": "How much do your services cost?",
    "pricingAnswer": "We identify the tasks you need and I provide a quote, separating initial work, recurring help and VendoAlgo. Start with one task or the basics and add services later."
  }
};
const text = computed(() => copy[props.language === 'en' ? 'en' : 'es']);
const es = computed(() => props.language !== 'en');
const active = ref(0);
const screen = computed(() => text.value.steps[active.value]);
const imageFailed = ref({});
const zoom = ref(null);
const assetBase = import.meta.env.BASE_URL;
function openImage() { zoom.value?.showModal(); }
</script>

<template>
  <section v-if="part === 'tour'" class="service-guide service-tour" aria-labelledby="service-tour-title">
    <header class="guide-heading" v-reveal>
      <p class="eyebrow">{{ text.tourLabel }}</p>
      <h2 id="service-tour-title">{{ text.tourTitle }}</h2>
      <p>{{ text.tourIntro }}</p>
    </header>
    <div class="tour-steps" :aria-label="es ? 'Pasos del recorrido' : 'Store walkthrough steps'">
      <button v-for="(step, index) in text.steps" :key="step.id" type="button" :aria-pressed="active === index" :class="{ active: active === index }" aria-controls="service-tour-screen" @click="active = index"><span class="tour-number">0{{ index + 1 }}</span>{{ step.short }}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
    </div>
    <div id="service-tour-screen" class="tour-screen" v-reveal>
      <div class="tour-browser" aria-hidden="true"><span>fumig.ar</span><span>{{ es ? 'TIENDA REAL' : 'REAL STORE' }}</span></div>
      <button v-if="!imageFailed[screen.id]" type="button" class="tour-image-button" @click="openImage" :aria-label="(es ? 'Ampliar captura: ' : 'Enlarge screenshot: ') + screen.title"><img :src="assetBase + screen.image" :alt="screen.alt" width="1920" height="889" loading="lazy" @error="imageFailed[screen.id] = true"><span class="tour-enlarge">{{ es ? 'Ampliar captura' : 'Enlarge screenshot' }} ↗</span></button>
      <p v-else class="tour-fallback">{{ es ? 'Podés ver este paso directamente en la tienda real con el enlace de abajo.' : 'Use the link below to explore this step in the real store.' }}</p>
      <div class="tour-caption" aria-live="polite">
        <div><h3>{{ screen.title }}</h3><p>{{ screen.body }}</p></div>
        <a :href="screen.url" target="_blank" rel="noopener noreferrer">{{ screen.link }} ↗</a>
      </div>
    </div>
    <p class="guide-small">{{ text.captureNote }}</p>
    <aside class="case-result" v-reveal>
      <p class="eyebrow">{{ text.caseLabel }}</p><h3>{{ text.caseTitle }}</h3><p>{{ text.caseText }}</p><strong>{{ text.caseResult }}</strong><p class="guide-small">{{ text.caseScope }}</p>
    </aside>
    <dialog ref="zoom" class="tour-dialog" @click="($event.target === $event.currentTarget) && zoom.close()">
      <div class="tour-dialog-top"><strong>{{ screen.title }}</strong><button type="button" @click="zoom.close()" :aria-label="es ? 'Cerrar captura ampliada' : 'Close enlarged screenshot'">✕</button></div>
      <div class="tour-dialog-image"><img :src="assetBase + screen.image" :alt="screen.alt" width="1920" height="889"></div>
      <p class="guide-small">{{ es ? 'En celular podés desplazar la captura para ver los detalles.' : 'On mobile, scroll the screenshot to see details.' }}</p>
    </dialog>
  </section>

  <section v-else-if="part === 'process'" class="service-guide guide-process" aria-labelledby="service-process-title">
    <header class="guide-heading" v-reveal><p class="eyebrow">{{ text.processLabel }}</p><h2 id="service-process-title">{{ text.processTitle }}</h2></header>
    <ol class="guide-process-list"><li v-for="(step, index) in text.process" :key="index" v-reveal="index * 55"><span class="guide-step-number">0{{ index + 1 }}</span><h3>{{ step.title }}</h3><p>{{ step.body }}</p></li></ol>
  </section>

  <section v-else-if="part === 'faq'" class="service-guide guide-faq" aria-labelledby="service-faq-title">
    <header class="guide-heading" v-reveal><p class="eyebrow">{{ text.faqLabel }}</p><h2 id="service-faq-title">{{ text.faqTitle }}</h2><p>{{ es ? 'Abrí solo la pregunta que necesites.' : 'Open only the question you need.' }}</p></header>
    <details v-if="!showPrices"><summary>{{ text.pricingFaq }}</summary><p>{{ text.pricingAnswer }}</p></details>
    <details v-for="item in text.faq" :key="item.q"><summary>{{ item.q }}</summary><p>{{ item.a }}</p></details>
  </section>

  <section v-else-if="part === 'payment' && showPrices" id="service-payment" class="service-guide guide-payment" aria-labelledby="service-payment-title">
    <p class="eyebrow">{{ es ? 'FORMAS DE PAGO' : 'PAYMENT OPTIONS' }}</p><h2 id="service-payment-title">{{ text.paymentTitle }}</h2><p>{{ text.paymentIntro }}</p>
    <details><summary>{{ es ? 'Cómo se calculan las cuotas y qué puede variar' : 'How installments are calculated and what can change' }}</summary><p>{{ text.paymentTerms }}</p></details>
    <p class="payment-visible-terms">{{ es ? 'Cuotas acordadas en USD, pagaderas en pesos. El importe en pesos puede variar según el tipo de cambio pactado.' : 'Installments agreed in USD, payable in pesos. Peso amounts may vary with the agreed exchange rate.' }}</p>
    <p class="guide-small">{{ text.paymentSeparate }}</p>
  </section>
</template>

<style scoped>
.service-guide { color: var(--ink); min-width: 0; }
.guide-heading { max-width: 48rem; margin-bottom: 1.75rem; }
.guide-heading h2, .guide-payment h2 { font-size: clamp(1.65rem, 3vw, 2.35rem); line-height: 1.15; letter-spacing: -.04em; margin: .5rem 0 1rem; }
.guide-heading > p:last-child, .guide-payment > p { color: var(--muted); line-height: 1.75; }
.tour-steps { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .65rem; margin: 1.5rem 0 .9rem; }
.tour-steps button { display: flex; gap: .65rem; align-items: center; min-height: 3.5rem; padding: .85rem 1rem; border: 1px solid var(--line); border-radius: .35rem; background: transparent; color: var(--ink); font-size: 1rem; font-weight: 600; text-align: left; cursor: pointer; }
.tour-steps button.active { background: var(--accent); border-color: var(--accent); color: #172033; }
.tour-steps svg { margin-left: auto; flex-shrink: 0; }
.tour-number { font-size: .75rem; opacity: .7; }
.tour-screen { border: 1px solid var(--line); border-radius: .65rem; overflow: hidden; background: var(--surface); }
.tour-browser { display: flex; justify-content: space-between; gap: 1rem; padding: .7rem 1rem; color: var(--muted); font-size: .75rem; border-bottom: 1px solid var(--line); }
.tour-browser > span:last-child { font-size: .65rem; letter-spacing: .1em; }
.tour-image-button { display: block; position: relative; width: 100%; padding: 0; border: 0; cursor: zoom-in; background: #fff; color: #172033; }
.tour-image-button img { display: block; width: 100%; height: auto; aspect-ratio: 1920/889; object-fit: contain; }
.tour-enlarge { position: absolute; bottom: .75rem; right: .75rem; padding: .55rem .75rem; background: #fff; border: 1px solid #cfd4c8; border-radius: .3rem; font-size: .8rem; box-shadow: 0 2px 8px rgb(0 0 0/.08); }
.tour-caption { display: flex; justify-content: space-between; align-items: center; gap: 2rem; padding: 1.5rem; border-top: 1px solid var(--line); }
.tour-caption h3 { font-size: 1.2rem; margin: 0 0 .5rem; line-height: 1.4; }
.tour-caption p { max-width: 48rem; color: var(--muted); line-height: 1.75; margin: 0; }
.tour-caption a { flex-shrink: 0; max-width: 13rem; font-size: .9rem; line-height: 1.6; text-decoration: underline; text-underline-offset: .25rem; }
.tour-fallback { padding: 2rem; line-height: 1.75; }
.guide-small { color: var(--muted); font-size: .85rem; line-height: 1.75; margin: .85rem 0 0; }
.case-result { margin-top: 2rem; padding: 1.65rem; border-left: 3px solid #82963a; background: var(--soft); border-radius: 0 .5rem .5rem 0; }
.case-result h3 { font-size: 1.35rem; letter-spacing: -.025em; line-height: 1.4; margin: .5rem 0 .85rem; }
.case-result > p:not(.eyebrow):not(.guide-small) { max-width: 55rem; color: var(--muted); line-height: 1.75; }
.case-result > strong { display: block; line-height: 1.6; }
.guide-process-list { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 1.5rem; list-style: none; padding: 0; margin: 0; }
.guide-process-list li { padding-top: 1.25rem; border-top: 1px solid var(--line); }
.guide-step-number { font-size: .8rem; color: var(--muted); }
.guide-process-list h3 { font-size: 1.05rem; line-height: 1.5; margin: .75rem 0; }
.guide-process-list p { font-size: .95rem; color: var(--muted); line-height: 1.75; margin: 0; }
.guide-faq { max-width: 54rem; }
.guide-faq details, .guide-payment details { padding: 0; border: 0; border-top: 1px solid var(--line); }
.guide-faq details:last-child { border-bottom: 1px solid var(--line); }
.guide-faq summary, .guide-payment summary { padding: 1.15rem 0; cursor: pointer; font-size: 1rem; font-weight: 600; line-height: 1.6; }
.guide-faq details p, .guide-payment details p { font-size: .95rem; line-height: 1.85; color: var(--muted); margin: 0 0 1.25rem; max-width: 48rem; }
.guide-payment { padding: 1.65rem; border: 1px solid var(--line); border-radius: .65rem; background: var(--soft); scroll-margin-top: 7rem; }
.guide-payment h2 { font-size: clamp(1.5rem, 2.6vw, 2rem); max-width: 40rem; }
.guide-payment .payment-visible-terms { color: var(--ink); font-size: .95rem; font-weight: 600; }
.tour-dialog { padding: 1rem; border: 1px solid var(--line); border-radius: .6rem; background: var(--surface); color: var(--ink); width: min(96vw, 1500px); max-width: 96vw; max-height: 92dvh; }
.tour-dialog::backdrop { background: rgb(0 0 0/.75); }
.tour-dialog-top { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: .75rem; }
.tour-dialog-top button { min-width: 44px; min-height: 44px; padding: .5rem; background: transparent; color: var(--ink); border: 1px solid var(--line); border-radius: .3rem; cursor: pointer; }
.tour-dialog-image { overflow: auto; max-height: 68dvh; border: 1px solid var(--line); }
.tour-dialog-image img { display: block; width: 100%; min-width: 960px; height: auto; }
.service-guide :is(button,a,summary):focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
@media(max-width:900px) {
 .guide-process-list { grid-template-columns: repeat(2,minmax(0,1fr)); }
 .tour-caption { display: grid; gap: 1rem; }
 .tour-caption a { max-width: none; }
}
@media(max-width:500px) {
 .tour-steps { gap: .4rem; }
 .tour-steps button { padding: .8rem .6rem; gap: .4rem; font-size: .9rem; }
 .tour-steps svg { display: none; }
 .tour-caption, .case-result, .guide-payment { padding: 1.15rem; }
 .guide-process-list { grid-template-columns: 1fr; gap: 1rem; }
 .tour-enlarge { bottom: .4rem; right: .4rem; padding: .4rem .55rem; font-size: .7rem; }
 .tour-dialog { padding: .65rem; }
}
</style>