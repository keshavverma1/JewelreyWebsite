
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";
import { Auth } from "../context/AuthContext";

const LOGO = "http://localhost:5173/pk-logo.png";
const GOLD = "#d4a64a";
const MAROON = "rgb(90, 2, 9)";
const OTP_LENGTH = 6;

const OtpVerification = () => {
  const { setUser } = useContext(Auth);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const initialExpiry = location.state?.otpExpiry;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(initialExpiry || null);
  const [timer, setTimer] = useState(() => {
    if (!initialExpiry) return 0;

    return Math.max(
      0,
      Math.ceil(
        (new Date(initialExpiry).getTime() - Date.now()) / 1000
      )
    );
  });

  const [resending, setResending] = useState(false);

  const inputs = useRef([]);

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;

  // Update expiry if location state changes
  useEffect(() => {
    if (initialExpiry) {
      setOtpExpiry(initialExpiry);
    }
  }, [initialExpiry]);

  // Countdown based on backend expiry
  useEffect(() => {
    if (!otpExpiry) {
      setTimer(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(otpExpiry).getTime() - Date.now()) / 1000
        )
      );

      setTimer(remaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [otpExpiry]);

  // Focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const focusAt = (i) => {
    inputs.current[
      Math.min(Math.max(i, 0), OTP_LENGTH - 1)
    ]?.focus();
  };

  // Handle OTP input
  const handleChange = (i, value) => {
    if (status === "verified" || status === "loading") return;

    const digit = value.replace(/\D/g, "").slice(-1);

    setError("");
    setStatus("idle");

    setDigits((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });

    if (digit) focusAt(i + 1);
  };

  // Keyboard navigation
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i]) {
      focusAt(i - 1);
    } else if (e.key === "ArrowLeft") {
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(i + 1);
    } else if (e.key === "Enter" && isComplete) {
      handleVerify();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((d, idx) => {
      next[idx] = d;
    });

    setDigits(next);
    setError("");
    setStatus("idle");

    focusAt(
      pasted.length >= OTP_LENGTH
        ? OTP_LENGTH - 1
        : pasted.length
    );
  };

  // Verify OTP
  const handleVerify = async () => {
    if (
      !isComplete ||
      status === "loading" ||
      status === "verified"
    ) {
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await api.post("/api/user/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        toast.success(
          response.data.message || "Email verified successfully"
        );

        setStatus("verified");
        setUser(response.data.user);

        navigate("/", { replace: true });
      }
    } catch (err) {
      setStatus("error");

      setError(
        err?.response?.data?.message ||
          "Invalid OTP. Please try again."
      );

      setDigits(Array(OTP_LENGTH).fill(""));
      focusAt(0);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (
      timer > 0 ||
      resending ||
      status === "loading"
    ) {
      return;
    }

    setResending(true);
    setError("");

    try {
      const response = await api.post("/api/user/resend-otp", {
        email,
      });

      if (response.data.success) {
        if (!response.data.otpExpiry) {
          throw new Error("OTP expiry was not received from server");
        }

        toast.success(
          response.data.message || "OTP resent successfully"
        );

        // Set new expiry received from backend
        setOtpExpiry(response.data.otpExpiry);

        setDigits(Array(OTP_LENGTH).fill(""));
        setError("");
        setStatus("idle");

        focusAt(0);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const verified = status === "verified";
  const loading = status === "loading";

  // Direct URL access protection
  if (!email || !initialExpiry) {
    return <Navigate to="/Signup" replace />;
  }

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
            Verify Your Account
          </h1>

          <div
            className="relative mx-auto mt-4 h-px w-40"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-8 pt-7 text-center">

          <p className="text-sm leading-6 text-[#5b4a42]">
            We have sent a 6-digit verification code to{" "}
            <span className="font-semibold text-[#8a1c1c]">
              {email}
            </span>
            . Enter it below to continue.
          </p>

          {/* OTP boxes */}
          <div
            className="mt-6 flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={d}
                disabled={verified || loading}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                aria-label={`Digit ${i + 1}`}
                className="h-12 w-11 rounded-xl border-2 bg-[#fffaf0] text-center text-xl font-semibold text-[#5a0209] outline-none transition focus:scale-105 sm:h-14 sm:w-12"
                style={{
                  borderColor: verified
                    ? "#2e7d32"
                    : status === "error"
                    ? "#c62828"
                    : d
                    ? GOLD
                    : "#e8d9b5",
                  boxShadow:
                    d && !verified
                      ? "0 0 0 3px rgba(212,166,74,0.18)"
                      : "none",
                }}
              />
            ))}
          </div>

          {/* Error */}
          <p
            className="mt-3 min-h-[20px] text-sm text-[#c62828]"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete || loading || verified}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed"
            style={
              verified
                ? { backgroundColor: "#2e7d32", color: "#fff" }
                : {
                    background: `linear-gradient(135deg, #f0cf85, ${GOLD})`,
                    color: "#5a0209",
                    opacity: isComplete && !loading ? 1 : 0.55,
                  }
            }
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#5a0209]/30 border-t-[#5a0209]" />
            )}

            {verified
              ? "✓ Verified"
              : loading
              ? "Verifying..."
              : "Verify"}
          </button>

          {verified && (
            <p className="mt-3 text-sm text-[#2e7d32]">
              Your account has been verified successfully.
            </p>
          )}

          {/* Resend */}
          {!verified && (
            <p className="mt-5 text-sm text-[#5b4a42]">
              Didn't receive the code?{" "}

              {timer > 0 ? (
                <span className="text-[#8a7a70]">
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading || resending}
                  className="font-semibold text-[#8a1c1c] underline underline-offset-2 hover:text-[#5a0209] disabled:opacity-60"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
