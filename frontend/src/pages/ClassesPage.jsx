import { useEffect, useState } from "react";
import apiClient from "../api/client";

const days = [
  ["MONDAY", "Pazartesi"],
  ["TUESDAY", "Sali"],
  ["WEDNESDAY", "Carsamba"],
  ["THURSDAY", "Persembe"],
  ["FRIDAY", "Cuma"],
  ["SATURDAY", "Cumartesi"],
  ["SUNDAY", "Pazar"],
];

const emptyForm = { name: "", dayOfWeek: "MONDAY", startTime: "18:00", endTime: "19:00" };

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadClasses() {
    setLoading(true);
    const res = await apiClient.get("/classes");
    setClasses(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadClasses();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // NOT: trainer_id su an backend'de zorunlu (ManyToOne nullable=false).
      // MVP asamasinda ilk admin/antrenor kullaniciyi trainer olarak atiyoruz.
      // Birden fazla antrenor eklenince burasi bir "antrenor sec" dropdown'a donusecek.
      await apiClient.post("/classes", {
        ...form,
        trainer: { id: 1 },
      });
      setForm(emptyForm);
      setShowForm(false);
      await loadClasses();
    } catch (err) {
      alert(err.response?.data?.error || "Ders eklenemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-4xl tracking-wide2 text-ink">DERS PROGRAMI</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accentHover text-ink font-medium text-sm px-4 py-2 rounded-sm transition-colors"
        >
          {showForm ? "Vazgec" : "+ Yeni Ders"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-sm p-6 mb-8 grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Ders Adi
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Kickbox Baslangic"
              className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Gun
            </label>
            <select
              name="dayOfWeek"
              value={form.dayOfWeek}
              onChange={handleChange}
              className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
            >
              {days.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Baslangic Saati
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Bitis Saati
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-accentHover disabled:opacity-50 text-ink font-medium text-sm px-5 py-2.5 rounded-sm transition-colors"
            >
              {saving ? "Kaydediliyor..." : "Dersi Kaydet"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        {loading ? (
          <p className="text-muted p-6">Yukleniyor...</p>
        ) : classes.length === 0 ? (
          <p className="text-muted p-6">Henuz ders eklenmedi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted uppercase text-xs tracking-wide2">
                <th className="px-5 py-3 font-medium">Ders</th>
                <th className="px-5 py-3 font-medium">Gun</th>
                <th className="px-5 py-3 font-medium">Saat</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surfaceHover">
                  <td className="px-5 py-3 text-ink">{c.name}</td>
                  <td className="px-5 py-3 text-muted">
                    {days.find(([val]) => val === c.dayOfWeek)?.[1] || c.dayOfWeek}
                  </td>
                  <td className="px-5 py-3 text-muted font-mono">
                    {c.startTime} - {c.endTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
