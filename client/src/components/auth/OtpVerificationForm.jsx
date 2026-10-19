import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";

const OtpVerificationForm = ({ email, onBackToSignup, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const { verifyOtp, resendOtp } = useAuth();
  const inputRefs = useRef([]);

  // Handle countdown timer for Resend OTP button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];

    // Take last digit if multiple entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input field
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on Backspace if current box is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyOtp(email, fullOtp);
      setSuccessMsg("Email verified successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      await resendOtp(email);
      setSuccessMsg("A new verification code has been sent to your email!");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <span className="anim-pop d3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-icon-tile text-icon-ink">
        <ShieldCheck className="h-[22px] w-[22px]" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-4xl leading-tight text-fg">Verify your email</h2>
        <p className="text-sm leading-relaxed text-muted">
          We sent a 6-digit code to <strong className="break-all font-semibold text-fg">{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="alert-success" role="status">
            {successMsg}
          </div>
        )}

        {/* 6-digit OTP boxes */}
        <div className="grid grid-cols-6 gap-2" role="group" aria-label="Verification code">
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
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="field h-14 min-w-0 px-0 text-center font-mono text-2xl font-semibold"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || otp.join("").length !== 6}
          className="btn btn-primary h-12 w-full text-[15px]"
        >
          {isSubmitting ? "Verifying code..." : "Verify & continue"}
        </button>

        {/* Resend code & change email */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] text-muted">
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={`inline-flex items-center gap-1.5 transition-colors ${
              countdown > 0 ? "cursor-not-allowed" : "cursor-pointer font-semibold text-accent-ink hover:text-fg"
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} aria-hidden="true" />
            <span>{countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}</span>
          </button>

          {onBackToSignup && (
            <button
              type="button"
              onClick={onBackToSignup}
              className="link-underline inline-flex cursor-pointer items-center gap-1 hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Use a different email</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
