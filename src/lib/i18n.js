// src/lib/i18n.js
export const LOCALES = ["en", "es", "pt"];
export const DEFAULT_LOCALE = "en";

export async function loadMessages(locale = DEFAULT_LOCALE) {
  try {
    // lib -> ../locales
    const messages = (await import(`../locales/${locale}.json`)).default;
    return messages;
  } catch (err) {
    // fallback seguro
    return (await import(`../locales/${DEFAULT_LOCALE}.json`)).default;
  }
}
