import type { CityId } from "@/lib/cities";

import { LotusIcon, ParisIcon } from "./icons";

const OPTIONS = [
  { icon: <ParisIcon />, id: "paris", label: "Paris" },
  { icon: <LotusIcon size={24} />, id: "phnom-penh", label: "Phnom Penh" },
] as const;

interface CityToggleProps {
  current: CityId;
  onPick: (id: CityId) => void;
}

export const CityToggle = ({ current, onPick }: CityToggleProps) => (
  <fieldset aria-label="City" className="panel segmented">
    {OPTIONS.map(({ icon, id, label }) => (
      <button
        aria-pressed={id === current}
        className="btn seg"
        key={id}
        onClick={() => onPick(id)}
        type="button"
      >
        {icon}
        {label}
      </button>
    ))}
  </fieldset>
);
