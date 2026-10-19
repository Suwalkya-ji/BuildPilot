import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import OtpVerificationForm from "./OtpVerificationForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState("login"); // 'login' | 'otp' | 'forgot'

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res?.requiresOtp) {
        setStep("otp");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "otp") {
    return (
      <OtpVerificationForm
        email={email}
        onBackToSignup={() => setStep("login")}
        onSuccess={() => navigate("/dashboard")}
      />
    );
  }

  if (step === "forgot") {
    return <ForgotPasswordForm onBackToLogin={() => setStep("login")} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-4xl leading-tight text-fg">Welcome back</h2>
        <p className="text-sm text-muted">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="label">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@buildpilot.ai"
            className="field h-[46px]"
          />
        </div>

        <div className="label">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="login-password">Password</label>
            <button
              type="button"
              onClick={() => setStep("forgot")}
              className="link-underline cursor-pointer font-medium text-accent-ink"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary h-12 w-full text-[15px]">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="link-underline font-semibold text-accent-ink">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
