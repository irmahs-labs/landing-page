import { BASE_THEME, THEME_ORDER, THEMES } from "@/lib/themes";
import type { Theme, ThemeId } from "@/lib/themes";

interface ThemePickerProps {
  current: Theme;
  /** Whether theme variations are on; off shows Cute Matcha and no swatches */
  enabled: boolean;
  onPick: (id: ThemeId) => void;
  onToggle: () => void;
}

export const ThemePicker = ({
  current,
  enabled,
  onPick,
  onToggle,
}: ThemePickerProps) => {
  // Cute Matcha is the page itself, not a variation, so it goes unnamed
  const named = current.id !== BASE_THEME;
  return (
    <div className="theme-col">
      <fieldset aria-label="Theme variations" className="panel theme-panel">
        <span className="panel-label">Theme variations</span>
        <button
          aria-checked={enabled}
          aria-label="Theme variations"
          className="btn theme-switch"
          onClick={onToggle}
          role="switch"
          title={
            enabled ? "turn theme variations off" : "turn theme variations on"
          }
          type="button"
        >
          <span className="theme-switch-track" />
        </button>
      </fieldset>
      {enabled && (
        <div className="theme-drawer">
          <fieldset aria-label="Theme colours" className="swatches">
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
          </fieldset>
          {named && <span className="pill">{current.label}</span>}
          {/* The variations' animals and flowers come from Flaticon */}
          <a
            className="credit"
            href="https://www.flaticon.com"
            rel="noreferrer"
            target="_blank"
          >
            icons from flaticon
          </a>
        </div>
      )}
    </div>
  );
};
