import { Eye, EyeOff } from "lucide-react";

// Password field shared by the auth forms. The show/hide button renders only when onToggle is given.
const PasswordInput = ({ id, value, onChange, show, onToggle, minLength, autoComplete = "current-password" }) => {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        required
        minLength={minLength}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder="••••••••••••"
        className={`field h-[46px] ${onToggle ? "pr-11" : ""}`}
      />
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-fg"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
