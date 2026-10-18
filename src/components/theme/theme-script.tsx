export const THEME_STORAGE_KEY = "valtrex-theme";

/**
 * Runs synchronously in <head> before first paint: applies the saved theme (or the system
 * preference) so there is never a flash of the wrong theme. Only reads localStorage; no cookies.
 */
const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
