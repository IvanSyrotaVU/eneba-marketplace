import { useState, type FormEvent } from "react";
import { apiFetch } from "../api";
import { navigate } from "../router";
import { useShop } from "../shop";

export function AuthPage({ next }: { next?: string }) {
  const { authenticate } = useShop();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const afterLogin = () => navigate(next ? `#/${next}` : "#/");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authenticate(mode, email, password);
      afterLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await authenticate("demo");
      afterLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="mx-auto w-full max-w-[460px] py-10">
        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#ff2d95_0%,#ff6a3d_55%,#fad318_100%)] text-xl font-black text-cosmos shadow-[0_6px_16px_rgb(255_61_127/0.45)]">
            e
          </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-xs text-lavender">Instant digital keys & cashback wallet</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.04] p-1">
            {(["signin", "register"] as const).map((m) => (
                <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError("");
                    }}
                    className={`h-9 rounded-lg text-sm font-extrabold transition ${
                        mode === m ? "bg-eneba text-cosmos" : "text-lavender hover:text-white"
                    }`}
                >
                  {m === "signin" ? "Sign In" : "Register"}
                </button>
            ))}
          </div>

          {error && (
              <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200">
                {error}
              </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-xs font-bold text-lavender">
              EMAIL
              <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@eneba.gg"
                  className="h-12 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold text-white outline-none focus:border-eneba"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-bold text-lavender">
              PASSWORD
              <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold text-white outline-none focus:border-eneba"
              />
            </label>
            <button
                type="submit"
                disabled={loading}
                className="mt-2 h-[52px] rounded-xl bg-eneba text-base font-extrabold text-cosmos transition hover:bg-[#ffe03d] disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-bold text-lavender/60">
            <span className="h-px flex-1 bg-white/10" />
            OR
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
              type="button"
              disabled={loading}
              onClick={demoLogin}
              className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.06] text-sm font-extrabold transition hover:bg-white/[0.12] disabled:opacity-50"
          >
            Instant Demo Account (demo@eneba.gg)
          </button>
        </div>
      </div>
  );
}