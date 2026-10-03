import { THEME_ORDER, THEMES, themeVars } from "./themes";

/**
 * Inline script that applies the saved theme's colours before first paint,
 * so returning visitors don't see a flash of the default theme.
 */
export const themeInitScript = () => {
  const vars = Object.fromEntries(
    THEME_ORDER.map((id) => [id, themeVars(THEMES[id])])
  );
  return `(function(){try{var v=${JSON.stringify(vars)}[localStorage.getItem("theme")];if(!v)return;var s=document.documentElement.style;for(var k in v)s.setProperty(k,v[k]);}catch(e){}})();`;
};
