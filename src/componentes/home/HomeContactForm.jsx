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
  className="relative bg-gradient-to-b from-[#0A1628] via-[#0C212D] to-[#0C212D] text-white py-24 px-6 overflow-hidden"
  ref={ref}
>
  {/* ==== Glow y ondas sutiles ==== */}
  <div
    aria-hidden
    className="absolute inset-0 "
  />

  {/* ==== Contenedor principal ==== */}
  <motion.div
    initial={{ opacity: 0, y: 80 }}
    animate={
      isInView
        ? {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }
        : {}
    }
    className="relative max-w-4xl mx-auto space-y-12 z-10"
  >
    {/* === Título === */}
    <div className="text-center" id="h2-anchor">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
        <span className="bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(255,56,22,0.4)]">
          {t("ctaFinal.title")}
        </span>
      </h2>
      <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
        {t("ctaFinal.body")}
      </p>
    </div>

    {/* === Formulario === */}
    <motion.form
      onSubmit={onSubmit}
      noValidate
      className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)]"
      aria-describedby="form-status"
      initial={{ opacity: 0, y: 40 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.9, ease: 'easeOut' },
            }
          : {}
      }
    >
      {/* Halo decorativo */}
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-tr from-[#EE7203] to-[#FF3816] blur-3xl opacity-25"
      />

      <h2
        id="contact-form-title"
        className="text-2xl font-bold mb-6 text-white"
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

      {/* === Campos === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold mb-2 text-white/90"
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
            className="w-full rounded-2xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#EE7203]/60 focus:border-[#EE7203]/60 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold mb-2 text-white/90"
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
            className="w-full rounded-2xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#EE7203]/60 focus:border-[#EE7203]/60 transition"
          />
        </div>

        {/* Empresa */}
        <div className="md:col-span-2">
          <label
            htmlFor="company"
            className="block text-sm font-semibold mb-2 text-white/90"
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
            className="w-full rounded-2xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#EE7203]/60 focus:border-[#EE7203]/60 transition"
          />
        </div>

        {/* Mensaje */}
        <div className="md:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-semibold mb-2 text-white/90"
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
            className="w-full rounded-2xl bg-white/5 border border-white/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#EE7203]/60 focus:border-[#EE7203]/60 resize-y transition"
          />
        </div>

        {/* Consentimiento */}
        <div className="md:col-span-2 flex items-start gap-3 mt-2">
          <input
            id="accept"
            name="accept"
            type="checkbox"
            checked={form.accept}
            onChange={onChange}
            className="mt-1 h-5 w-5 rounded-md border border-white/30 bg-white/10 text-[#EE7203] focus:ring-[#EE7203]/60"
          />
          <label htmlFor="accept" className="text-sm text-white/80">
            <span
              dangerouslySetInnerHTML={{
                __html: t("consent.label"),
              }}
            />
          </label>
        </div>
        <p className="md:col-span-2 text-xs text-white/50 mt-1">
          {t("consent.help")}
        </p>
      </div>

      {/* Mensajes visibles */}
      {status.state === "error" && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {status.error}
        </div>
      )}
      {status.state === "success" && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
        >
          {common("forms.thanks")}
        </div>
      )}

      {/* Botones */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] hover:brightness-110 active:scale-[.98] focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 transition"
        >
          {status.state === "sending"
            ? common("forms.sending")
            : t("form.cta")}
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white/90 border border-white/20 hover:bg-white/10 transition"
        >
          {t("form.secondary")}
        </Link>
      </div>
    </motion.form>
  </motion.div>
</section>

  );
}
