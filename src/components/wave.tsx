import type { CSSProperties } from "react";

const wavePath = (segments: number) => {
  let d = "M0 32";
  for (let k = 0; k < segments; k += 1) {
    d += ` Q${k * 240 + 120} ${k % 2 ? 60 : 4} ${(k + 1) * 240} 32`;
  }
  return `${d} V64 H0 Z`;
};
const WAVE = wavePath(14);

export const Wave = ({
  fill,
  style,
}: {
  fill: string;
  style?: CSSProperties;
}) => (
  <svg
    className="wave"
    preserveAspectRatio="none"
    style={style}
    viewBox="0 0 3360 64"
  >
    <path d={WAVE} fill={fill} />
  </svg>
);
