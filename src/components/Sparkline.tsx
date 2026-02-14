import { TrendPoint } from "@/data/mockData";

export function Sparkline({ points }: { points: TrendPoint[] }) {
  if (!points.length) return null;
  const w = 680;
  const h = 220;
  const x = (i: number) => (i / (points.length - 1)) * (w - 40) + 20;
  const y = (value: number) => h - ((value - 1) / 4) * (h - 40) - 20;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(p.avgScore)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" role="img" aria-label="V Score trend">
      <defs>
        <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF5C5C" />
          <stop offset="100%" stopColor="#F28C13" />
        </linearGradient>
      </defs>
      {[1, 2, 3, 4, 5].map((v) => (
        <line key={v} x1={20} y1={y(v)} x2={w - 20} y2={y(v)} stroke="#ececec" strokeWidth="1" />
      ))}
      <path d={d} fill="none" stroke="url(#line)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
