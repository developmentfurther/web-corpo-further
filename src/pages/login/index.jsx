import { useContext, useMemo, useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import ContextGeneral from "@/services/contextGeneral";

const ADMIN_PATH = "/admin";

export default function Login() {
  const { auth, user, ready, userProfile } = useContext(ContextGeneral);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =======================================================
     Verificación si el usuario actual es admin
     ======================================================= */
  const isAdmin = useMemo(() => {
    if (!ready) return false;
    const p = userProfile || {};
    return (
      p?.roles?.admin === true ||
      p?.admin === true ||
      p?.isAdmin === true ||
      p?.is_admin === true ||
      (typeof p?.role === "string" && p.role.toLowerCase() === "admin") ||
      (Array.isArray(p?.roles) &&
        p.roles.map((r) => String(r).toLowerCase()).includes("admin")) ||
      p?.permisos?.admin === true
    );
  }, [ready, userProfile]);

  /* =======================================================
     Si ya hay sesión válida → redirigir al panel
     ======================================================= */
  useEffect(() => {
    if (ready && user && isAdmin) {
      router.replace(ADMIN_PATH);
    }
  }, [ready, user, isAdmin, router]);

  /* =======================================================
     LOGIN + verificación 2FA
     ======================================================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Login con Firebase
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // 2️⃣ Obtener token y crear sesión
      const idToken = await userCred.user.getIdToken();
      await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      // 3️⃣ Verificar estado de 2FA
      const res2fa = await fetch(
        `/api/2fa/status?email=${encodeURIComponent(userCred.user.email)}`
      );
      const data2fa = await res2fa.json();

      // 4️⃣ Si 2FA está habilitado pero no verificado → ir a /2fa
      if (data2fa.enabled && !data2fa.verified) {
        router.replace("/2fa");
        return;
      }

      // 5️⃣ Si no es admin → error
      if (!isAdmin) {
        setError("No tenés permisos para acceder al panel.");
        return;
      }

      // 6️⃣ Todo OK → ir al admin
      router.replace(ADMIN_PATH);
    } catch (err) {
      console.error("Error en login:", err);
      const code = err?.code || "";
      if (code === "auth/user-not-found") setError("Usuario no registrado");
      else if (code === "auth/wrong-password") setError("Contraseña incorrecta");
      else if (code === "auth/too-many-requests")
        setError("Demasiados intentos. Probá más tarde.");
      else setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0C212D]">
      {/* Fondo con gradientes suaves */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_10%_10%,rgba(238,114,3,.25),transparent),radial-gradient(40%_30%_at_90%_20%,rgba(255,56,22,.22),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(255,255,255,.06),transparent)]" />

      <div className="relative max-w-md mx-auto px-5 py-10 min-h-screen flex items-center">
        <div className="w-full">
          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <h1 className="text-xl font-semibold text-white tracking-tight text-center">
                Iniciar sesión
              </h1>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-white/80"
                  >
                    Usuario (email)
                  </label>
                  <input
                    type="email"
                    id="username"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 placeholder-white/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EE7203]/40 focus:border-[#EE7203]/50"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-white/80"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      className="w-full pr-10 px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 placeholder-white/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EE7203]/40 focus:border-[#EE7203]/50"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10 text-white/80"
                      aria-label={
                        showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {!!error && (
                  <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg p-2 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-110 transition bg-gradient-to-r from-[#EE7203] to-[#FF3816] disabled:opacity-60"
                  disabled={loading}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? "Ingresando…" : "Iniciar sesión"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Iconos ───────── */
function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.23 4.62M1 1l22 22" />
    </svg>
  );
}