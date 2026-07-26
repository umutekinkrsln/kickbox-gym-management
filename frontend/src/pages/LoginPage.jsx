import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Giris basarisiz, bilgileri kontrol et");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        {/* Imza ogesi: kose bandi gibi diagonal kirmizi cizgi */}
        <div className="relative mb-10">
          <div className="absolute -top-3 -left-3 w-16 h-1.5 bg-accent rotate-[-45deg]" />
          <h1 className="font-display text-6xl tracking-wide2 text-ink">RING</h1>
          <p className="text-muted text-sm mt-1">Salon yonetim paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-sm p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-canvas border border-border rounded-sm px-3 py-2.5 text-ink placeholder:text-muted/50 focus:border-accent transition-colors"
              placeholder="antrenor@salon.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Sifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-canvas border border-border rounded-sm px-3 py-2.5 text-ink focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-expired text-sm bg-expired/10 border border-expired/30 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accentHover disabled:opacity-50 text-ink font-medium py-2.5 rounded-sm transition-colors"
          >
            {loading ? "Giris yapiliyor..." : "Giris yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
