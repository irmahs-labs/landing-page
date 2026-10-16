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

/** The fleur-de-lys for Paris: Cute Matcha's fleur-de-lys.svg motif, inlined */
export const ParisIcon = () => (
  <svg aria-hidden="true" height="24" viewBox="-12 -12 24 24" width="24">
    <g fill="#d9786a" stroke="#2f3b34" strokeLinejoin="round" strokeWidth="0.8">
      <path d="M1.5 1 C 4 -4, 10 -6, 10 -1 C 10 2, 7 2, 7 0 C 7 -2, 4 -1, 2.5 3 Z" />
      <path d="M-1.5 1 C -4 -4, -10 -6, -10 -1 C -10 2, -7 2, -7 0 C -7 -2, -4 -1, -2.5 3 Z" />
      <path d="M-1.5 5 C -2 8, -4 10, -6 10 C -4 11, -1 10, 0 8 C 1 10, 4 11, 6 10 C 4 10, 2 8, 1.5 5 Z" />
      <path d="M0 -11 C 4 -7, 4 -2, 0 3 C -4 -2, -4 -7, 0 -11 Z" />
      <rect height="2.6" rx="1.2" width="10" x="-5" y="2.5" />
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
      <circle cx="4.5" cy="4.5" fill="#5c8f48" r="3.8" />
      <circle cx="14.5" cy="4.5" fill="#f2d27a" r="3.8" />
      <circle cx="24.5" cy="4.5" fill="#f0675c" r="3.8" />
      <path
        d="M2.8 4.5 H6.2 M4.5 2.8 V6.2 M12.8 4.5 H16.2 M23 3 L26 6 M26 3 L23 6"
        strokeLinecap="round"
      />
    </g>
  </svg>
);
