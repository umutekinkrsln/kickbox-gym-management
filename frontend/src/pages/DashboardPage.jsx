import { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function DashboardPage() {
  const [members, setMembers] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [membersRes, expiringRes] = await Promise.all([
          apiClient.get("/members"),
          apiClient.get("/members/expiring-soon"),
        ]);
        setMembers(membersRes.data);
        setExpiringSoon(expiringRes.data);
      } catch (err) {
        console.error("Dashboard verisi yuklenemedi", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeCount = members.filter((m) => m.status === "ACTIVE").length;
  const expiredCount = members.filter((m) => m.status === "EXPIRED").length;

  if (loading) {
    return <p className="text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <h2 className="font-display text-4xl tracking-wide2 text-ink mb-8">
        GENEL BAKIS
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Toplam Uye" value={members.length} />
        <StatCard label="Aktif Uye" value={activeCount} accentColor="text-active" />
        <StatCard label="Suresi Dolmus" value={expiredCount} accentColor="text-expired" />
      </div>

      <div className="bg-surface border border-border rounded-sm p-6">
        <h3 className="text-sm uppercase tracking-wide2 text-muted mb-4">
          Onumuzdeki 7 gunde uyeligi bitecekler
        </h3>
        {expiringSoon.length === 0 ? (
          <p className="text-muted text-sm">Simdilik yaklasan bir uyelik bitisi yok.</p>
        ) : (
          <ul className="space-y-2">
            {expiringSoon.map((member) => (
              <li
                key={member.id}
                className="flex justify-between items-center py-2 border-b border-border last:border-0"
              >
                <span className="text-ink">{member.fullName}</span>
                <span className="font-mono text-sm text-warning">
                  {member.membershipEndDate}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accentColor = "text-ink" }) {
  return (
    <div className="bg-surface border border-border rounded-sm p-5">
      <p className="text-xs uppercase tracking-wide2 text-muted mb-2">{label}</p>
      <p className={`font-display text-5xl ${accentColor}`}>{value}</p>
    </div>
  );
}
