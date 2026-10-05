const PETAL = "M0 0 C 5 -3, 7 -9, 0 -11 C -7 -9, -5 -3, 0 0 Z";

/** The romduol: three-petal flower used for Phnom Penh and the profile */
export const LotusIcon = ({ size }: { size: number }) => (
  <svg aria-hidden="true" height={size} viewBox="-12 -12 24 24" width={size}>
    <g fill="#fff3cf" stroke="#2f3b34" strokeLinejoin="round" strokeWidth="0.9">
      <path d={PETAL} />
      <path d={PETAL} transform="rotate(120)" />
      <path d={PETAL} transform="rotate(240)" />
    </g>
    <circle fill="#f2d27a" r="4.2" stroke="#2f3b34" strokeWidth="0.9" />
    <path
      d="M0 -4 V0 M0 0 L3.6 2.1 M0 0 L-3.6 2.1"
      fill="none"
      stroke="#2f3b34"
      strokeWidth="0.6"
    />
  </svg>
);

export const ParisIcon = () => (
  <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
    <g fill="#d9786a" stroke="#2f3b34" strokeLinejoin="round" strokeWidth="1">
      <path d="M12 2 C15 6 15 10 12 13 C9 10 9 6 12 2 Z" />
      <path d="M11 13 C7 13 3 11 4 7 C6 9 8 9 9 8 C9 10 10 12 11 13 Z" />
      <path d="M13 13 C17 13 21 11 20 7 C18 9 16 9 15 8 C15 10 14 12 13 13 Z" />
      <rect height="2.5" rx="1" width="10" x="7" y="13" />
      <path d="M10 15.5 L9 21 L12 19 L15 21 L14 15.5 Z" />
    </g>
  </svg>
);

/** The three window buttons on the right of a title bar: plus, minus, close */
export const WindowButtons = () => (
  <svg
    aria-hidden="true"
    className="win-buttons"
    height="13"
    viewBox="0 0 29 9"
    width="41"
  >
    <g stroke="#2f3b34" strokeWidth="1">
      <circle cx="4.5" cy="4.5" fill="#5fc35a" r="3.8" />
      <circle cx="14.5" cy="4.5" fill="#f5c04a" r="3.8" />
      <circle cx="24.5" cy="4.5" fill="#f0675c" r="3.8" />
      <path
        d="M2.8 4.5 H6.2 M4.5 2.8 V6.2 M12.8 4.5 H16.2 M23 3 L26 6 M26 3 L23 6"
        strokeLinecap="round"
      />
    </g>
  </svg>
);
