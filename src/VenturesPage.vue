<script setup>
import { vReveal } from './portfolioMotion';
defineProps({ language: { type: String, default: 'es' } });
const emit = defineEmits(['navigate']);
</script>

<template>
  <section class="section page-section ventures-page">
    <div class="container">
      <header class="ventures-intro" v-reveal>
        <p class="eyebrow">{{ language === 'es' ? 'PROYECTOS PROPIOS' : 'MY OWN INITIATIVES' }}</p>
        <h1>{{ language === 'es' ? 'Mis emprendimientos' : 'My ventures' }}</h1>
        <p>{{ language === 'es' ? 'Tres proyectos en los que estoy trabajando. Acá podés conocer de qué se trata cada uno.' : 'Three ventures I am working on. Here is a short introduction to each one.' }}</p>
      </header>

      <div class="ventures-grid">
        <article class="venture-card" v-reveal>
          <div class="venture-art venture-art-services" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 32h52l-6-15H20l-6 15Z"/><path d="M14 32v5a7 7 0 0 0 13 4 7 7 0 0 0 13 0 7 7 0 0 0 13 0 7 7 0 0 0 13-4v-5M20 45v19h40V45M34 64V49h13v15"/><path d="m27 32 3-15m10 15V17m13 15-3-15"/></svg>
          </div>
          <div class="venture-content">
            <span class="venture-status venture-status-live">{{ language === 'es' ? 'Servicio' : 'Service' }}</span>
            <h2>{{ language === 'es' ? 'Gestión de tiendas' : 'Store management' }}</h2>
            <p>{{ language === 'es' ? 'Te ayudo a crear tu tienda en VendoAlgo y a mantenerla al día: productos, precios, envíos y ayuda cuando la necesites.' : 'I help you create and maintain your VendoAlgo store: products, prices, shipping and day-to-day support.' }}</p>
            <a class="button button-primary" href="#services" @click.prevent="emit('navigate', 'services')">{{ language === 'es' ? 'Conocer el servicio' : 'Explore the service' }} <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="venture-card venture-card-locked" v-reveal="65" aria-labelledby="venture-citarme-title">
          <div class="venture-art venture-art-calendar" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="20" width="48" height="44" rx="6"/><path d="M16 33h48M28 15v12m24-12v12M27 44h5m10 0h5m-20 10h5"/><circle cx="51" cy="53" r="7"/><path d="m48 53 2 2 4-4"/></svg>
          </div>
          <div class="venture-content">
            <span class="venture-status"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg>{{ language === 'es' ? 'En desarrollo' : 'In development' }}</span>
            <h2 id="venture-citarme-title">citARme</h2>
            <p>{{ language === 'es' ? 'Mi proyecto para organizar turnos y reservas. Estoy trabajando en él y todavía no está disponible para visitar.' : 'My project for organizing appointments and bookings. It is still in development and is not available to visit yet.' }}</p>
            <span class="venture-locked-action" aria-disabled="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg>{{ language === 'es' ? 'Disponible más adelante' : 'Available later' }}</span>
          </div>
        </article>

        <article class="venture-card venture-card-locked" v-reveal="130" aria-labelledby="venture-tiendarg-title">
          <div class="venture-art venture-art-shop" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m24 30 4-12h24l4 12M18 30h44l-4 34H22l-4-34Z"/><path d="M29 36v5a11 11 0 0 0 22 0v-5"/><path d="M32 18v-3m16 3v-3"/></svg>
          </div>
          <div class="venture-content">
            <span class="venture-status"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg>{{ language === 'es' ? 'En desarrollo' : 'In development' }}</span>
            <h2 id="venture-tiendarg-title">TiendARG</h2>
            <p>{{ language === 'es' ? 'Mi proyecto de tienda online. Estoy preparando la tienda antes de presentarla y habilitar el acceso.' : 'My online store venture. I am preparing the store before introducing it and opening access.' }}</p>
            <span class="venture-locked-action" aria-disabled="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8"/></svg>{{ language === 'es' ? 'Disponible más adelante' : 'Available later' }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ventures-intro { max-width: 650px; margin-bottom: 36px; }
.ventures-intro h1 { overflow-wrap: anywhere; font-size: clamp(2.3rem, 5vw, 4rem); margin: 8px 0 20px; line-height: 1.05; letter-spacing: -.055em; }
.ventures-intro > p:last-child { color: var(--muted); line-height: 1.7; font-size: 1.05rem; }
.ventures-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.venture-card { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--surface); }
.venture-art { min-height: 168px; display: grid; place-items: center; }
.venture-art svg { width: 82px; height: 82px; }
.venture-art-services { background: #173e43; color: #d7f43b; }
.venture-art-calendar { background: #e6edf5; color: #354c79; }
.venture-art-shop { background: #f0eade; color: #78613b; }
.venture-content { display: flex; flex: 1; flex-direction: column; align-items: flex-start; padding: 26px; }
.venture-status { display: inline-flex; align-items: center; gap: 6px; font-size: .77rem; font-weight: 600; color: var(--muted); }
.venture-status svg, .venture-locked-action svg { width: 16px; height: 16px; flex-shrink: 0; }
.venture-status-live { color: #496c2c; }
.dark .venture-status-live { color: var(--accent); }
.venture-content h2 { font-size: 1.45rem; letter-spacing: -.035em; line-height: 1.25; margin: 12px 0; }
.venture-content > p { margin: 0 0 26px; color: var(--muted); font-size: .94rem; line-height: 1.7; }
.venture-content .button { margin-top: auto; min-height: 46px; font-size: .85rem; white-space: normal; }
.venture-locked-action { display: inline-flex; align-items: center; gap: 8px; margin-top: auto; min-height: 46px; padding: 10px 0; color: var(--muted); font-size: .85rem; }
.venture-content a:focus-visible { outline: 3px solid #749b2e; outline-offset: 4px; }
@media(max-width: 1000px) { .ventures-grid { grid-template-columns: 1fr; } .venture-card { display: grid; grid-template-columns: 180px minmax(0, 1fr); } }
@media(max-width: 550px) { .venture-card { display: flex; } .venture-art { min-height: 140px; } .venture-content { padding: 22px; } .ventures-intro { margin-bottom: 28px; } }
</style>
