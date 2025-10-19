import { IND_DAY_MAP } from "./ind-day-map";

export function expandHariKerja(hariKerja: string): number[] {
  const parts = hariKerja.split(",").map((p) => p.trim().toLowerCase());
  const out = new Set<number>();
  for (const part of parts) {
    if (part.includes("-")) {
      const [startRaw, endRaw] = part.split("-").map((s) => s.trim());
      const start = IND_DAY_MAP[startRaw];
      const end = IND_DAY_MAP[endRaw];
      if (start === undefined || end === undefined) continue;
      let cur = start;
      while (true) {
        out.add(cur);
        if (cur === end) break;
        cur = (cur + 1) % 7;
      }
    } else {
      const v = IND_DAY_MAP[part];
      if (v !== undefined) out.add(v);
    }
  }
  return Array.from(out.values());
}
