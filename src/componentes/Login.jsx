// pages/login.jsx
import { useContext, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import ContextGeneral from "@/services/contextGeneral";

const ADMIN_PATH = "/admin"; // cambia si tu panel admin vive en otra ruta

export default function Login() {
  const { auth, user, ready, userProfile } = useContext(ContextGeneral);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = useMemo(() => {
    if (!ready) return false;
    const p = userProfile || {};
    const nestedBool = p?.roles?.admin === true;
    const directFlags =
      p?.admin === true || p?.isAdmin === true || p?.is_admin === true;
    const roleString =
      typeof p?.role === "string" && p.role.toLowerCase() === "admin";
    const arrayRoles =
      Array.isArray(p?.roles) &&
      p.roles.map((r) => String(r).toLowerCase()).includes("admin");
    const permisosFlag = p?.permisos?.admin === true;
    return (
      nestedBool || directFlags || roleString || arrayRoles || permisosFlag
    );
  }, [ready, userProfile]);

  const waitForProfile = async (maxMs = 3000) => {
    const start = Date.now();
    if (ready && userProfile) return true;
    while (Date.now() - start < maxMs) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 150));
      if (ready && userProfile) return true;
    }
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await waitForProfile(3000);
      // No pedimos nada al backend: solo dejamos la sesión lista
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0C212D]">
      {/* Fondo con gradientes suaves */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_10%_10%,rgba(238,114,3,.25),transparent),radial-gradient(40%_30%_at_90%_20%,rgba(255,56,22,.22),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(255,255,255,.06),transparent)]" />

      <div className="relative max-w-md mx-auto px-5 py-10 min-h-screen flex items-center">
        <div className="w-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <LogoCap />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <h1 className="text-xl font-semibold text-white tracking-tight text-center">
                {user ? "¡Bienvenido!" : "Iniciar sesión"}
              </h1>
              {user && user.email && (
                <p className="text-sm text-white/70 text-center mt-1 flex items-center justify-center gap-2">
                  {user.email}
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-200 border border-green-400/30">
                      Admin
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-white/15 hover:bg-white/20 border border-white/20 transition"
                    disabled={loading}
                  >
                    <span className="inline-block w-4 h-4">
                      <DashboardIcon />
                    </span>
                    Ir al panel
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => router.push(ADMIN_PATH)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-110 transition bg-gradient-to-r from-[#EE7203] to-[#FF3816]"
                      disabled={loading}
                      title="Panel de administración"
                    >
                      <span className="inline-block w-4 h-4">
                        <ShieldIcon />
                      </span>
                      Ir al panel de Admin
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-200 transition disabled:opacity-60"
                    disabled={loading}
                  >
                    <span className="inline-block w-4 h-4">
                      <LogoutIcon />
                    </span>
                    Cerrar sesión
                  </button>
                </div>
              ) : (
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
                        title={
                          showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                        }
                      >
                        {showPass ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  {!!error && (
                    <p
                      className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg p-2 text-center"
                      role="alert"
                      aria-live="assertive"
                    >
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
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-3 border-t border-white/10">
              <p className="text-[11px] text-white/50 text-center">
                {ready ? "Sesión lista" : "Preparando sesión…"}
                {isAdmin && (
                  <>
                    {" "}
                    • <span className="text-white/70">Admin</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Link secundario si está logueado */}
          {user && (
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-xs text-white/60 hover:text-white/80 underline underline-offset-4"
              >
                Ir al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Iconos & Logo ───────── */
function LogoCap() {
  return (
    <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[#EE7203] to-[#FF3816] text-white font-black shadow-lg">
      FA
    </div>
  );
}
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
function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 9h8V3h-8z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 2l7 3v6c0 5-3.5 9-7 11-3.5-2-7-6-7-11V5l7-3z" />
      <path d="M9.5 12.5l1.5 1.5 3.5-3.5" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
