import { minutesToHours } from "date-fns";

export function toBoolean(value: unknown): boolean {
  return !!value;
}

export function toNumberOrUndefined(value: unknown): number | undefined {
  return value ? Number(value) : undefined;
}

export function toDateOrUndefined(isoDate: unknown): Date | undefined {
  return isoDate && typeof isoDate === "string" ? new Date(isoDate) : undefined;
}

export function minutesToDuration(minutes: number): Duration {
  return {
    days: Math.floor(minutesToHours(minutes) / 24),
    hours: minutesToHours(minutes) % 24,
    minutes: minutes % 60,
  };
}

export function durationToMinutes(duration: Duration): number {
  return (
    (duration.days ?? 0) * 60 * 24 +
    (duration.hours ?? 0) * 60 +
    (duration.minutes ?? 0)
  );
}
