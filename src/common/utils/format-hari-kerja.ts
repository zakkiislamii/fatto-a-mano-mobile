import { DAY_NAMES } from "../constants/constants";

const formatHariKerja = (days: number[]): string => {
  if (days.length === 0) return "";

  const sorted = [...days].sort((a, b) => a - b);
  const ranges: string[] = [];
  let i = 0;

  while (i < sorted.length) {
    let start = sorted[i];
    let end = start;

    while (i + 1 < sorted.length && sorted[i + 1] === sorted[i] + 1) {
      i++;
      end = sorted[i];
    }

    if (end - start >= 1) {
      ranges.push(`${DAY_NAMES[start]}-${DAY_NAMES[end]}`);
    } else {
      ranges.push(DAY_NAMES[start]);
    }
    i++;
  }

  return ranges.join(",");
};

export default formatHariKerja;
