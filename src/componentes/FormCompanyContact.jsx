import { useState } from "react";

export default function FormCompanyContact({ messages }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", error: "" });

  // Usar las keys correctas de i18n
  const contactForm = messages?.contact?.form || {};
  const contactErrors = messages?.contact?.errors || {};
  const commonForms = messages?.common?.forms || {};
  const corporateForm = messages?.corporate?.form || {};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones con mensajes del i18n
    if (!form.name) {
      return setStatus({ 
        state: "error", 
        error: contactErrors.name || "Por favor completa tu nombre." 
      });
    }
    
    if (!form.email) {
      return setStatus({ 
        state: "error", 
        error: commonForms.invalidEmail || "Por favor ingresa un email válido." 
      });
    }
    
    if (!form.company) {
      return setStatus({ 
        state: "error", 
        error: "Por favor ingresa el nombre de tu empresa." 
      });
    }

    try {
      setStatus({ state: "sending", error: "" });
      
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          formType: "empresas",
          origin: "Further Corporate Landing",
        }),
      });

      if (!res.ok) throw new Error("Error");
      
      setStatus({ state: "success", error: "" });
      setForm({ name: "", email: "", company: "", phone: "", message: "" });
      
    } catch (err) {
      setStatus({ 
        state: "error", 
        error: commonForms.error || "Hubo un error al enviar." 
      });
    }
  };

  // ESTILOS DE TU MARCA: Fondo #0C212D, Borde tenue, Focus Naranja
  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-[#0C212D] border border-white/10 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#EE7203] focus:border-[#EE7203] transition-all";

  if (status.state === "success") {
    return (
      <div className="bg-[#0C212D] border border-[#EE7203]/30 rounded-2xl p-8 text-center animate-in fade-in">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#EE7203]/20 to-[#FF3816]/20 text-3xl">
          ✓
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          ¡Solicitud Enviada!
        </h3>
        <p className="text-white/70">
          {commonForms.thanks || "Gracias, nos pondremos en contacto pronto."}
        </p>
        <button 
          onClick={() => setStatus({ state: "idle", error: "" })}
          className="mt-6 text-sm text-[#EE7203] hover:text-[#FF3816] font-semibold underline decoration-2 underline-offset-4 transition-colors"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Nombre del Contacto */}
      <div>
        <label htmlFor="company-name" className="sr-only">
          {contactForm.fields?.name?.label || "Nombre completo"}
        </label>
        <input
          id="company-name"
          name="name"
          type="text"
          placeholder={contactForm.fields?.name?.placeholder || "Juan Pérez"}
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Email Corporativo */}
        <div>
          <label htmlFor="company-email" className="sr-only">
            {contactForm.fields?.email?.label || "Email"}
          </label>
          <input
            id="company-email"
            name="email"
            type="email"
            placeholder={contactForm.fields?.email?.placeholder || "tu@empresa.com"}
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="company-phone" className="sr-only">
            {messages?.formPlaceholders?.phone || "Teléfono"}
          </label>
          <input
            id="company-phone"
            name="phone"
            type="tel"
            placeholder={messages?.formPlaceholders?.phone || "Teléfono / WhatsApp"}
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Nombre de la Empresa (Campo clave para B2B) */}
      <div>
        <label htmlFor="company-company" className="sr-only">
          {contactForm.fields?.company?.label || "Empresa"}
        </label>
        <input
          id="company-company"
          name="company"
          type="text"
          placeholder={contactForm.fields?.company?.placeholder || "Nombre de la empresa"}
          value={form.company}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Mensaje / Necesidades */}
      <div>
        <label htmlFor="company-message" className="sr-only">
          {contactForm.fields?.message?.label || "Mensaje"}
        </label>
        <textarea
          id="company-message"
          name="message"
          rows={4}
          placeholder={contactForm.fields?.message?.placeholder || messages?.formPlaceholders?.message || "¿Cómo podemos ayudarte?"}
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Mensaje de Error */}
      {status.state === "error" && (
        <div className="text-[#FF3816] text-sm bg-[#FF3816]/10 p-4 rounded-xl border border-[#FF3816]/20 flex items-start gap-3">
          <span className="text-lg leading-none flex-shrink-0">⚠</span>
          <span>{status.error}</span>
        </div>
      )}

      

      {/* Botón Submit con gradiente corporativo */}
      <button
        type="submit"
        disabled={status.state === "sending"}
        className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] hover:brightness-110 hover:shadow-xl hover:shadow-[#EE7203]/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#EE7203]/20"
      >
        {status.state === "sending" 
          ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">◌</span>
              {commonForms.sending || "Enviando..."}
            </span>
          ) 
          : (contactForm.cta || commonForms.ctaSend || "Enviar")}
      </button>

      {/* Consentimiento */}
      {/* <p className="text-center text-xs text-white/40 mt-3 leading-relaxed">
        {corporateForm.fields?.consent || messages?.contact?.consent?.help || "Tus datos están protegidos y solo serán usados para responder esta consulta."}
      </p> */}
    </form>
  );
}