import { pct, W0 } from "@/lib/format";

import { Wave } from "./wave";

const PEARLS = Array.from({ length: 30 }, (_, i) => {
  const size = `${26 + ((i * 11) % 18)}px`;
  return {
    animationDelay: `${(0.1 + ((i * 0.13) % 1.3)).toFixed(2)}s`,
    animationDuration: `${1.8 + (i % 5) * 0.25}s`,
    animationName: i % 2 ? "pearlA" : "pearlB",
    height: size,
    left: pct((i * 173 + 41) % 1400, W0),
    width: size,
  };
});

/** "surprise me": a wave of milk tea pours over the screen */
export const MilkLayer = () => (
  <div aria-hidden="true" className="milk-layer">
    <div className="milk">
      <Wave fill="#fbf3e6" />
    </div>
    {PEARLS.map((p) => (
      <div className="milk-pearl" key={p.left} style={p} />
    ))}
  </div>
);
