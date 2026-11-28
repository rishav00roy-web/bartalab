// A small landscape drawn for a story that has no photograph yet: sky, sun,
// two lines of hills and a river, in the story's colour. Each story gets its
// own shapes (seeded from its slug), so no two cards look the same.
// Pure SVG: no image download, and it stays sharp at every size.

type Tone = "navy" | "red" | "saffron" | "green" | "teal" | "stone";

const PALETTE: Record<Tone, [string, string, string, string, string]> = {
  // sky top, sky bottom, far hills, near hills, river
  navy: ["#dfe7fb", "#a9bcef", "#6f87d0", "#22397f", "#eef2fd"],
  red: ["#fde6e3", "#f6aca4", "#dc5d52", "#8d1c16", "#fff1ef"],
  saffron: ["#fff1dd", "#ffc985", "#f39634", "#a24a00", "#fff7ec"],
  green: ["#e5f5e8", "#acdcb6", "#4ba465", "#155a2b", "#f1faf3"],
  teal: ["#e0f3f4", "#a3d8dc", "#3a9fab", "#0d525c", "#effafa"],
  stone: ["#f3f0ea", "#dcd4c4", "#ab9f88", "#5f5747", "#faf8f4"],
};

function seeded(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** A gentle ridge across the frame from y≈base, with three crests. */
function ridge(rand: () => number, base: number, height: number) {
  const pts = [0, 60, 130, 200, 270, 300].map((x) => [x, base - rand() * height] as const);
  let d = `M0,200 L0,${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx.toFixed(1)},${y0.toFixed(1)} ${cx.toFixed(1)},${y1.toFixed(1)} ${x1},${y1.toFixed(1)}`;
  }
  return `${d} L300,200 Z`;
}

export function Scene({ slug, tone }: { slug: string; tone: Tone }) {
  const rand = seeded(slug);
  const [skyA, skyB, far, near, river] = PALETTE[tone];
  const sunX = 60 + rand() * 180;
  const sunY = 40 + rand() * 30;
  const farD = ridge(rand, 125, 45);
  const nearD = ridge(rand, 160, 35);
  const bend = 90 + rand() * 120;
  const id = `g${slug.replace(/[^a-z0-9]/gi, "").slice(0, 24)}`;
  return (
    <svg className="sj-scene" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyA} />
          <stop offset="1" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill={`url(#${id})`} />
      <circle cx={sunX} cy={sunY} r="18" fill="#fff" opacity="0.85" />
      <path d={farD} fill={far} opacity="0.75" />
      <path d={nearD} fill={near} />
      {/* The river: a wide curve that narrows towards the hills. */}
      <path
        d={`M${bend - 30},200 C${bend - 10},185 ${bend + 40},178 ${bend + 10},168 C${bend - 15},160 ${bend + 30},156 ${bend + 50},152 L${bend + 56},153 C${bend + 40},158 ${bend + 5},162 ${bend + 30},170 C${bend + 70},182 ${bend + 50},192 ${bend + 40},200 Z`}
        fill={river}
        opacity="0.9"
      />
    </svg>
  );
}
