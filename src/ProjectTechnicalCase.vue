<script setup>
defineProps({ content: { type: Object, required: true } });
</script>

<template>
  <section id="project-technical-case" class="technical-case" tabindex="-1" aria-labelledby="technical-case-title">
    <p class="eyebrow">{{ content.eyebrow }}</p>
    <h2 id="technical-case-title">{{ content.title }}</h2>
    <p class="technical-case-intro">{{ content.intro }}</p>
    <ol class="technical-case-flow" :aria-label="content.flowLabel"><li v-for="step in content.flow" :key="step">{{ step }}</li></ol>
    <div v-for="section in content.sections" :key="section.title" class="technical-case-section">
      <h3>{{ section.title }}</h3>
      <p v-if="section.body">{{ section.body }}</p>
      <ul v-if="section.items"><li v-for="item in section.items" :key="item">{{ item }}</li></ul>
    </div>
  </section>
</template>

<style scoped>
.technical-case:focus { outline: none; }
.technical-case { scroll-margin-top: 96px; margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--line); }
.technical-case > .eyebrow { margin: 0 0 12px; }
.technical-case h2 { margin: 0 0 16px; color: var(--ink); font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.15; letter-spacing: -.035em; }
.technical-case-intro { margin: 0; }
.technical-case-flow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin: 24px 0 32px; padding: 0; list-style: none; }
.technical-case-flow li { position: relative; display: grid; align-items: center; min-width: 0; min-height: 82px; padding: 14px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--soft); color: var(--ink); font-size: .78rem; font-weight: 600; line-height: 1.5; text-align: center; }
.technical-case-flow li:not(:last-child)::after { position: absolute; right: -19px; top: 50%; content: '→'; color: var(--muted); transform: translateY(-50%); font-size: 1rem; }
.technical-case-section { margin-top: 24px; }
.technical-case-section h3 { margin: 0 0 8px; color: var(--ink); font-size: 1rem; line-height: 1.4; }
.technical-case-section p { margin: 0; }
.technical-case-section ul { display: grid; gap: 8px; margin: 0; padding-left: 20px; color: var(--muted); font-size: .95rem; line-height: 1.7; }
@media (max-width: 700px) {
 .technical-case { margin-top: 32px; padding-top: 24px; }
 .technical-case-flow { grid-template-columns: minmax(0, 1fr); gap: 24px; }
 .technical-case-flow li { min-height: 58px; padding: 12px 16px; }
 .technical-case-flow li:not(:last-child)::after { right: 50%; top: auto; bottom: -24px; content: '↓'; transform: translateX(50%); }
}
</style>
