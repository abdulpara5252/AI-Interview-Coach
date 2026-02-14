"use client";

interface Session {
  id: string;
  createdAt: string;
  [key: string]: unknown;
}

interface PracticeHeatmapProps {
  sessions: Session[];
}

function getHeatmapColor(count: number): string {
  if (count === 0) return "bg-violet-50";
  if (count === 1) return "bg-violet-200";
  if (count === 2) return "bg-violet-400";
  if (count === 3) return "bg-violet-600";
  return "bg-violet-800";
}

export function PracticeHeatmap({ sessions }: PracticeHeatmapProps) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 89);

  const sessionsByDate = new Map<string, number>();
  for (const session of sessions) {
    const date = new Date(session.createdAt).toISOString().split("T")[0];
    sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
  }

  const weeks: Array<Array<{ date: Date; count: number }>> = [];
  let currentWeek: Array<{ date: Date; count: number }> = [];
  let currentDate = new Date(startDate);

  const dayOfWeek = currentDate.getDay();
  for (let i = 0; i < dayOfWeek; i++) {
    currentWeek.push({
      date: new Date(currentDate.getTime() - (dayOfWeek - i) * 24 * 60 * 60 * 1000),
      count: 0,
    });
  }

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = sessionsByDate.get(dateStr) || 0;
    currentWeek.push({ date: new Date(currentDate), count });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: new Date(currentDate), count: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(currentWeek);
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels: Record<number, string> = {
    0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun",
    6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec",
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1 min-w-max">
          <div className="flex flex-col gap-1">
            <div className="h-6" />
            {dayLabels.map((day) => (
              <div key={day} className="h-6 w-6 text-xs text-violet-500 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {weekIdx % 4 === 0 && (
                <div className="h-6 text-xs font-medium text-violet-600 flex items-center px-1">
                  {monthLabels[week[0].date.getMonth()]}
                </div>
              )}
              {week.map((day, dayIdx) => (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  title={`${day.date.toLocaleDateString()}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                  className={`h-6 w-6 rounded-sm border border-violet-100 cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all ${getHeatmapColor(
                    day.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-violet-600">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-sm border border-violet-100 ${getHeatmapColor(i)}`}
            />
          ))}
        </div>
        <span className="text-violet-600">More</span>
      </div>
    </div>
  );
}
