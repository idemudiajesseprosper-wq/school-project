"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentTimetablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/student/timetable");
      const json = await res.json();

      if (!json.success) {
        router.push("/login/student");
        return;
      }

      setTimetable(json.timetable);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-slate-50 p-8">Loading timetable...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 md:p-8">
      <style>{`
        body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
        .wrap { max-width: 1150px; margin: 0 auto; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; vertical-align: top; }
        th { font-size: 12px; text-transform: uppercase; color: #64748b; }
      `}</style>

      <main className="wrap grid gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-blue-600">Student Portal</p>
            <h1 className="text-3xl font-black">{timetable?.class || "Class"} Timetable</h1>
          </div>
          <a className="font-bold text-blue-600" href="/student">Back to dashboard</a>
        </div>

        {!timetable ? (
          <div className="card">No timetable has been published for your class yet.</div>
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  {Array.from({ length: 8 }, (_, index) => <th key={index}>Period {index + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                {timetable.days?.map((day) => (
                  <tr key={day.day}>
                    <th>{day.day}</th>
                    {day.periods?.map((period) => (
                      <td key={period.periodNumber}>
                        <p className="font-black capitalize">{period.type === "subject" ? period.subject || "Subject" : period.type}</p>
                        <p className="text-xs text-slate-500">{period.startTime || "--"} - {period.endTime || "--"}</p>
                        {period.teacherName && <p className="mt-1 text-xs font-bold text-blue-600">{period.teacherName}</p>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
