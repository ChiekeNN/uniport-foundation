type ClassInput =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | undefined | null>
  | ClassInput[];

export function cn(...inputs: ClassInput[]): string {
  const out: string[] = [];
  const walk = (v: ClassInput): void => {
    if (!v && v !== 0) return;
    if (typeof v === "string" || typeof v === "number") {
      if (v) out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (typeof v === "object") {
      for (const [k, val] of Object.entries(v)) if (val) out.push(k);
    }
  };
  inputs.forEach(walk);
  return out.join(" ");
}
