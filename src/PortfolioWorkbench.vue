<script setup>
import { computed, ref } from 'vue';

const props = defineProps({ language: { type: String, default: 'es' } });
const active = ref(0);
const copy = {
  es: {
    eyebrow: 'Una forma de conectar las piezas',
    title: 'Un producto.\nTres miradas.',
    intro: 'Una buena web se piensa desde lo que necesita la gente hasta lo que pasa detrás de cada clic.',
    prompt: 'Elegí una mirada y explorá.',
    group: 'Explorar mi forma de trabajar',
    illustration: 'Representación conceptual de una aplicación web',
    interface: 'Experiencia', logic: 'Lógica', delivery: 'Evolución',
    steps: [
      { label: 'Producto', number: '01', title: 'Primero, entender para quién.', text: 'Qué necesita hacer la persona, dónde se traba y cómo simplificarle el camino. Diseño e implementación tienen que responder a eso.', tags: ['UX / UI', 'Interacciones', 'Responsive'], note: 'De la necesidad a una interfaz clara.' },
      { label: 'Desarrollo', number: '02', title: 'Conectar lo que se ve con lo que sucede.', text: 'La interfaz es una parte. Detrás están la lógica del negocio, los datos y las APIs que hacen que el producto funcione.', tags: ['Frontend', 'Backend', 'APIs y datos'], note: 'Cada interacción tiene una lógica detrás.' },
      { label: 'Evolución', number: '03', title: 'Publicar es el comienzo.', text: 'Escuchar el uso real, resolver problemas y seguir mejorando. Es el recorrido que hago actualmente con el equipo de VendoAlgo.', tags: ['Feedback', 'Mantenimiento', 'Mejora continua'], note: 'Del lanzamiento al uso real.' },
    ],
  },
  en: {
    eyebrow: 'Connecting the pieces',
    title: 'One product.\nThree perspectives.',
    intro: 'A good website starts with what people need and connects it to everything behind each click.',
    prompt: 'Pick a perspective and explore.',
    group: 'Explore how I work',
    illustration: 'Conceptual illustration of a web application',
    interface: 'Experience', logic: 'Logic', delivery: 'Evolution',
    steps: [
      { label: 'Product', number: '01', title: 'Start with the people using it.', text: 'What they need to do, where they get stuck and how to make the next step clearer. Design and implementation should serve that purpose.', tags: ['UX / UI', 'Interactions', 'Responsive'], note: 'From a need to a clear interface.' },
      { label: 'Development', number: '02', title: 'Connect what you see to what happens.', text: 'The interface is one part. Behind it are the business logic, data and APIs that make the product work.', tags: ['Frontend', 'Backend', 'APIs and data'], note: 'Every interaction has logic behind it.' },
      { label: 'Evolution', number: '03', title: 'Publishing is the beginning.', text: 'Listen to real usage, solve problems and keep improving. That is the ongoing work I do with the VendoAlgo team.', tags: ['Feedback', 'Maintenance', 'Continuous improvement'], note: 'From launch to real use.' },
    ],
  },
};
const t = computed(() => copy[props.language] || copy.es);
const selected = computed(() => t.value.steps[active.value]);
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
      <div class="workbench" :data-step="active">
        <div class="workbench-topbar"><span class="workbench-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>pedro / {{ t.steps[active].label.toLowerCase() }}</span><span class="workbench-index" aria-hidden="true">{{ selected.number }} / 03</span></div>
        <div class="workbench-choices" role="group" :aria-label="t.group">
          <button v-for="(step, index) in t.steps" :key="index" type="button" :aria-pressed="active === index" @click="active = index"><span>{{ step.number }}</span>{{ step.label }}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 13 13 3M3 3h10v10"/></svg></button>
        </div>
        <div class="workbench-scene" aria-hidden="true">
          <svg class="workbench-wires" viewBox="0 0 600 200" preserveAspectRatio="none"><path class="workbench-wire" d="M110 78H300V133H490V78"/><path class="workbench-signal" :key="active" d="M110 78H300V133H490V78"/></svg>
          <div class="workbench-node node-interface" :class="{ 'node-selected': active === 0 }"><span class="node-index">01 / {{ t.interface }}</span><div class="mini-browser"><div class="mini-browser-head"><i></i><i></i><i></i></div><div class="mini-browser-content"><span></span><span></span><div><i></i><i></i><i></i></div></div></div></div>
          <div class="workbench-node node-logic" :class="{ 'node-selected': active === 1 }"><span class="node-index">02 / {{ t.logic }}</span><svg class="node-logic-icon" viewBox="0 0 80 64" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="15" y="9" width="50" height="14" rx="3"/><rect x="15" y="29" width="50" height="14" rx="3"/><path d="M40 43v11M26 54h28M22 16h2m-2 20h2m6-20h26m-26 20h26"/></svg></div>
          <div class="workbench-node node-delivery" :class="{ 'node-selected': active === 2 }"><span class="node-index">03 / {{ t.delivery }}</span><svg class="node-delivery-icon" viewBox="0 0 80 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 45V19m0 26h48M24 37l12-12 10 6 14-17"/><path d="M50 14h10v10"/><circle cx="24" cy="37" r="3"/><circle cx="36" cy="25" r="3"/><circle cx="46" cy="31" r="3"/></svg></div>
        </div>
        <div class="workbench-copy" aria-live="polite" aria-atomic="true">
          <Transition name="workbench-copy" mode="out-in">
            <div :key="active">
              <h3>{{ selected.title }}</h3>
              <p>{{ selected.text }}</p>
              <div class="workbench-tags"><span v-for="tag in selected.tags" :key="tag">{{ tag }}</span></div>
            </div>
          </Transition>
        </div>
        <div class="workbench-bottom"><span class="workbench-status" aria-hidden="true"></span>{{ selected.note }}</div>
      </div>
    </div>
  </section>
</template>
