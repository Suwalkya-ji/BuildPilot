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
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/30 to-cyan-400/30 border border-cyan-400/30 mb-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Verify Your Email</h2>
        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
          We've sent a 6-digit security code to <br />
          <span className="text-cyan-300 font-bold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-bold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-bold text-center">
            {successMsg}
          </div>
        )}

        {/* 6-Digit OTP Box Grid */}
        <div className="flex justify-between items-center gap-2 px-1">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-11 h-13 rounded-xl bg-[#0b0d13]/90 border border-white/15 text-center text-lg font-bold text-cyan-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition shadow-inner"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || otp.join("").length !== 6}
          className="nav-glow-btn w-full mt-2 disabled:opacity-50"
        >
          <span className="nav-glow-btn-inner bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 w-full py-3 text-xs text-white font-bold flex items-center justify-center gap-2">
            {isSubmitting ? "Verifying Code..." : "Verify & Continue"}
          </span>
        </button>

        {/* Resend OTP & Change Email Options */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={`text-xs font-semibold flex items-center gap-1.5 transition ${
              countdown > 0 ? "text-slate-500 cursor-not-allowed" : "text-cyan-400 hover:text-cyan-300"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
            <span>
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Verification Code"}
            </span>
          </button>

          {onBackToSignup && (
            <button
              type="button"
              onClick={onBackToSignup}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition font-medium flex items-center gap-1 mt-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Use a different email address</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
