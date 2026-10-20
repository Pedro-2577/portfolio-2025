// Optional browser draft. Prices and contact messages are never persisted.
const DRAFT_KEY = 'portfolio.store-services.draft.v1';
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const oneOf = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
const knownIds = (value, allowed) => Array.isArray(value) ? [...new Set(value.filter(id => allowed.includes(id)))] : [];

export function readServiceDraft(schema, storage) {
  try {
    const raw = (storage ?? globalThis.localStorage)?.getItem(DRAFT_KEY);
    if (!raw || raw.length > 20000) return null;
    const data = JSON.parse(raw);
    if (!isRecord(data) || data.version !== 1 || !isRecord(data.answers)) return null;
    const answers = Object.fromEntries(schema.questions.map(question => {
      // Previous completed drafts stored product count separately from the questionnaire.
      const savedAnswer = question.id === 'catalogSize' && data.answers.catalogSize === undefined && data.completed === true
        ? data.catalogSize : data.answers[question.id];
      return [question.id, oneOf(savedAnswer, question.options.map(option => option.id), '')];
    }));
    const firstUnanswered = schema.questions.findIndex(question => !answers[question.id]);
    const complete = firstUnanswered === -1;
    const lastReachable = complete ? schema.questions.length - 1 : firstUnanswered;
    const step = !complete && data.completed === true ? firstUnanswered
      : Number.isInteger(data.step) ? Math.max(0, Math.min(data.step, lastReachable)) : lastReachable;
    let selected = knownIds(data.selected, schema.services);
    // Preserve the same mutually exclusive alternatives as the checkbox controls.
    if (selected.includes('migration')) selected = selected.filter(id => id !== 'catalog');
    if (selected.includes('design')) selected = selected.filter(id => id !== 'visual-changes');
    return {
      answers,
      step,
      completed: complete && data.completed === true,
      selected,
      modules: knownIds(data.modules, schema.modules),
      catalogSize: oneOf(answers.catalogSize || data.catalogSize, ['unsure', 'upto50', 'over50'], 'unsure'),
      platform: oneOf(data.platform, ['unsure', 'free', 'pro'], 'unsure'),
      expanded: data.expanded === true,
      expandedGroups: Object.fromEntries(schema.groups.map(id => [id, data.expandedGroups?.[id] === true])),
    };
  } catch {
    return null;
  }
}

export function saveServiceDraft(draft, storage) {
  try {
    (storage ?? globalThis.localStorage)?.setItem(DRAFT_KEY, JSON.stringify({ ...draft, version: 1 }));
  } catch {
    // Browsing and requesting a quote still work when storage is blocked or full.
  }
}

export function clearServiceDraft(storage) {
  try { (storage ?? globalThis.localStorage)?.removeItem(DRAFT_KEY); }
  catch { /* Reset the on-screen form even if browser storage is unavailable. */ }
}
