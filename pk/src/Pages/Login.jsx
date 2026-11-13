import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
 
const pkLogo = "/pk-logo.png"; // public folder wala logo
 
/* ---------- Small pieces ---------- */
function Field({ id, label, icon: Icon, error, right, labelRight, ...inputProps }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-[13.5px] font-medium text-gray-800">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#b8760a]" />
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl border bg-[#fdf8ee] pl-11 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b8760a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,118,10,0.15)] ${
            right ? "pr-12" : "pr-4"
          } ${error ? "border-[#7a0a10]" : "border-[#e4d8c0]"}`}
          {...inputProps}
        />
        {right}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-[#7a0a10]">
          {error}
        </p>
      )}
    </div>
  );
}
 
function SocialIconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-12 w-12 place-items-center rounded-full border border-[#e4d8c0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8760a] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
 
/* ---------- Page ---------- */
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
 
  const update = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };
 
  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!form.password) next.password = "Please enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
 
    setSubmitting(true);
    try {
      // TODO: yaha apni login API call lagao
      console.log({
        email: form.email.trim(),
        password: form.password,
        remember: form.remember,
      });
    } finally {
      setSubmitting(false);
    }
  };
 
  // TODO: Google / Facebook OAuth yaha connect karo
  const handleGoogle = () => console.log("Continue with Google");
  const handleFacebook = () => console.log("Continue with Facebook");
 
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-br from-[#4a0006] via-[#7a0a10] to-[#4a0006] px-4 pb-12 pt-6">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&display=swap');`}
      </style>
 
      {/* Background glow + faint logo watermark */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#b8760a]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#fbe9c2]/10 blur-3xl" />
      <img
        src={pkLogo}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="pointer-events-none absolute -bottom-24 -right-16 hidden h-[28rem] w-[28rem] rotate-12 select-none object-contain opacity-[0.06] mix-blend-screen sm:block"
      />
 
      {/* Top bar */}
      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#fbe9c2]/30 bg-white/5 px-4 py-2 text-[14px] font-medium text-[#fbe9c2] backdrop-blur transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fbe9c2]"
        >
          <FiArrowLeft className="h-4 w-4" />
          Go back to the site
        </Link>
 
        <Link
          to="/signup"
          className="hidden text-[14px] text-[#fbe9c2]/80 transition hover:text-[#fbe9c2] sm:inline"
        >
          New here? <span className="font-medium underline underline-offset-4">Create account</span>
        </Link>
      </div>
 
      {/* Card with logo medallion */}
      <div className="relative z-10 mt-16 w-full max-w-md sm:mt-20">
        <Link
          to="/"
          aria-label="PK Jewellery, go to home page"
          className="absolute left-1/2 top-0 z-20 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#e0a93b] bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] ring-8 ring-[#fbe9c2]/15 transition duration-300 hover:scale-105 focus:outline-none focus-visible:ring-[#fbe9c2]"
        >
          <img src={pkLogo} alt="PK Jewellery" className="h-[4.5rem] w-[4.5rem] object-contain" draggable="false" />
        </Link>
 
        <div className="rounded-3xl bg-white px-6 pb-8 pt-20 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)] sm:px-9">
          <h1 className="text-center font-[Fraunces,serif] text-3xl font-normal text-gray-900 [font-optical-sizing:auto]">
            Welcome back
          </h1>
          <p className="mt-2 text-center font-[Fraunces,serif] text-[15px] font-light text-gray-600">
            Log in to see your wishlist and saved designs.
          </p>
 
          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
            <Field
              id="login-email"
              label="Email address"
              icon={FiMail}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              error={errors.email}
            />
 
            <Field
              id="login-password"
              label="Password"
              icon={FiLock}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
              labelRight={
                <Link
                  to="/forgot-password"
                  className="text-[13px] font-medium text-[#7a0a10] underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              }
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-gray-500 transition hover:text-[#7a0a10] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a]"
                >
                  {showPassword ? <FiEyeOff className="h-[18px] w-[18px]" /> : <FiEye className="h-[18px] w-[18px]" />}
                </button>
              }
            />
 
            <label className="flex cursor-pointer items-center gap-3 text-[13.5px] text-gray-600">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={update("remember")}
                className="h-4 w-4 rounded border-[#e4d8c0] accent-[#7a0a10]"
              />
              Keep me logged in
            </label>
 
            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full bg-[#7a0a10] text-[15px] font-medium text-[#fbe9c2] shadow-md transition hover:bg-[#4a0006] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>
 
          {/* Social: round icon buttons */}
          <div className="my-6 flex items-center gap-4 text-[13px] text-gray-400">
            <span className="h-px flex-1 bg-[#efe6d2]" />
            or continue with
            <span className="h-px flex-1 bg-[#efe6d2]" />
          </div>
 
          <div className="flex items-center justify-center gap-4">
            <SocialIconButton label="Continue with Google" onClick={handleGoogle}>
              <FcGoogle className="h-6 w-6" />
            </SocialIconButton>
            <SocialIconButton label="Continue with Facebook" onClick={handleFacebook}>
              <FaFacebookF className="h-5 w-5 text-[#1877F2]" />
            </SocialIconButton>
          </div>
 
          <p className="mt-7 text-center text-[14px] text-gray-600">
            New to PK Jewellery?{" "}
            <Link to="/Signup" className="font-medium text-[#7a0a10] underline underline-offset-4 hover:text-[#4a0006]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
 
export default Login;
 