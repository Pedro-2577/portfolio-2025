<script setup>
import { computed, nextTick, ref } from 'vue';

const props = defineProps({ language: { type: String, default: 'es' } });
const active = ref(0);
const completed = ref(false);
const stock = ref(8);
const panel = ref(null);
const copy = {
  es: {
    eyebrow: 'Ejemplo interactivo',
    title: 'Probá una tienda desde distintos roles.',
    intro: 'Elegí quién la usa y probá una acción. También podés ver qué pasa cuando alguien intenta entrar sin permiso o llega a un enlace roto.',
    prompt: 'Cada opción cambia la pantalla y su respuesta.',
    group: 'Elegir un rol o una situación',
    demo: 'Tienda de ejemplo',
    disclaimer: 'Simulación local: no realiza compras ni modifica datos reales.',
    product: 'Auriculares inalámbricos',
    price: '$ 120.000',
    productAlt: 'Ilustración de unos auriculares',
    quantity: 'Cantidad: 1',
    stockLabel: 'Unidades disponibles',
    order: 'Pedido DEMO-001',
    customer: 'Cliente de ejemplo',
    pending: 'Pendiente de envío',
    shipped: 'Enviado',
    retry: 'Volver a probar',
    back: 'Volver a la tienda',
    review: 'Qué reviso en este caso',
    savedStock: 'Stock guardado en esta simulación.',
    scenarios: [
      { label: 'Comprador', title: 'Hacer una compra', context: 'Una persona quiere comprar un producto y saber si el pedido quedó registrado.', action: 'Confirmar compra de prueba', result: 'Pedido de prueba registrado', detail: 'El resumen confirma el producto, el importe y el número de pedido.', review: 'Precio y disponibilidad claros, confirmación del pedido y evitar compras duplicadas.', path: '/checkout', code: '200 · OK' },
      { label: 'Vendedor', title: 'Actualizar el stock', context: 'La persona que vende necesita cambiar la disponibilidad sin tocar otros datos del producto.', action: 'Guardar stock', result: 'Stock actualizado', detail: 'La pantalla confirma la cantidad guardada.', review: 'Validar cantidades, guardar el cambio y mostrar si se pudo completar.', path: '/vendedor/productos', code: '200 · OK' },
      { label: 'Administrador', title: 'Gestionar un pedido', context: 'La persona que administra necesita identificar el pedido y actualizar su estado.', action: 'Marcar como enviado', result: 'Estado del pedido actualizado', detail: 'El pedido DEMO-001 figura como enviado.', review: 'Acciones según los permisos, estados claros y registro de los cambios.', path: '/admin/pedidos', code: '200 · OK' },
      { label: 'Sin permiso', title: 'Intentar entrar al panel de administración', context: 'Una persona sin permisos de administración abre la dirección del panel.', action: 'Probar acceso sin permiso', result: 'No tenés permiso para entrar', detail: 'El sistema debe rechazar el acceso sin mostrar información privada y ofrecer una salida.', review: 'El servidor debe comprobar los permisos. Ocultar un botón en la interfaz no alcanza.', path: '/admin', code: '403 · Forbidden' },
      { label: 'Enlace roto', title: 'Llegar a una página que no existe', context: 'Una persona abre un enlace viejo o escribe una dirección incorrecta.', action: 'Abrir enlace inexistente', result: 'No encontramos esta página', detail: 'La página explica qué pasó y ofrece volver a un lugar conocido.', review: 'Un error comprensible, navegación para recuperarse y una respuesta HTTP 404 real.', path: '/producto/ya-no-existe', code: '404 · Not Found' },
    ],
  },
  en: {
    eyebrow: 'Interactive example',
    title: 'Try a store from different roles.',
    intro: 'Choose who is using it and try an action. You can also see what happens when someone tries to enter without permission or follows a broken link.',
    prompt: 'Each option changes the screen and its response.',
    group: 'Choose a role or situation',
    demo: 'Example store',
    disclaimer: 'Local simulation: no purchases or changes to real data.',
    product: 'Wireless headphones',
    price: 'ARS 120,000',
    productAlt: 'Illustration of headphones',
    quantity: 'Quantity: 1',
    stockLabel: 'Available units',
    order: 'Order DEMO-001',
    customer: 'Example customer',
    pending: 'Awaiting shipment',
    shipped: 'Shipped',
    retry: 'Try again',
    back: 'Back to the store',
    review: 'What I check in this case',
    savedStock: 'Stock saved in this simulation.',
    scenarios: [
      { label: 'Buyer', title: 'Make a purchase', context: 'A customer wants to buy a product and know that the order was recorded.', action: 'Confirm test purchase', result: 'Test order recorded', detail: 'The summary confirms the product, amount and order number.', review: 'Clear pricing and availability, order confirmation and preventing duplicate purchases.', path: '/checkout', code: '200 · OK' },
      { label: 'Seller', title: 'Update stock', context: 'The seller needs to change availability without modifying other product details.', action: 'Save stock', result: 'Stock updated', detail: 'The screen confirms the saved quantity.', review: 'Validate quantities, save the change and show whether it succeeded.', path: '/seller/products', code: '200 · OK' },
      { label: 'Administrator', title: 'Manage an order', context: 'The administrator needs to identify an order and update its status.', action: 'Mark as shipped', result: 'Order status updated', detail: 'Order DEMO-001 is now marked as shipped.', review: 'Permission-based actions, clear statuses and a record of changes.', path: '/admin/orders', code: '200 · OK' },
      { label: 'No permission', title: 'Try to enter the admin panel', context: 'Someone without administrator permissions opens the panel address.', action: 'Try access without permission', result: 'You do not have permission to enter', detail: 'The system should reject access without exposing private information and offer a way back.', review: 'The server must check permissions. Hiding a button in the interface is not enough.', path: '/admin', code: '403 · Forbidden' },
      { label: 'Broken link', title: 'Open a page that does not exist', context: 'Someone follows an old link or enters an incorrect address.', action: 'Open a missing page', result: 'We could not find this page', detail: 'The page explains what happened and offers a route back to a familiar place.', review: 'An understandable error, recovery navigation and an actual HTTP 404 response.', path: '/product/no-longer-exists', code: '404 · Not Found' },
    ],
  },
};
const t = computed(() => copy[props.language] || copy.es);
const selected = computed(() => t.value.scenarios[active.value]);
const validStock = computed(() => Number.isInteger(stock.value) && stock.value >= 0 && stock.value <= 9999);

function choose(index) {
  active.value = index;
  completed.value = false;
  stock.value = 8;
}
async function run() {
  if (active.value === 1 && !validStock.value) return;
  completed.value = true;
  await nextTick();
  panel.value?.querySelector('.scenario-response')?.focus({ preventScroll: true });
}
async function reset() {
  completed.value = false;
  await nextTick();
  panel.value?.querySelector('.scenario-run')?.focus({ preventScroll: true });
}
async function returnToStore() {
  choose(0);
  await nextTick();
  panel.value?.parentElement.querySelector('.scenario-choices button')?.focus({ preventScroll: true });
}
</script>

<template>
  <section id="portfolio-playground" class="playground-section" tabindex="-1" aria-labelledby="playground-title">
    <div class="container playground-grid">
      <header class="playground-intro">
        <p class="eyebrow">{{ t.eyebrow }}</p>
        <h2 id="playground-title">{{ t.title }}</h2>
        <p>{{ t.intro }}</p>
        <span class="playground-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 3 14 10-7 1-3 7Z"/><path d="m12 14 5 6"/></svg>{{ t.prompt }}</span>
      </header>

      <div class="workbench scenario-workbench" :data-step="active">
        <div class="workbench-topbar">
          <span class="workbench-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span>{{ t.demo }}</span>
          <span class="scenario-demo-label">DEMO</span>
        </div>

        <div class="scenario-choices" role="group" :aria-label="t.group">
          <button v-for="(scenario, index) in t.scenarios" :key="index" type="button" :aria-pressed="active === index" aria-controls="scenario-panel" @click="choose(index)">{{ scenario.label }}</button>
        </div>

        <div id="scenario-panel" ref="panel" class="scenario-panel">
          <div class="scenario-address" aria-hidden="true"><span>demo.local</span>{{ selected.path }}</div>
          <h3>{{ selected.title }}</h3>
          <p class="scenario-context">{{ selected.context }}</p>

          <form v-if="!completed" class="scenario-action-area" @submit.prevent="run">
            <div v-if="active <= 1" class="scenario-product">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" role="img" :aria-label="t.productAlt"><path d="M13 37v-8a19 19 0 0 1 38 0v8"/><rect x="9" y="31" width="11" height="21" rx="5"/><rect x="44" y="31" width="11" height="21" rx="5"/><path d="M20 37v9m24-9v9"/></svg>
              <div><strong>{{ t.product }}</strong><span v-if="active === 0">{{ t.price }} · {{ t.quantity }}</span><label v-else class="scenario-stock" for="demo-stock">{{ t.stockLabel }}<input id="demo-stock" v-model.number="stock" type="number" min="0" max="9999" step="1" required inputmode="numeric"></label></div>
            </div>
            <div v-else-if="active === 2" class="scenario-order"><div><strong>{{ t.order }}</strong><span>{{ t.customer }}</span></div><span class="scenario-order-state">{{ t.pending }}</span></div>
            <div v-else class="scenario-access" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><template v-if="active === 3"><rect x="7" y="14" width="18" height="13" rx="3"/><path d="M11 14V9a5 5 0 0 1 10 0v5m-5 6v3"/></template><template v-else><path d="M7 3h12l6 6v20H7Z"/><path d="M19 3v7h6M12 17h8m-8 5h5"/></template></svg><span>{{ active === 3 ? '403' : '404' }}</span></div>
            <button class="button scenario-run" type="submit" :disabled="active === 1 && !validStock">{{ selected.action }} <span aria-hidden="true">→</span></button>
          </form>

          <div v-else class="scenario-response" :class="{ 'scenario-response-error': active >= 3 }" role="status" tabindex="-1">
            <span class="scenario-code">{{ selected.code }}</span>
            <h4>{{ selected.result }}</h4>
            <p v-if="active === 1">{{ t.savedStock }} <strong>{{ stock }}</strong></p>
            <p v-else>{{ selected.detail }}</p>
            <div v-if="active === 0" class="scenario-receipt"><span>{{ t.order }}</span><strong>{{ t.price }}</strong></div>
            <div v-if="active === 2" class="scenario-receipt"><span>{{ t.order }}</span><strong>{{ t.shipped }}</strong></div>
            <button v-if="active >= 3" class="scenario-reset" type="button" @click="returnToStore">{{ t.back }} <span aria-hidden="true">→</span></button>
            <button v-else class="scenario-reset" type="button" @click="reset">{{ t.retry }} <span aria-hidden="true">↺</span></button>
          </div>
        </div>

        <div class="scenario-review"><strong>{{ t.review }}</strong><p>{{ selected.review }}</p></div>
        <p class="scenario-disclaimer">{{ t.disclaimer }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.playground-intro h2 { max-width: 18ch; white-space: normal; }
.scenario-workbench { --workbench-accent: #d7f43b; }
.scenario-demo-label { margin-left: auto; padding: 3px 6px; border: 1px solid #53615f; border-radius: 4px; color: #c3d0c9; font-size: .6rem; letter-spacing: .08em; }
.scenario-choices { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,.12); }
.scenario-choices button { grid-column: span 2; min-width: 0; min-height: 44px; padding: 9px 6px; border: 1px solid #53615f; border-radius: 6px; background: transparent; color: #c8d4cf; font: inherit; font-size: .8rem; font-weight: 600; cursor: pointer; }
.scenario-choices button:nth-child(n+4) { grid-column: span 3; }
.scenario-choices button[aria-pressed="true"] { color: #17242a; background: var(--workbench-accent); border-color: var(--workbench-accent); }
.scenario-choices button:hover:not([aria-pressed="true"]) { border-color: #c8d4cf; color: #fff; }
.scenario-panel { padding: 20px 26px 24px; }
.scenario-address { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 18px; color: #c5d1cb; font: .72rem ui-monospace, SFMono-Regular, Consolas, monospace; overflow-wrap: anywhere; }
.scenario-address > span { color: #96aaa2; }
.scenario-panel h3 { margin: 0 0 10px; color: #f1f4eb; font-size: 1.3rem; line-height: 1.2; letter-spacing: -.02em; }
.scenario-context { margin: 0; color: #bfcec7; font-size: .88rem; line-height: 1.6; }
.scenario-action-area { display: grid; gap: 18px; margin-top: 20px; }
.scenario-product, .scenario-order { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #415453; border-radius: 8px; background: #1a2b30; }
.scenario-product > svg { flex: 0 0 52px; width: 52px; height: 52px; padding: 6px; color: #c9d5ba; }
.scenario-product > div, .scenario-order > div { display: grid; flex: 1; min-width: 0; gap: 8px; }
.scenario-product strong, .scenario-order strong { color: #f1f4eb; font-size: .88rem; }
.scenario-product span, .scenario-order span { color: #b6c8bf; font-size: .78rem; line-height: 1.5; }
.scenario-stock { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: #b6c8bf; font-size: .78rem; }
.scenario-stock input { width: 76px; min-height: 40px; padding: 6px 8px; border: 1px solid #7b9187; border-radius: 4px; background: #17242a; color: #fff; }
.scenario-order { flex-wrap: wrap; }
.scenario-order .scenario-order-state { padding: 4px 8px; border: 1px solid #53615f; border-radius: 4px; color: #d9dfc4; }
.scenario-run { justify-self: start; min-height: 44px; max-width: 100%; background: #d7f43b; color: #17242a; font-size: .85rem; text-align: left; }
.scenario-run:disabled { opacity: .5; cursor: not-allowed; }
.scenario-access { display: flex; align-items: center; gap: 12px; color: #aebfb6; }
.scenario-access svg { width: 38px; height: 38px; }
.scenario-access span { font: 600 1.5rem ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: -.04em; }
.scenario-response { margin-top: 20px; padding: 18px; border: 1px solid #8ca86a; border-radius: 8px; background: #24362f; }
.scenario-response:focus-visible { outline: 2px solid #d7f43b; outline-offset: 3px; }
.scenario-response-error { border-color: #b59b78; background: #332f29; }
.scenario-code { color: #d7e4b6; font: .72rem ui-monospace, SFMono-Regular, Consolas, monospace; }
.scenario-response-error .scenario-code { color: #f2d2a3; }
.scenario-response h4 { margin: 12px 0 8px; color: #f1f4eb; font-size: 1.05rem; line-height: 1.3; }
.scenario-response p { margin: 0; color: #cbd7ce; font-size: .85rem; line-height: 1.6; }
.scenario-receipt { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #53615f; color: #e3ebdb; font-size: .8rem; }
.scenario-reset { display: inline-flex; gap: 8px; align-items: center; min-height: 44px; margin-top: 12px; padding: 6px 0; border: 0; background: none; color: #e4efc2; font: inherit; font-size: .8rem; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }
.scenario-review { padding: 18px 26px; border-top: 1px solid #415453; background: rgba(0,0,0,.12); }
.scenario-review strong { color: #d7e3d9; font-size: .76rem; font-weight: 600; }
.scenario-review p { margin: 7px 0 0; color: #afc3b6; font-size: .82rem; line-height: 1.6; }
.scenario-disclaimer { margin: 0; padding: 12px 26px; border-top: 1px solid #415453; color: #aebfb6; font-size: .68rem; line-height: 1.6; }
.scenario-choices button:focus-visible, .scenario-run:focus-visible, .scenario-reset:focus-visible, .scenario-stock input:focus-visible { outline: 2px solid #d7f43b; outline-offset: 3px; }
@media (max-width: 960px) {
 .scenario-choices { padding-inline: 14px; }
 .scenario-choices button { font-size: .74rem; }
 .scenario-panel, .scenario-review { padding-inline: 20px; }
 .scenario-disclaimer { padding-inline: 20px; }
}
@media (max-width: 700px) {
 .scenario-panel, .scenario-review { padding-inline: 18px; }
 .scenario-disclaimer { padding-inline: 18px; }
}
@media (max-width: 360px) {
 .scenario-choices { padding-inline: 10px; gap: 5px; }
 .scenario-choices button { font-size: .69rem; }
 .scenario-product { gap: 8px; padding: 12px; }
 .scenario-product > svg { flex-basis: 36px; width: 36px; height: 36px; padding: 3px; }
}
</style>
