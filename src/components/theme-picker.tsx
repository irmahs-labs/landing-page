import { THEME_ORDER, THEMES } from "@/lib/themes";
import type { Theme, ThemeId } from "@/lib/themes";

interface ThemePickerProps {
  current: Theme;
  onPick: (id: ThemeId) => void;
}

export const ThemePicker = ({ current, onPick }: ThemePickerProps) => (
  <div className="theme-col">
    <fieldset aria-label="Colour theme" className="panel theme-panel">
      <div className="panel-head">
        <span className="panel-label">Theme</span>
        <span className="panel-name">{current.label}</span>
      </div>
      <div className="swatches">
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
