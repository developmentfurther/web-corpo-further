"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

/* ===== Tokens coherentes con /contact ===== */
const CARD_LIGHT =
  "rounded-[2rem] border border-gray-200 bg-white shadow-sm";
const INPUT =
  "w-full rounded-xl bg-white border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300 text-gray-900 placeholder:text-gray-500";

export default function HomeContactForm() {
  const t = useTranslations("contact");
  const common = useTranslations("common");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    accept: false,
  });
  const [status, setStatus] = useState({ state: "idle", error: "" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name?.trim())
      return setStatus({ state: "error", error: t("errors.name") });
    if (!emailRegex.test(form.email || ""))
      return setStatus({
        state: "error",
        error: common("forms.invalidEmail"),
      });
    if (!form.message?.trim())
      return setStatus({ state: "error", error: t("errors.message") });
    if (!form.accept)
      return setStatus({ state: "error", error: t("errors.consent") });

    try {
      setStatus({ state: "sending", error: "" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus({ state: "success", error: "" });
      setForm({ name: "", email: "", company: "", message: "", accept: false });
    } catch {
      setStatus({ state: "error", error: common("forms.error") });
    }
  }

  /* === Animación al scrollear === */
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="home-contact"
      className="bg-[#0A1628] text-white py-20 px-6 overflow-hidden"
      ref={ref}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            : {}
        }
        className="max-w-4xl mx-auto space-y-10"
      >
        {/* === Título === */}
        <div className="text-center" id="h2-anchor">
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
              {t("ctaFinal.title")}
            </span>
          </h2>
          <p className="text-white/80">{t("ctaFinal.body")}</p>
        </div>

        {/* === Formulario === */}
        <motion.form
          onSubmit={onSubmit}
          noValidate
          className={`${CARD_LIGHT} p-6 md:p-8 bg-white text-gray-900`}
          aria-describedby="form-status"
          initial={{ opacity: 0, y: 40 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.9, ease: "easeOut" } }
              : {}
          }
        >
          <h2
            id="contact-form-title"
            className="text-2xl font-bold mb-6 text-gray-900"
          >
            {t("form.title")}
          </h2>

          {/* Estado accesible */}
          <div id="form-status" aria-live="polite" className="sr-only">
            {status.state === "sending"
              ? common("forms.sending")
              : status.state === "success"
              ? common("forms.thanks")
              : status.error}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-1 text-gray-900"
              >
                {t("form.fields.name.label")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder={t("form.fields.name.placeholder")}
                className={INPUT}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1 text-gray-900"
              >
                {t("form.fields.email.label")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder={common("forms.emailPlaceholder")}
                className={INPUT}
              />
            </div>

            {/* Empresa */}
            <div className="md:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold mb-1 text-gray-900"
              >
                {t("form.fields.company.label")}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={onChange}
                placeholder={t("form.fields.company.placeholder")}
                className={INPUT}
              />
            </div>

            {/* Mensaje */}
            <div className="md:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-1 text-gray-900"
              >
                {t("form.fields.message.label")}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={onChange}
                placeholder={t("form.fields.message.placeholder")}
                className={INPUT + " resize-y"}
              />
            </div>

            {/* Consentimiento */}
            <div className="md:col-span-2 flex items-start gap-3">
              <input
                id="accept"
                name="accept"
                type="checkbox"
                checked={form.accept}
                onChange={onChange}
                className="mt-1 h-5 w-5 rounded border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-gray-300"
              />
              <label htmlFor="accept" className="text-sm text-gray-700">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("consent.label"),
                  }}
                />
              </label>
            </div>
            <p
              id="consent-desc"
              className="md:col-span-2 text-xs text-gray-600"
            >
              {t("consent.help")}
            </p>
          </div>

          {/* Mensajes visibles */}
          {status.state === "error" && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {status.error}
            </div>
          )}
          {status.state === "success" && (
            <div
              role="status"
              className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              {common("forms.thanks")}
            </div>
          )}

          {/* Botones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status.state === "sending"}
              className="relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-[#EE7203] hover:bg-[#FF3816] transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-70"
            >
              {status.state === "sending"
                ? common("forms.sending")
                : t("form.cta")}
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-gray-900 border border-gray-200 bg-white hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              {t("form.secondary")}
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
