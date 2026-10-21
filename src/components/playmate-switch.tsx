interface PlaymateSwitchProps {
  /** Whether Tokkae's playmate, Coq the rooster, is out */
  on: boolean;
  onToggle: () => void;
}

/** In the header: brings Tokkae's playmate out to play, or sends it home */
export const PlaymateSwitch = ({ on, onToggle }: PlaymateSwitchProps) => (
  <fieldset aria-label="Playmate" className="panel playmate-panel">
    <span className="panel-label">Playmate</span>
    <button
      aria-checked={on}
      aria-label="Playmate"
      className="btn playmate-switch"
      onClick={onToggle}
      role="switch"
      title={on ? "send the playmate home" : "bring Tokkae a playmate"}
      type="button"
    >
      <span className="playmate-switch-track" />
    </button>
  </fieldset>
);
