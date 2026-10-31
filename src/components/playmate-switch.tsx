import { useCopy } from "@/lib/language";

const COPY = {
  en: {
    bring: "bring Tokkae a playmate",
    home: "send the playmate home",
    label: "Playmate",
  },
  fr: {
    bring: "trouver un copain à Tokkae",
    home: "renvoyer le copain à la maison",
    label: "Copain",
  },
};

interface PlaymateSwitchProps {
  /** Whether Tokkae's playmate, Coq the rooster, is out */
  on: boolean;
  onToggle: () => void;
}

/** In the header: brings Tokkae's playmate out to play, or sends it home */
export const PlaymateSwitch = ({ on, onToggle }: PlaymateSwitchProps) => {
  const t = useCopy(COPY);

  return (
    <fieldset aria-label={t.label} className="panel playmate-panel">
      <span className="panel-label">{t.label}</span>
      <button
        aria-checked={on}
        aria-label={t.label}
        className="btn playmate-switch"
        onClick={onToggle}
        role="switch"
        title={on ? t.home : t.bring}
        type="button"
      >
        <span className="playmate-switch-track" />
      </button>
    </fieldset>
  );
};
