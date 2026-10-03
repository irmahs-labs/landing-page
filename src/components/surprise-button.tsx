interface SurpriseButtonProps {
  active: boolean;
  onClick: () => void;
}

export const SurpriseButton = ({ active, onClick }: SurpriseButtonProps) => (
  <div className="surprise-col">
    <button
      aria-pressed={active}
      className="btn panel surprise"
      onClick={onClick}
      title="surprise me"
      type="button"
    >
      <span className="surprise-icon">
        <svg
          aria-hidden="true"
          fill="none"
          height="22"
          stroke="#fff3cf"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="22"
        >
          <path d="M4.5 11 H19.5 V20.5 H4.5 Z M3 7.5 H21 V11 H3 Z M12 7.5 V20.5 M12 7.5 C10.5 3.5 6.5 4 7.5 6.5 C8.3 7.6 12 7.5 12 7.5 Z M12 7.5 C13.5 3.5 17.5 4 16.5 6.5 C15.7 7.6 12 7.5 12 7.5 Z" />
        </svg>
      </span>
      <span className="surprise-text">surprise me</span>
    </button>
  </div>
);
