// Preferences are optional: blocked or corrupted browser storage must not prevent rendering.
function readStored(key, storage) {
  try { return (storage ?? globalThis.localStorage)?.getItem(key); }
  catch { return null; }
}

export function readLanguage(storage) {
  const value = readStored('language', storage);
  return value === 'en' ? 'en' : 'es';
}

export function readTheme(storage) {
  const stored = readStored('darkMode', storage);
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  try {
    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  } catch {
    return true;
  }
}

export function savePreference(key, value, storage) {
  if (key === 'language' && !['es', 'en'].includes(value)) return false;
  if (key === 'darkMode' && !['true', 'false'].includes(value)) return false;
  if (!['language', 'darkMode'].includes(key)) return false;
  try { (storage ?? globalThis.localStorage)?.setItem(key, value); return true; }
  catch { return false; }
}
