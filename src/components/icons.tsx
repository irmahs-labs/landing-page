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

// Tokkae's head, pixel by pixel, as drawn in app/icon.svg (the favicon)
const SITE_ICON = [
  {
    fill: "#b8d970",
    px: "M4 0h4v1H4zM3 1h2v1H3zM6 1h1v1H6zM2 2h1v1H2zM4 2h4v1H4zM9 2h2v1H9zM2 3h2v1H2zM5 3h3v1H5zM9 3h2v1H9zM4 4h5v1H4zM4 5h5v1H4zM5 6h3v1H5z",
  },
  { fill: "#5c8f48", px: "M5 1h1v1H5zM3 2h1v1H3zM4 6h1v1H4zM8 6h1v1H8z" },
  {
    fill: "#d9786a",
    px: "M2 4h2v1H2zM9 4h2v1H9zM3 5h1v1H3zM9 5h1v1H9z",
  },
  { fill: "#2f3b34", px: "M4 3h1v1H4zM8 3h1v1H8z" },
  { fill: "#fff3cf", px: "M8 0h1v1H8zM7 1h1v1H7zM9 1h1v1H9zM8 2h1v1H8z" },
  { fill: "#f2d27a", px: "M8 1h1v1H8z" },
] as const;

/**
 * The site's icon, 40 × 40 in the Header: Tokkae with its flower, the same
 * drawing as the favicon, in its own colours in both themes
 */
export const SiteIcon = ({ size = 40 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    className="site-icon"
    height={size}
    viewBox="2 -1 9 9"
    width={size}
  >
    {SITE_ICON.map(({ fill, px }) => (
      <path d={px} fill={fill} key={fill} />
    ))}
  </svg>
);

/** An open eye, for how many are looking at the page; it takes the text's colour */
export const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M2 12 C 5 6.5, 19 6.5, 22 12 C 19 17.5, 5 17.5, 2 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  </svg>
);

/** A door with an arrow leaving it, for signing out; it takes the text's colour */
export const SignOutIcon = ({ size = 18 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M14 8 V6 a2 2 0 0 0 -2 -2 H6 a2 2 0 0 0 -2 2 v12 a2 2 0 0 0 2 2 h6 a2 2 0 0 0 2 -2 v-2" />
      <path d="M9 12 H21 M18 9 L21 12 L18 15" />
    </g>
  </svg>
);
