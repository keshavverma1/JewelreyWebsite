import React, { useState } from "react";

import { FiMail, FiArrowLeft } from "react-icons/fi";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
// import api from "../api/api";

const pkLogo = "/pk-logo.png";

const ForgetPasswordOne = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Direct URL access block
  if (!location.state?.allowForgotPassword) {
    return <Navigate to="/Login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    
try {
  const normalizedEmail = email.trim().toLowerCase();

  const response = await api.post("/api/user/forget", {
    email: normalizedEmail,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "OTP could not be sent");
  }

  navigate("/ForgetPasswordTwo", {
    state: {
      email: normalizedEmail,
      allowForgotPassword: true,
      otpExpiry: response.data.otpExpiry,
    },
  });

} catch (error) {
  setError(
    error.response?.data?.message ||
      error.message ||
      "Something went wrong."
  );
} finally {
  setLoading(false);
}

  };

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-br from-[#4a0006] via-[#7a0a10] to-[#4a0006] px-4 pb-12 pt-6">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&display=swap');`}
      </style>

      {/* Background effects */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#b8760a]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#fbe9c2]/10 blur-3xl" />

      <img
        src={pkLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 hidden h-[28rem] w-[28rem] rotate-12 select-none object-contain opacity-[0.06] mix-blend-screen sm:block"
      />

      {/* Top bar */}
      <div className="relative z-10 flex w-full max-w-5xl items-center">
        <Link
          to="/Login"
          className="inline-flex items-center gap-2 rounded-full border border-[#fbe9c2]/30 bg-white/5 px-4 py-2 text-[14px] font-medium text-[#fbe9c2] backdrop-blur transition hover:bg-white/10"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      {/* Main Card */}
      <div className="relative z-10 mt-20 w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="absolute left-1/2 top-0 z-20 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#e0a93b] bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] ring-8 ring-[#fbe9c2]/15 transition hover:scale-105"
        >
          <img
            src={pkLogo}
            alt="PK Jewellery"
            className="h-[4.5rem] w-[4.5rem] object-contain"
          />
        </Link>

        <div className="rounded-3xl bg-white px-6 pb-9 pt-20 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)] sm:px-9">
          <h1 className="text-center font-[Fraunces,serif] text-3xl font-normal text-gray-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-center font-[Fraunces,serif] text-[15px] font-light leading-relaxed text-gray-600">
            Enter your registered email address. We'll send you an OTP to reset
            your password.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-1.5 block text-[13.5px] font-medium text-gray-800"
              >
                Email address
              </label>

              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#b8760a]" />

                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`h-12 w-full rounded-xl border bg-[#fdf8ee] pl-11 pr-4 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b8760a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,118,10,0.15)] ${
                    error ? "border-[#7a0a10]" : "border-[#e4d8c0]"
                  }`}
                />
              </div>

              {error && (
                <p className="mt-1.5 text-[12.5px] text-[#7a0a10]">{error}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-[#7a0a10] text-[15px] font-medium text-[#fbe9c2] shadow-md transition hover:bg-[#4a0006] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <p className="mt-7 text-center text-[14px] text-gray-600">
            Remember your password?{" "}
            <Link
              to="/Login"
              className="font-medium text-[#7a0a10] underline underline-offset-4 hover:text-[#4a0006]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgetPasswordOne;
