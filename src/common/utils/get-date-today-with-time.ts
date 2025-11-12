export function getDateTodayWithTime(
  jam: string,
  now = new Date()
): Date | null {
  const m = jam.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const d = new Date(now);
  d.setHours(hh, mm, 0, 0);
  return d;
}
