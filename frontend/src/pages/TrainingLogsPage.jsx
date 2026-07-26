import { useEffect, useState } from "react";
import apiClient from "../api/client";

const emptyForm = { logDate: "", category: "TECHNIQUE", note: "", nextGoal: "" };

const categoryLabels = {
  TECHNIQUE: "Teknik",
  CONDITIONING: "Kondisyon",
  DISCIPLINE: "Disiplin",
};

export default function TrainingLogsPage() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      const res = await apiClient.get("/members");
      setMembers(res.data);
      if (res.data.length > 0) {
        setSelectedMemberId(String(res.data[0].id));
      }
      setLoading(false);
    }
    loadMembers();
  }, []);

  useEffect(() => {
    if (!selectedMemberId) return;
    async function loadLogs() {
      const res = await apiClient.get(`/training-logs/member/${selectedMemberId}`);
      setLogs(res.data);
    }
    loadLogs();
  }, [selectedMemberId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // NOT: trainerId su an sabit 1 (ilk admin/antrenor).
      // Birden fazla antrenor eklenince giris yapan kullanicinin id'si kullanilacak.
      await apiClient.post("/training-logs", {
        memberId: Number(selectedMemberId),
        trainerId: 1,
        ...form,
      });
      setForm(emptyForm);
      const res = await apiClient.get(`/training-logs/member/${selectedMemberId}`);
      setLogs(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Kayit eklenemedi");
    } finally {
      setSaving(false);
    }
  }

  const selectedMember = members.find((m) => String(m.id) === selectedMemberId);

  if (loading) {
    return <p className="text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <h2 className="font-display text-4xl tracking-wide2 text-ink mb-8">GELISIM TAKIBI</h2>

      {members.length === 0 ? (
        <div className="bg-surface border border-border rounded-sm p-6">
          <p className="text-muted text-sm">Once "Uyeler" sayfasindan bir uye ekle.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 max-w-xs">
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Uye sec
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 text-ink focus:border-accent transition-colors"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName}
                </option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <p className="text-muted text-sm mb-4">
              Seviye: <span className="text-ink">{selectedMember.currentLevel}</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-6">
            <form
              onSubmit={handleSubmit}
              className="bg-surface border border-border rounded-sm p-6 space-y-4 h-fit"
            >
              <h3 className="text-sm uppercase tracking-wide2 text-muted mb-2">
                Yeni Kayit
              </h3>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Tarih
                </label>
                <input
                  type="date"
                  name="logDate"
                  value={form.logDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Kategori
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
                >
                  <option value="TECHNIQUE">Teknik</option>
                  <option value="CONDITIONING">Kondisyon</option>
                  <option value="DISCIPLINE">Disiplin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Not
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Sag direkt teknigi gelisti, sol bacak koordinasyonu zayif..."
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Sonraki Hedef
                </label>
                <textarea
                  name="nextGoal"
                  value={form.nextGoal}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Alt seviyeye gecis icin kondisyon calismasi..."
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-accent hover:bg-accentHover disabled:opacity-50 text-ink font-medium py-2.5 rounded-sm transition-colors"
              >
                {saving ? "Kaydediliyor..." : "Kaydi Ekle"}
              </button>
            </form>

            <div className="bg-surface border border-border rounded-sm p-6">
              <h3 className="text-sm uppercase tracking-wide2 text-muted mb-4">
                Roadmap Gecmisi
              </h3>

              {logs.length === 0 ? (
                <p className="text-muted text-sm">Henuz kayit yok.</p>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="border-l-2 border-accent pl-4 pb-4 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs text-muted">{log.logDate}</span>
                        <span className="text-xs px-2 py-0.5 rounded-sm bg-accent/15 text-accent">
                          {categoryLabels[log.category] || log.category}
                        </span>
                      </div>
                      {log.note && <p className="text-ink text-sm mb-1.5">{log.note}</p>}
                      {log.nextGoal && (
                        <p className="text-muted text-xs">
                          <span className="uppercase tracking-wide2">Hedef:</span> {log.nextGoal}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
