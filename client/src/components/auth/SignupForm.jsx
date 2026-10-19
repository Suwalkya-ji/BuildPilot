import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import OtpVerificationForm from "./OtpVerificationForm";
import PasswordInput from "./PasswordInput";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState("signup"); // 'signup' | 'otp'

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signup({ name, email, password, confirmPassword });
      if (result?.requiresOtp) {
        setStep("otp");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "otp") {
    return (
      <OtpVerificationForm
        email={email}
        onBackToSignup={() => setStep("signup")}
        onSuccess={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-4xl leading-tight text-fg">Create account</h2>
        <p className="text-sm text-muted">Join BuildPilot AI and build websites in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="label">
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="field h-[46px]"
          />
        </div>

        <div className="label">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password">Password</label>
          <PasswordInput
            id="signup-password"
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="label">
          <label htmlFor="signup-confirm">Confirm password</label>
          <PasswordInput
            id="signup-confirm"
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            show={showPassword}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-1 h-12 w-full text-[15px]">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="link-underline font-semibold text-accent-ink">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
