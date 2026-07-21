import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`nav-glow-btn ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label="Toggle Theme"
    >
      <span className="nav-glow-btn-inner !px-2.5 !py-1.5">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
