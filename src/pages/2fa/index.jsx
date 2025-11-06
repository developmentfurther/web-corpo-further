// /pages/2fa.jsx
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import ContextGeneral from "@/services/contextGeneral";

export default function TwoFA() {
  const { user, setTwoFAStatus } = useContext(ContextGeneral);
  const router = useRouter();

  const [qr, setQr] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [has2FA, setHas2FA] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  // 🧩 Paso 1: revisar estado del 2FA
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const resStatus = await fetch(`/api/2fa/status?email=${encodeURIComponent(user.email)}`);
        const status = await resStatus.json();

        if (!status.enabled) {
          // 🚀 Generar nuevo secret y QR
          const resSetup = await fetch("/api/2fa/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });
          const data = await resSetup.json();

          if (data.qr) {
            setQr(data.qr);
            setHas2FA(false);
            setJustCreated(true);
          } else {
            setError("No se pudo generar la clave de seguridad.");
          }
        } else {
          setHas2FA(true);
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener el estado del 2FA");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, code }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Código incorrecto");
        setVerifying(false);
        return;
      }

      // ✅ Código correcto
      await fetch("/api/2fa/confirm", { method: "POST" });
      setTwoFAStatus("verified");

      setSuccessMsg("✅ Verificación exitosa. Redirigiendo al panel…");
      setTimeout(() => router.replace("/admin"), 1600);
    } catch (err) {
      console.error(err);
      setError("Error al verificar el código");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0C212D]">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-white/70 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/70">Cargando verificación…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C212D] text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-sm w-full bg-white/10 p-6 rounded-2xl border border-white/15 shadow-xl text-center"
      >
        <h1 className="text-xl font-semibold mb-3">Verificación de seguridad</h1>

        {justCreated && (
          <p className="text-green-300 text-sm mb-3">
            🔐 Nueva clave de seguridad creada correctamente.
          </p>
        )}

        {!has2FA && qr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <img
              src={qr}
              alt="QR 2FA"
              className="mx-auto w-48 h-48 rounded-md border border-white/20 mb-3"
            />
            <p className="text-sm text-white/70">
              Escaneá este código con <b>Google Authenticator</b> o <b>Authy</b> para vincular tu cuenta.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleVerify} className="space-y-3">
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center text-lg tracking-widest"
            required
            disabled={verifying}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-400 bg-red-500/10 rounded-lg p-2 text-center"
              >
                {error}
              </motion.p>
            )}
            {successMsg && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-green-400 bg-green-500/10 rounded-lg p-2 text-center"
              >
                {successMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold hover:brightness-110 transition disabled:opacity-60"
          >
            {verifying ? (
              <div className="inline-flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                Verificando…
              </div>
            ) : (
              "Verificar código"
            )}
          </button>

          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 text-sm"
            >
              ← Volver al login
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-200 text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
