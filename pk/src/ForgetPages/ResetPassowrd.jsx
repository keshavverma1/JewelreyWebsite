import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import api from "../api/api";

const LOGO = "http://localhost:5173/pk-logo.png";
const GOLD = "#d4a64a";
const MAROON = "rgb(90, 2, 9)";
const MIN_LENGTH = 8;

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.8 9.8 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
    </svg>
  );

const ResetPassowrd = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");

  const loading = status === "loading";
  const done = status === "done";

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit =
    password.length >= MIN_LENGTH && passwordsMatch && !loading && !done;

  // Direct URL access protection
  if (!email || !otp) {
    return <Navigate to="/Login" replace />;
  }

  const validate = () => {
    if (password.length < MIN_LENGTH) {
      return `Password must be at least ${MIN_LENGTH} characters.`;
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || done) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      // NOTE: apne backend ke hisaab se endpoint change kar lena
      const response = await api.post("/api/user/reset-password", {
        email,
        otp,
        password,
      });

      if (response.data.success) {
        toast.success(
          response.data.message || "Password reset successfully"
        );
        setStatus("done");

        setTimeout(() => {
          navigate("/Login", { replace: true });
        }, 1200);
      } else {
        throw new Error(response.data.message || "Could not reset password");
      }
    } catch (err) {
      setStatus("error");
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not reset password. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border-2 bg-[#fffaf0] py-3 pl-4 pr-12 text-sm text-[#5a0209] outline-none transition placeholder:text-[#b9a99a] focus:border-[#d4a64a] disabled:opacity-60";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf6ea] px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e8d9b5] bg-white shadow-xl">
        {/* Header */}
        <div
          className="relative overflow-hidden px-6 pb-12 pt-8 text-center"
          style={{ backgroundColor: MAROON }}
        >
          <img
            src={LOGO}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-10 w-56 select-none"
            style={{
              filter: "invert(1) hue-rotate(180deg)",
              mixBlendMode: "screen",
              opacity: 0.08,
            }}
          />

          <Link
            to="/"
            aria-label="PK Jewels home"
            className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white p-2.5"
            style={{
              boxShadow: `0 0 0 3px ${GOLD}, 0 0 28px rgba(212,166,74,0.5)`,
            }}
          >
            <img
              src={LOGO}
              alt="PK Jewels"
              className="h-full w-full object-contain"
            />
          </Link>

          <h1 className="relative mt-5 text-2xl font-semibold tracking-wide text-white">
            Set New Password
          </h1>

          <div
            className="relative mx-auto mt-4 h-px w-40"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-8 pt-7 text-center">
          <p className="text-sm leading-6 text-[#5b4a42]">
            Create a new password for{" "}
            <span className="font-semibold text-[#8a1c1c]">{email}</span>.
          </p>

          {/* New password */}
          <div className="mt-6 text-left">
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-[#5b4a42]"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                disabled={loading || done}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setStatus("idle");
                }}
                placeholder={`At least ${MIN_LENGTH} characters`}
                className={inputClass}
                style={{
                  borderColor: done
                    ? "#2e7d32"
                    : password
                    ? GOLD
                    : "#e8d9b5",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7a70] hover:text-[#5a0209]"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="mt-4 text-left">
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-[#5b4a42]"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                disabled={loading || done}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                  setStatus("idle");
                }}
                placeholder="Re-enter your password"
                className={inputClass}
                style={{
                  borderColor: done
                    ? "#2e7d32"
                    : confirmPassword && !passwordsMatch
                    ? "#c62828"
                    : confirmPassword
                    ? GOLD
                    : "#e8d9b5",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7a70] hover:text-[#5a0209]"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>

            {confirmPassword && !passwordsMatch && (
              <p className="mt-1.5 text-xs text-[#c62828]">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Error */}
          <p
            className="mt-3 min-h-[20px] text-sm text-[#c62828]"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed"
            style={
              done
                ? { backgroundColor: "#2e7d32", color: "#fff" }
                : {
                    background: `linear-gradient(135deg, #f0cf85, ${GOLD})`,
                    color: "#5a0209",
                    opacity: canSubmit ? 1 : 0.55,
                  }
            }
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#5a0209]/30 border-t-[#5a0209]" />
            )}
            {done
              ? "✓ Password updated"
              : loading
              ? "Updating..."
              : "Reset Password"}
          </button>

          {done && (
            <p className="mt-3 text-sm text-[#2e7d32]">
              Your password has been reset. Redirecting to login...
            </p>
          )}

          {!done && (
            <p className="mt-5 text-sm">
              <Link
                to="/Login"
                className="text-[#8a7a70] underline underline-offset-2 hover:text-[#5a0209]"
              >
                Back to login
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassowrd;
