<script setup>
defineProps({ content: { type: Object, required: true } });
</script>

<template>
  <section id="project-technical-case" class="technical-case" tabindex="-1" aria-labelledby="technical-case-title">
    <p class="eyebrow">{{ content.eyebrow }}</p>
    <h2 id="technical-case-title">{{ content.title }}</h2>
    <p class="technical-case-intro">{{ content.intro }}</p>
    <div class="technical-case-list">
      <details v-for="(item, index) in content.cases" :key="item.id" class="technical-case-item">
        <summary>
          <span class="technical-case-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="technical-case-summary"><strong>{{ item.title }}</strong><span>{{ item.summary }}</span></span>
          <svg class="technical-case-toggle" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>
        </summary>
        <div class="technical-case-body">
          <div class="technical-case-tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
          <p v-if="item.intro" class="technical-case-intro">{{ item.intro }}</p>
          <ol v-if="item.flow" class="technical-case-flow" :aria-label="item.flowLabel"><li v-for="step in item.flow" :key="step">{{ step }}</li></ol>
          <div v-for="section in item.sections" :key="section.title" class="technical-case-section">
            <h3>{{ section.title }}</h3>
            <p v-if="section.body">{{ section.body }}</p>
            <ul v-if="section.items"><li v-for="point in section.items" :key="point">{{ point }}</li></ul>
          </div>
        </div>
      </details>
    </div>
    <div v-for="section in content.sections" :key="section.title" class="technical-case-section technical-case-practice">
      <h3>{{ section.title }}</h3>
      <p v-if="section.body">{{ section.body }}</p>
      <ol v-if="section.items"><li v-for="point in section.items" :key="point">{{ point }}</li></ol>
    </div>
  </section>
</template>

<style scoped>
.technical-case:focus { outline: none; }
.technical-case { min-width: 0; scroll-margin-top: 96px; margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--line); }
.technical-case > .eyebrow { margin: 0 0 12px; }
.technical-case h2 { margin: 0 0 16px; color: var(--ink); font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.15; letter-spacing: -.035em; }
.technical-case-intro { margin: 0; }
.technical-case-list { display: grid; gap: 12px; margin-top: 28px; }
.technical-case-item { min-width: 0; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); overflow: clip; }
.technical-case-item > summary { display: grid; grid-template-columns: 24px minmax(0, 1fr) 20px; align-items: start; gap: 14px; padding: 22px; cursor: pointer; list-style: none; }
.technical-case-item > summary::-webkit-details-marker { display: none; }
.technical-case-item > summary::marker { content: ''; }
.technical-case-item > summary:focus-visible { outline: 2px solid #749b2e; outline-offset: -4px; border-radius: 10px; }
.technical-case-number { padding-top: 3px; color: var(--muted); font-size: .75rem; font-variant-numeric: tabular-nums; }
.technical-case-summary { display: grid; gap: 8px; min-width: 0; }
.technical-case-summary strong { color: var(--ink); font-size: 1.05rem; line-height: 1.4; letter-spacing: -.015em; }
.technical-case-summary > span { color: var(--muted); font-size: .85rem; line-height: 1.6; }
.technical-case-toggle { width: 20px; height: 20px; margin-top: 2px; color: var(--ink); transition: transform .2s ease; }
.technical-case-item[open] .technical-case-toggle { transform: rotate(45deg); }
.technical-case-body { padding: 0 22px 24px; border-top: 1px solid var(--line); }
.technical-case-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
.technical-case-tags > span { padding: 4px 9px; border: 1px solid var(--line); border-radius: 4px; color: var(--muted); font-size: .7rem; line-height: 1.5; }
.technical-case-flow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin: 24px 0 28px; padding: 0; list-style: none; }
.technical-case-flow li { position: relative; display: grid; align-items: center; min-width: 0; min-height: 82px; padding: 14px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--soft); color: var(--ink); font-size: .78rem; font-weight: 600; line-height: 1.5; text-align: center; }
.technical-case-flow li:not(:last-child)::after { position: absolute; right: -19px; top: 50%; content: '→'; color: var(--muted); transform: translateY(-50%); font-size: 1rem; }
.technical-case-section { margin-top: 24px; }
.technical-case-section h3 { margin: 0 0 8px; color: var(--ink); font-size: 1rem; line-height: 1.4; }
.technical-case-section p { margin: 0; }
.technical-case-section :is(ul, ol) { display: grid; gap: 8px; margin: 0; padding-left: 20px; color: var(--muted); font-size: .95rem; line-height: 1.7; }
.technical-case-practice { padding-top: 24px; border-top: 1px solid var(--line); }
@media (max-width: 700px) {
 .technical-case { margin-top: 32px; padding-top: 24px; }
 .technical-case-item > summary { grid-template-columns: 20px minmax(0, 1fr) 18px; gap: 10px; padding: 18px 14px; }
 .technical-case-body { padding: 0 14px 20px; }
 .technical-case-flow { grid-template-columns: minmax(0, 1fr); gap: 24px; }
 .technical-case-flow li { min-height: 58px; padding: 12px 16px; }
 .technical-case-flow li:not(:last-child)::after { right: 50%; top: auto; bottom: -24px; content: '↓'; transform: translateX(50%); }
}
@media (prefers-reduced-motion: reduce) { .technical-case-toggle { transition: none; } }
</style>
