export const BEREA_TIMEZONE = "America/Tijuana";

/**
 * Returns YYYY-MM-DD for a date in Mexicali / Berea timezone.
 */
export function getBereaDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BEREA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Returns a Date object corresponding to the start of today in Mexicali.
 */
export function getBereaStartOfToday(): Date {
  const dateStr = getBereaDateString(new Date());
  // Mexicali / Baja California is UTC-8 during standard time (November-March)
  return new Date(`${dateStr}T00:00:00-08:00`);
}

/**
 * Checks whether an event occurs today in Mexicali.
 */
export function isEventToday(date: Date): boolean {
  return getBereaDateString(date) === getBereaDateString(new Date());
}

/**
 * Formats a date using Mexicali timezone.
 */
export function formatBereaDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  return date.toLocaleDateString("es-MX", {
    timeZone: BEREA_TIMEZONE,
    ...options,
  });
}
