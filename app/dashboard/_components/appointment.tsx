export default function Appointment({
    doctorName,
    start_date,
    end_date,
    title,
    is_doctor,
    patientName,
  }: {
    doctorName: string;
    start_date: Date;
    end_date: Date;
    title: string;
    is_doctor: boolean;
    patientName: string;
  }) {
    const now = new Date();
  
    // Raw diff in minutes (can be negative — don't clamp yet)
    const diffMinutes = Math.floor(
      (start_date.getTime() - now.getTime()) / (1000 * 60)
    );
  
    const isPast = diffMinutes <= 0;
    const isOngoing = start_date <= now && end_date > now;
  
    // Format remaining / elapsed time
    let timeLeftFormat: string;
    if (isPast) {
      timeLeftFormat = "Appointment time has passed";
    } else if (diffMinutes > 60 * 24) {
      const days = Math.floor(diffMinutes / 60 / 24);
      const hours = Math.floor(diffMinutes / 60) % 24;
      timeLeftFormat = `${days}d ${hours}h left`;
    } else if (diffMinutes > 60) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      timeLeftFormat = `${hours}h ${minutes}m left`;
    } else {
      timeLeftFormat = `${diffMinutes}m left`;
    }
  
    // Duration
    const durationMinutes = Math.floor(
      (end_date.getTime() - start_date.getTime()) / (1000 * 60)
    );
    const durHours = Math.floor(durationMinutes / 60);
    const durMins = durationMinutes % 60;
    const duration = `${durHours}h ${durMins}m`;
  
    // Status styling
    const statusColor = isOngoing
      ? "text-blue-600"
      : isPast
      ? "text-slate-400"
      : diffMinutes < 60 * 24
      ? "text-amber-600"
      : "text-slate-600";
  
    return (
      <div
        className={`rounded-xl border p-4 shadow-sm transition ${
          isOngoing
            ? "border-blue-300 bg-blue-50"
            : isPast
            ? "border-slate-200 bg-slate-50 opacity-75"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
            <span className="font-normal text-slate-500">
              {" "}
              with {is_doctor ? patientName : `Dr. ${doctorName}`}
            </span>
          </h2>
  
          {isOngoing && (
            <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              Ongoing
            </span>
          )}
          {isPast && !isOngoing && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Past
            </span>
          )}
        </div>
  
        <p className="mt-1 text-sm text-slate-600">
          {start_date.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
  
        <p className={`mt-2 text-sm font-medium ${statusColor}`}>
          {timeLeftFormat}
          <span className="font-normal text-slate-400">
            {" "}· {duration} duration
          </span>
        </p>
      </div>
    );
  }