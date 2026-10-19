import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import PasswordInput from "./PasswordInput";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [stage, setStage] = useState("request"); // 'request' | 'reset' | 'success'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (stage === "reset" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [stage]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setInfoMsg(`We've sent a 6-digit reset code to ${email}`);
      setStage("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code. Please check your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit reset code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email,
        otp: fullOtp,
        newPassword,
        confirmPassword,
      });
      setStage("success");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Invalid code or request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backButton = (
    <button
      type="button"
      onClick={onBackToLogin}
      className="link-underline inline-flex cursor-pointer items-center gap-1 self-center text-[13px] font-medium text-muted hover:text-fg"
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Back to sign in</span>
    </button>
  );

  if (stage === "success") {
    return (
      <div className="flex flex-col gap-6">
        <span className="anim-pop flex h-12 w-12 items-center justify-center rounded-[14px] bg-ok-bg text-ok-fg">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-4xl leading-tight text-fg">Password reset</h2>
          <p className="text-sm leading-relaxed text-muted">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <button type="button" onClick={onBackToLogin} className="btn btn-primary h-12 w-full text-[15px]">
          Back to sign in
        </button>
      </div>
    );
  }

  if (stage === "reset") {
    return (
      <div className="flex flex-col gap-6">
        <span className="anim-pop flex h-12 w-12 items-center justify-center rounded-[14px] bg-icon-tile text-icon-ink">
          <KeyRound className="h-[22px] w-[22px]" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-4xl leading-tight text-fg">Reset password</h2>
          <p className="text-sm leading-relaxed text-muted">
            Enter the 6-digit code sent to <strong className="break-all font-semibold text-fg">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="alert-error" role="alert">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="alert-success" role="status">
              {infoMsg}
            </div>
          )}

          <div className="label">
            <span id="reset-code-label">6-digit reset code</span>
            <div className="grid grid-cols-6 gap-2" role="group" aria-labelledby="reset-code-label">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  aria-label={`Digit ${index + 1}`}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="field h-14 min-w-0 px-0 text-center font-mono text-2xl font-semibold"
                />
              ))}
            </div>
          </div>

          <div className="label">
            <label htmlFor="reset-password">New password</label>
            <PasswordInput
              id="reset-password"
              minLength={6}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="label">
            <label htmlFor="reset-confirm">Confirm new password</label>
            <PasswordInput
              id="reset-confirm"
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showPassword}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.join("").length !== 6}
            className="btn btn-primary mt-1 h-12 w-full text-[15px]"
          >
            {isSubmitting ? "Updating password..." : "Reset password"}
          </button>

          {backButton}
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-4xl leading-tight text-fg">Forgot password?</h2>
        <p className="text-sm leading-relaxed text-muted">
          Enter your registered email address and we'll send you a password reset code.
        </p>
      </div>

      <form onSubmit={handleRequestSubmit} className="flex flex-col gap-[18px]">
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="label">
          <label htmlFor="forgot-email">Email address</label>
          <input
            id="forgot-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@buildpilot.ai"
            className="field h-[46px]"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary h-12 w-full text-[15px]">
          {isSubmitting ? "Sending reset code..." : "Send reset code"}
        </button>

        {backButton}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
