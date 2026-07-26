import { useEffect, useState } from "react";
import apiClient from "../api/client";

const dayLabels = {
  MONDAY: "Pazartesi",
  TUESDAY: "Sali",
  WEDNESDAY: "Carsamba",
  THURSDAY: "Persembe",
  FRIDAY: "Cuma",
  SATURDAY: "Cumartesi",
  SUNDAY: "Pazar",
};

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [checkedInIds, setCheckedInIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function loadInitial() {
      const [classesRes, membersRes] = await Promise.all([
        apiClient.get("/classes"),
        apiClient.get("/members"),
      ]);
      setClasses(classesRes.data);
      setMembers(membersRes.data);
      if (classesRes.data.length > 0) {
        setSelectedClassId(String(classesRes.data[0].id));
      }
      setLoading(false);
    }
    loadInitial();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    async function loadAttendance() {
      const res = await apiClient.get(`/attendances/class/${selectedClassId}`, {
        params: { date: today },
      });
      setCheckedInIds(new Set(res.data.map((a) => a.member.id)));
    }
    loadAttendance();
  }, [selectedClassId, today]);

  async function handleCheckIn(memberId) {
    setMarking(memberId);
    try {
      await apiClient.post("/attendances/check-in", {
        memberId,
        classId: Number(selectedClassId),
        date: today,
      });
      setCheckedInIds((prev) => new Set(prev).add(memberId));
    } catch (err) {
      alert(err.response?.data?.error || "Yoklama kaydedilemedi");
    } finally {
      setMarking(null);
    }
  }

  const selectedClass = classes.find((c) => String(c.id) === selectedClassId);

  if (loading) {
    return <p className="text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <h2 className="font-display text-4xl tracking-wide2 text-ink mb-2">YOKLAMA</h2>
      <p className="text-muted text-sm mb-8 font-mono">{today}</p>

      {classes.length === 0 ? (
        <div className="bg-surface border border-border rounded-sm p-6">
          <p className="text-muted text-sm">
            Henuz ders eklenmedi. Once "Ders Programi" sayfasindan bir ders olustur.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 max-w-xs">
            <label className="block text-xs uppercase tracking-wide2 text-muted mb-1.5">
              Ders sec
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 text-ink focus:border-accent transition-colors"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {dayLabels[c.dayOfWeek]} {c.startTime}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <p className="text-muted text-sm mb-4">
              {checkedInIds.size} / {members.length} uye geldi
            </p>
          )}

          <div className="bg-surface border border-border rounded-sm overflow-hidden">
            {members.length === 0 ? (
              <p className="text-muted p-6">Henuz uye yok.</p>
            ) : (
              <ul>
                {members.map((member) => {
                  const isCheckedIn = checkedInIds.has(member.id);
                  return (
                    <li
                      key={member.id}
                      className="flex justify-between items-center px-5 py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-ink">{member.fullName}</p>
                        <p className="text-muted text-xs font-mono">{member.phone}</p>
                      </div>

                      {isCheckedIn ? (
                        <span className="flex items-center gap-1.5 text-active text-sm font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-active" />
                          Geldi
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(member.id)}
                          disabled={marking === member.id}
                          className="bg-accent hover:bg-accentHover disabled:opacity-50 text-ink text-sm font-medium px-3 py-1.5 rounded-sm transition-colors"
                        >
                          {marking === member.id ? "..." : "Check-in"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
