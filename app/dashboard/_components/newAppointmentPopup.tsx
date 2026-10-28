"use client";

import { useState } from "react";
import { create_appointment } from "../actions";

export default function NewAppointmentPopup({
  open,
  onClose,
  doctors,
}: {
  open: boolean;
  onClose: () => void;
  doctors: { id: string; name: string }[];
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={() => !pending && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            New Appointment
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (pending) return;

            const form = e.currentTarget;
            const formData = new FormData(form);
            const doctor_id = formData.get("doctor_id") as string;
            const start_date = new Date(formData.get("start_date") as string).toISOString();
            const duration = formData.get("duration") as string;
            const end_date = new Date(
              new Date(start_date).getTime() + (parseInt(duration) * 60000)
            ).toISOString();
            const title = formData.get("title") as string;

            setPending(true);
            setError(null);
            try {
              await create_appointment(doctor_id, start_date, end_date, title);
              onClose();
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Failed to create appointment"
              );
            } finally {
              setPending(false);
            }
          }}
          className="space-y-5 px-6 py-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Doctor
            </label>
            <select
              name="doctor_id"
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500"
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              name="start_date"
              required
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Duration
                </label>
                <input 
                    type="number"
                    name="duration"
                    required
                    placeholder="Duration in minutes"
                    disabled={pending}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Annual checkup"
              disabled={pending}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {pending && (
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                  />
                </svg>
              )}
              {pending ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}