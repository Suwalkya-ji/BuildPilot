import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";

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

  if (stage === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Password Reset Successful!</h2>
          <p className="text-xs text-slate-400 font-medium">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToLogin}
          className="nav-glow-btn w-full mt-4"
        >
          <span className="nav-glow-btn-inner bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 w-full py-3 text-xs text-white font-bold">
            Back to Sign In
          </span>
        </button>
      </div>
    );
  }

  if (stage === "reset") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Enter the 6-digit code sent to <br />
            <span className="text-rose-300 font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleResetSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-bold text-center">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs text-cyan-300 font-medium text-center">
              {infoMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">6-Digit Security Code</label>
            <div className="flex justify-between items-center gap-2 px-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="w-11 h-13 rounded-xl bg-[#0b0d13]/90 border border-white/15 text-center text-lg font-bold text-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 focus:outline-none transition shadow-inner"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-[#0b0d13]/90 border border-white/15 pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition text-[11px] flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-[#0b0d13]/90 border border-white/15 pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.join("").length !== 6}
            className="nav-glow-btn w-full mt-2 disabled:opacity-50"
          >
            <span className="nav-glow-btn-inner bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 w-full py-3 text-xs text-white font-bold">
              {isSubmitting ? "Updating Password..." : "Reset Password"}
            </span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium inline-flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Forgot Password?</h2>
        <p className="text-xs text-slate-400 font-medium">
          Enter your registered email address and we'll send you a password reset code.
        </p>
      </div>

      <form onSubmit={handleRequestSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-bold">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="janedoe@buildpilot.ai"
              className="w-full rounded-xl bg-[#0b0d13]/90 border border-white/15 pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="nav-glow-btn w-full mt-2"
        >
          <span className="nav-glow-btn-inner bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 w-full py-3 text-xs text-white font-bold">
            {isSubmitting ? "Sending Reset Code..." : "Send Reset Code"}
          </span>
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium inline-flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
