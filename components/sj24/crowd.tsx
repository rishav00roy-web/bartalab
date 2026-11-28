// "One country, countless voices": a crowd of people from across Assam, drawn
// as black line art with touches of red (gamosa, japi, bindi). Every person is
// built from simple parts and seeded, so the same crowd renders on the server
// and in the browser. Pure SVG, no image files.

type Rand = () => number;

function seeded(seed: number): Rand {
  let h = seed >>> 0;
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const INK = "#111";
const PAPER = "#fff";
const RED = "#d7151f";
const S = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

type Outfit = "shirt" | "tee" | "dark" | "hoodie" | "mekhela" | "gamosa" | "kurta";
type Hair = "short" | "long" | "bun" | "elder" | "curly" | "braid";
type Extra = "none" | "japi" | "glasses" | "headphones" | "phone" | "beard" | "cap";

type Person = { outfit: Outfit; hair: Hair; extra: Extra; w: number; bindi: boolean; smile: number };

function pick<T>(r: Rand, list: readonly T[]): T {
  return list[Math.floor(r() * list.length)];
}

function makePerson(r: Rand): Person {
  const outfit = pick(r, ["shirt", "tee", "dark", "hoodie", "mekhela", "gamosa", "kurta", "mekhela", "gamosa"] as const);
  const feminine = outfit === "mekhela" || r() < 0.35;
  const hair = feminine ? pick(r, ["long", "bun", "braid", "long"] as const) : pick(r, ["short", "elder", "curly", "short"] as const);
  const extra = pick(r, ["none", "none", "japi", "glasses", "headphones", "phone", feminine ? "glasses" : "beard", "cap"] as const);
  return { outfit, hair, extra, w: 24 + r() * 8, bindi: feminine && r() < 0.5, smile: r() };
}

/** One person, feet at (0,0), about 150 units tall. */
function Figure({ p }: { p: Person }) {
  const w = p.w;
  // Sloped shoulders, a little wider at the base; two inner lines suggest the arms.
  const torso = `M${-w - 3},0 L${-w},-60 Q${-w + 1},-84 -9,-88 L9,-88 Q${w - 1},-84 ${w},-60 L${w + 3},0 Z`;
  const arms = `M${-w + 7},-66 L${-w + 9},0 M${w - 7},-66 L${w - 9},0`;
  const dark = p.outfit === "dark";
  const smile = p.smile < 0.6 ? "M-6,-104 Q0,-98 6,-104" : "M-5,-103 Q0,-100 5,-103";
  return (
    <>
      {/* Body and clothes */}
      <path d={torso} fill={dark ? INK : PAPER} {...S} />
      <path d={arms} fill="none" stroke={dark ? "#555" : INK} strokeWidth={1.4} strokeLinecap="round" />
      {p.outfit === "shirt" && (
        <>
          <path d="M-8,-88 L0,-75 L8,-88" fill="none" {...S} />
          <path d="M0,-75 V-20" fill="none" {...S} strokeWidth={1.5} />
          <circle cx="0" cy="-62" r="1.4" fill={INK} />
          <circle cx="0" cy="-46" r="1.4" fill={INK} />
        </>
      )}
      {p.outfit === "tee" && <path d="M-9,-88 Q0,-80 9,-88" fill="none" {...S} />}
      {dark && <path d="M-9,-88 Q0,-80 9,-88" fill="none" stroke={PAPER} strokeWidth={2} />}
      {p.outfit === "kurta" && (
        <>
          <path d="M0,-88 V-60" fill="none" {...S} />
          <path d={`M${-w},-24 H${w}`} fill="none" {...S} strokeWidth={1.5} />
        </>
      )}
      {p.outfit === "hoodie" && (
        <>
          <path d="M-14,-88 Q0,-70 14,-88" fill="none" {...S} />
          <path d="M-4,-80 V-64 M4,-80 V-64" fill="none" {...S} strokeWidth={1.5} />
        </>
      )}
      {p.outfit === "mekhela" && (
        // The sador: a drape from the left shoulder across to the right hip, with a red border.
        <>
          <path d={`M-10,-88 L${w},-30 L${w},-14 L-18,-80 Z`} fill={PAPER} {...S} />
          <path d={`M-14,-84 L${w},-24`} fill="none" stroke={RED} strokeWidth={2.5} />
        </>
      )}
      {p.outfit === "gamosa" && (
        // The gamosa round the neck: white cloth, red woven ends.
        <>
          <path d="M-10,-89 Q0,-80 10,-89" fill="none" {...S} />
          <path d="M-12,-88 L-16,-46 L-6,-46 L-4,-84 Z" fill={PAPER} {...S} />
          <path d="M12,-88 L14,-52 L5,-52 L4,-84 Z" fill={PAPER} {...S} />
          <path d="M-15.5,-52 H-6.4 M-15.8,-49 H-6.2" stroke={RED} strokeWidth={2} />
          <path d="M5.2,-58 H13.7 M5.1,-55 H13.9" stroke={RED} strokeWidth={2} />
        </>
      )}

      {/* Neck and head */}
      <path d="M-5,-96 V-88 M5,-96 V-88" fill="none" {...S} />
      {p.hair === "long" && (
        <path d="M-18,-112 Q-21,-136 0,-135 Q21,-136 18,-112 L21,-84 Q13,-82 12,-98 L-12,-98 Q-13,-82 -21,-84 Z" fill={INK} />
      )}
      {p.hair === "braid" && (
        <path d="M14,-108 Q24,-98 20,-80 Q24,-74 18,-66 Q14,-74 16,-80 Q12,-96 10,-104 Z" fill={INK} />
      )}
      <circle cx="0" cy="-112" r="17" fill={PAPER} {...S} />
      {/* Hair on top */}
      {(p.hair === "short" || p.hair === "bun" || p.hair === "braid") && (
        <path d="M-17,-113 Q-18,-133 0,-133 Q18,-133 17,-113 Q13,-123 2,-124 Q-9,-121 -17,-113 Z" fill={INK} />
      )}
      {p.hair === "long" && <path d="M-17,-112 Q-14,-130 0,-131 Q14,-130 17,-112 Q8,-124 0,-124 Q-8,-124 -17,-112 Z" fill={INK} />}
      {p.hair === "bun" && <circle cx="0" cy="-134" r="7" fill={INK} />}
      {p.hair === "curly" && (
        <path
          d="M-18,-110 Q-24,-120 -16,-126 Q-16,-136 -6,-134 Q0,-142 7,-134 Q17,-137 17,-126 Q24,-120 18,-110 Q12,-120 0,-121 Q-12,-120 -18,-110 Z"
          fill={INK}
        />
      )}
      {p.hair === "elder" && <path d="M-16,-104 Q-19,-118 -12,-124 M16,-104 Q19,-118 12,-124" fill="none" {...S} strokeWidth={3} />}

      {/* Face */}
      <circle cx="-6" cy="-112" r="1.8" fill={INK} />
      <circle cx="6" cy="-112" r="1.8" fill={INK} />
      <path d={smile} fill="none" {...S} strokeWidth={1.6} />
      {p.bindi && <circle cx="0" cy="-121" r="1.8" fill={RED} />}
      {(p.extra === "glasses" || p.hair === "elder") && (
        <path d="M-11,-112 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 M1,-112 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 M-1,-112 H1" fill="none" {...S} strokeWidth={1.4} />
      )}
      {p.extra === "beard" && <path d="M-15,-108 Q-14,-94 0,-93 Q14,-94 15,-108 Q10,-100 0,-101 Q-10,-100 -15,-108 Z" fill={INK} />}
      {p.extra === "headphones" && (
        <>
          <path d="M-18,-112 Q-18,-138 0,-138 Q18,-138 18,-112" fill="none" {...S} strokeWidth={3} />
          <rect x="-22" y="-118" width="7" height="13" rx="3" fill={INK} />
          <rect x="15" y="-118" width="7" height="13" rx="3" fill={INK} />
        </>
      )}
      {p.extra === "cap" && <path d="M-17,-118 Q-16,-136 0,-136 Q16,-136 17,-118 Z M10,-120 L28,-118 L17,-116 Z" fill={INK} />}
      {p.extra === "japi" && (
        // The japi: a wide conical hat, with its painted red band.
        <>
          <path d="M-38,-124 Q0,-156 38,-124 Q0,-132 -38,-124 Z" fill={PAPER} {...S} />
          <path d="M-26,-130 Q0,-147 26,-130" fill="none" stroke={RED} strokeWidth={2.5} />
          <path d="M-12,-140 L-8,-131 M0,-143 V-132 M12,-140 L8,-131" fill="none" {...S} strokeWidth={1.2} />
        </>
      )}
      {p.extra === "phone" && (
        // A notebook held to the chest: a reporter in the crowd.
        <>
          <rect x={-w + 6} y="-62" width="18" height="24" rx="2" fill={PAPER} {...S} strokeWidth={1.6} />
          <path d={`M${-w + 10},-55 h10 M${-w + 10},-50 h10 M${-w + 10},-45 h7`} stroke={INK} strokeWidth={1.2} />
        </>
      )}
    </>
  );
}

type Placed = { x: number; y: number; s: number; p: Person; i: number };

function layout(): Placed[] {
  const r = seeded(24);
  const out: Placed[] = [];
  let i = 0;
  // Back row: smaller, feet hidden behind the front row.
  for (let x = 14; x < 1600; x += 58 + r() * 14) out.push({ x, y: 258 + r() * 12, s: 0.8 + r() * 0.1, p: makePerson(r), i: i++ });
  // Front row: larger, cut off at the bottom edge like a crowd seen from the stage.
  for (let x = 44; x < 1600; x += 76 + r() * 20) out.push({ x, y: 372 + r() * 10, s: 1.0 + r() * 0.1, p: makePerson(r), i: i++ });
  return out;
}

const CROWD = layout();

export function Crowd() {
  return (
    <svg className="sj-crowd" viewBox="0 60 1600 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {CROWD.map(({ x, y, s, p, i }) => (
        <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`}>
          <g className="sj-person" style={{ ["--d" as string]: `${(i % 23) * 45}ms` }}>
            <Figure p={p} />
          </g>
        </g>
      ))}
    </svg>
  );
}
