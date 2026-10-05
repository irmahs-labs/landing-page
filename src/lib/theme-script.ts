import { DEFAULT_THEME, THEME_ORDER, THEMES, themeVars } from "./themes";

/**
 * Inline script that applies the saved theme's colours before first paint,
 * so returning visitors who turned themes on don't see a flash of Cute
 * Matcha. With themes off, the stylesheet's own colours are already Matcha.
 */
export const themeInitScript = () => {
  const vars = Object.fromEntries(
    THEME_ORDER.map((id) => [id, themeVars(THEMES[id])])
  );
  return `(function(){try{if(localStorage.getItem("themes")!=="on")return;var a=${JSON.stringify(vars)};var v=a[localStorage.getItem("theme")]||a[${JSON.stringify(DEFAULT_THEME)}];var s=document.documentElement.style;for(var k in v)s.setProperty(k,v[k]);}catch(e){}})();`;
};
