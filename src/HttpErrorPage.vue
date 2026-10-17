<script setup>
import { computed } from 'vue';
import { HTTP_ERROR_CODES } from './httpErrors';

const props = defineProps({ status: { type: Number, default: 404 }, language: { type: String, default: 'es' }, preview: Boolean });
defineEmits(['navigate', 'retry']);
const base = import.meta.env.BASE_URL;
const labels = {
  es: { home: 'Volver al inicio', projects: 'Explorar proyectos', contact: 'Contactarme', retry: 'Volver a intentar', preview: 'Vista de ejemplo', examples: 'Explorar otros estados', note: 'Siempre hay un camino de vuelta.' },
  en: { home: 'Back to home', projects: 'Explore projects', contact: 'Contact me', retry: 'Try again', preview: 'Example preview', examples: 'Explore other states', note: 'There is always a way back.' },
};
const messages = {
  403: { reason: 'FORBIDDEN', es: { title: 'Esta puerta está cerrada.', text: 'Este recurso tiene acceso restringido. Podés volver al portfolio o contactarme si necesitás ayuda.' }, en: { title: 'This door is closed.', text: 'Access to this resource is restricted. You can return to the portfolio or contact me if you need help.' } },
  404: { reason: 'NOT FOUND', es: { title: 'Esta página se salió del mapa.', text: 'Puede que el enlace haya cambiado o que la dirección no exista. Mis proyectos siguen por acá.' }, en: { title: 'This page went off the map.', text: 'The link may have changed, or the address may not exist. My projects are still right here.' } },
  500: { reason: 'INTERNAL ERROR', es: { title: 'Algo se trabó por acá.', text: 'La aplicación encontró un problema inesperado. Podés intentar de nuevo o volver al inicio.' }, en: { title: 'Something got stuck here.', text: 'The application ran into an unexpected problem. You can try again or return home.' } },
  503: { reason: 'SERVICE UNAVAILABLE', es: { title: 'Una pausa en el camino.', text: 'El servicio no está disponible en este momento. Probá de nuevo más tarde o volvé al portfolio.' }, en: { title: 'A pause along the way.', text: 'The service is unavailable right now. Try again later or return to the portfolio.' } },
};
const code = computed(() => HTTP_ERROR_CODES.includes(props.status) ? props.status : 404);
const t = computed(() => labels[props.language] || labels.es);
const message = computed(() => (messages[code.value][props.language] || messages[code.value].es));
const retryable = computed(() => code.value >= 500);
</script>

<template>
  <section class="http-error-page" :data-status="code" aria-labelledby="http-error-title">
    <div class="container http-error-grid">
      <div class="http-error-art" aria-hidden="true">
        <svg class="http-error-path" viewBox="0 0 480 320" fill="none"><path d="M8 245H115V75H340V245H470" /><circle cx="115" cy="245" r="5"/><circle cx="340" cy="75" r="5"/></svg>
        <span class="http-error-code"><span v-for="(digit, index) in String(code)" :key="code + '-' + index" :style="{ '--digit-index': index }">{{ digit }}</span></span>
        <span class="http-error-reason">{{ messages[code].reason }}</span>
      </div>
      <div class="http-error-copy">
        <p class="eyebrow">HTTP / {{ code }}<span v-if="preview" class="http-error-preview">{{ t.preview }}</span></p>
        <h1 id="http-error-title" class="http-error-title" tabindex="-1">{{ message.title }}</h1>
        <p>{{ message.text }}</p>
        <div class="http-error-actions">
          <button v-if="retryable" class="button button-primary" type="button" @click="$emit('retry')">{{ t.retry }} <span aria-hidden="true">↻</span></button>
          <a v-else class="button button-primary" :href="base + '#home'" @click.prevent="$emit('navigate', 'home')">{{ t.home }} <span aria-hidden="true">↗</span></a>
          <a v-if="code === 404" class="http-error-link" :href="base + '#projects'" @click.prevent="$emit('navigate', 'projects')">{{ t.projects }} <span aria-hidden="true">→</span></a>
          <a v-else-if="code === 403" class="http-error-link" :href="base + '#contact'" @click.prevent="$emit('navigate', 'contact')">{{ t.contact }} <span aria-hidden="true">→</span></a>
          <a v-else class="http-error-link" :href="base + '#home'" @click.prevent="$emit('navigate', 'home')">{{ t.home }} <span aria-hidden="true">→</span></a>
        </div>
        <p class="http-error-note"><span aria-hidden="true"></span>{{ t.note }}</p>
      </div>
      <nav v-if="preview" class="http-error-examples" :aria-label="t.examples">
        <span>{{ t.examples }}</span>
        <a v-for="example in HTTP_ERROR_CODES" :key="example" :href="base + '#error/' + example" :aria-current="example === code ? 'page' : undefined" @click.prevent="$emit('navigate', 'error/' + example)">{{ example }}</a>
      </nav>
    </div>
  </section>
</template>
