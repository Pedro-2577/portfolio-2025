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
  return readStored('darkMode', storage) === 'true';
}

export function savePreference(key, value, storage) {
  if (key === 'language' && !['es', 'en'].includes(value)) return false;
  if (key === 'darkMode' && !['true', 'false'].includes(value)) return false;
  if (!['language', 'darkMode'].includes(key)) return false;
  try { (storage ?? globalThis.localStorage)?.setItem(key, value); return true; }
  catch { return false; }
}
