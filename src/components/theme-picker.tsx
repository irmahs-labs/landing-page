import { useStoredChoice } from "@/hooks/use-stored-choice";
import { BASE_THEME, THEME_ORDER, THEMES } from "@/lib/themes";
import type { Theme, ThemeId } from "@/lib/themes";

interface ThemePickerProps {
  current: Theme;
  /** Whether theme variations are on; off shows Cute Matcha and no swatches */
  enabled: boolean;
  onPick: (id: ThemeId) => void;
  onToggle: () => void;
}

// Whether the swatches under the panel are out, remembered between visits
const DRAWER = ["hidden", "shown"] as const;

export const ThemePicker = ({
  current,
  enabled,
  onPick,
  onToggle,
}: ThemePickerProps) => {
  const [drawer, saveDrawer] = useStoredChoice("themeDrawer", DRAWER, "shown");
  const open = drawer === "shown";
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
        {/* Tucks the swatches away, keeping the variation on */}
        {enabled && (
          <button
            aria-controls="theme-drawer"
            aria-expanded={open}
            aria-label={open ? "Hide theme colours" : "Show theme colours"}
            className="btn theme-hide"
            onClick={() => saveDrawer(open ? "hidden" : "shown")}
            title={open ? "hide the colours" : "show the colours"}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 15 L12 9 L18 15" />
            </svg>
          </button>
        )}
      </fieldset>
      {enabled && open && (
        <div className="theme-drawer" id="theme-drawer">
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
