import { THEME_ORDER, THEMES } from "@/lib/themes";
import type { Theme, ThemeId } from "@/lib/themes";

interface ThemePickerProps {
  current: Theme;
  /** Whether colour themes are on; off shows Cute Matcha and no swatches */
  enabled: boolean;
  onPick: (id: ThemeId) => void;
  onToggle: () => void;
}

export const ThemePicker = ({
  current,
  enabled,
  onPick,
  onToggle,
}: ThemePickerProps) => (
  <div className="theme-col">
    <fieldset aria-label="Colour theme" className="panel theme-panel">
      <div className="panel-head">
        <span className="panel-label">Theme</span>
        <span className="panel-name">{current.label}</span>
        <button
          aria-checked={enabled}
          aria-label="Colour themes"
          className="btn theme-switch"
          onClick={onToggle}
          role="switch"
          title={enabled ? "turn themes off" : "turn themes on"}
          type="button"
        >
          <span className="theme-switch-track" />
        </button>
      </div>
      <div className="swatches" hidden={!enabled}>
        {THEME_ORDER.map((id) => {
          const th = THEMES[id];
          return (
            <button
              aria-label={`${th.label} theme`}
              aria-pressed={id === current.id}
              className="btn swatch"
              key={id}
              onClick={() => onPick(id)}
              title={th.label}
              type="button"
            >
              <span style={{ backgroundColor: th.swatch }} />
            </button>
          );
        })}
      </div>
    </fieldset>
    <span className="pill">{current.label}</span>
  </div>
);
