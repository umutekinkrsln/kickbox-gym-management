import { useEffect, useState } from "react";
import apiClient from "../api/client";

const emptyForm = { amount: "", paymentDate: "", paymentMethod: "CASH" };

const methodLabels = { CASH: "Nakit", CARD: "Kart", ONLINE: "Online" };

export default function PaymentsPage() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [payments, setPayments] = useState([]);
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
    async function loadPayments() {
      const res = await apiClient.get(`/payments/member/${selectedMemberId}`);
      setPayments(res.data);
    }
    loadPayments();
  }, [selectedMemberId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post(`/payments/member/${selectedMemberId}`, form);
      setForm(emptyForm);
      const res = await apiClient.get(`/payments/member/${selectedMemberId}`);
      setPayments(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Odeme kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) {
    return <p className="text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <h2 className="font-display text-4xl tracking-wide2 text-ink mb-8">ODEMELER</h2>

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

          <div className="grid grid-cols-2 gap-6">
            <form
              onSubmit={handleSubmit}
              className="bg-surface border border-border rounded-sm p-6 space-y-4 h-fit"
            >
              <h3 className="text-sm uppercase tracking-wide2 text-muted mb-2">
                Yeni Odeme
              </h3>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Tutar (TL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Odeme Tarihi
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
                  Odeme Yontemi
                </label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
                >
                  <option value="CASH">Nakit</option>
                  <option value="CARD">Kart</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-accent hover:bg-accentHover disabled:opacity-50 text-ink font-medium py-2.5 rounded-sm transition-colors"
              >
                {saving ? "Kaydediliyor..." : "Odemeyi Kaydet"}
              </button>
            </form>

            <div className="bg-surface border border-border rounded-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-wide2 text-muted">
                  Odeme Gecmisi
                </h3>
                <span className="font-display text-2xl text-active">
                  {totalPaid.toLocaleString("tr-TR")} TL
                </span>
              </div>

              {payments.length === 0 ? (
                <p className="text-muted text-sm">Henuz odeme kaydi yok.</p>
              ) : (
                <ul className="space-y-2">
                  {payments.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm"
                    >
                      <span className="text-ink font-mono">{p.paymentDate}</span>
                      <span className="text-muted">{methodLabels[p.paymentMethod]}</span>
                      <span className="text-ink font-mono">
                        {Number(p.amount).toLocaleString("tr-TR")} TL
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
