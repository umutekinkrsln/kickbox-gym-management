import { useEffect, useState } from "react";
import apiClient from "../api/client";

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  membershipStartDate: "",
  membershipEndDate: "",
  packageType: "MONTHLY",
  currentLevel: "BEGINNER",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadMembers() {
    setLoading(true);
    const res = await apiClient.get("/members");
    setMembers(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post("/members", form);
      setForm(emptyForm);
      setShowForm(false);
      await loadMembers();
    } catch (err) {
      alert(err.response?.data?.error || "Uye eklenemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-4xl tracking-wide2 text-ink">UYELER</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accentHover text-ink font-medium text-sm px-4 py-2 rounded-sm transition-colors"
        >
          {showForm ? "Vazgec" : "+ Yeni Uye"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-sm p-6 mb-8 grid grid-cols-2 gap-4"
        >
          <Field label="Ad Soyad" name="fullName" value={form.fullName} onChange={handleChange} required />
          <Field label="Telefon" name="phone" value={form.phone} onChange={handleChange} required />
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <div />
          <Field
            label="Uyelik Baslangic"
            name="membershipStartDate"
            type="date"
            value={form.membershipStartDate}
            onChange={handleChange}
            required
          />
          <Field
            label="Uyelik Bitis"
            name="membershipEndDate"
            type="date"
            value={form.membershipEndDate}
            onChange={handleChange}
            required
          />

          <SelectField
            label="Paket Tipi"
            name="packageType"
            value={form.packageType}
            onChange={handleChange}
            options={[
              ["MONTHLY", "Aylik"],
              ["QUARTERLY", "3 Aylik"],
              ["YEARLY", "Yillik"],
            ]}
          />
          <SelectField
            label="Seviye"
            name="currentLevel"
            value={form.currentLevel}
            onChange={handleChange}
            options={[
              ["BEGINNER", "Baslangic"],
              ["INTERMEDIATE", "Orta"],
              ["ADVANCED", "Ileri"],
            ]}
          />

          <Field
            label="Acil Durum Kisi"
            name="emergencyContactName"
            value={form.emergencyContactName}
            onChange={handleChange}
          />
          <Field
            label="Acil Durum Telefon"
            name="emergencyContactPhone"
            value={form.emergencyContactPhone}
            onChange={handleChange}
          />

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-accentHover disabled:opacity-50 text-ink font-medium text-sm px-5 py-2.5 rounded-sm transition-colors"
            >
              {saving ? "Kaydediliyor..." : "Uyeyi Kaydet"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        {loading ? (
          <p className="text-muted p-6">Yukleniyor...</p>
        ) : members.length === 0 ? (
          <p className="text-muted p-6">Henuz uye yok. Yukaridan ekleyebilirsin.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted uppercase text-xs tracking-wide2">
                <th className="px-5 py-3 font-medium">Ad Soyad</th>
                <th className="px-5 py-3 font-medium">Telefon</th>
                <th className="px-5 py-3 font-medium">Paket</th>
                <th className="px-5 py-3 font-medium">Uyelik Bitis</th>
                <th className="px-5 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-surfaceHover">
                  <td className="px-5 py-3 text-ink">{m.fullName}</td>
                  <td className="px-5 py-3 text-muted font-mono">{m.phone}</td>
                  <td className="px-5 py-3 text-muted">{m.packageType}</td>
                  <td className="px-5 py-3 text-muted font-mono">{m.membershipEndDate}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={m.status} />
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

function Field({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-canvas border border-border rounded-sm px-3 py-2 text-ink focus:border-accent transition-colors"
      >
        {options.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-active/15 text-active",
    EXPIRED: "bg-expired/15 text-expired",
    FROZEN: "bg-warning/15 text-warning",
  };
  const labels = {
    ACTIVE: "Aktif",
    EXPIRED: "Suresi Doldu",
    FROZEN: "Donduruldu",
  };
  return (
    <span className={`px-2 py-1 rounded-sm text-xs font-medium ${styles[status] || ""}`}>
      {labels[status] || status}
    </span>
  );
}
