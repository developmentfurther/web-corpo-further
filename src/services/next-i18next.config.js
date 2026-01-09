module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es, pt"],
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
  // ⬇️ si falta una key en 'es', cae a 'en'
  fallbackLng: "en",
};
