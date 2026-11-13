import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import {
  FiUser,
  FiMail,
  FiLock,
  FiGift,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
 
/* ---------- Data ---------- */
const pkLogo = "/pk-logo.png"; // public folder wala logo
 
const PERKS = [
  "Save your favourite designs in a wishlist",
  "Get early access to new collections",
  "Earn rewards with your reference code",
];
 
const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  referral: "",
  agree: false,
};
 
/* ---------- Small pieces ---------- */
function Field({ id, label, icon: Icon, error, hint, right, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-medium text-gray-800">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#b8760a]" />
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl border bg-white pl-11 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b8760a] focus:shadow-[0_0_0_3px_rgba(184,118,10,0.15)] ${
            right ? "pr-12" : "pr-4"
          } ${error ? "border-[#7a0a10]" : "border-[#e4d8c0]"}`}
          {...inputProps}
        />
        {right}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-[#7a0a10]">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12.5px] text-gray-500">{hint}</p>
      )}
    </div>
  );
}
 
function SocialButton({ icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#e4d8c0] bg-white text-[14.5px] font-medium text-gray-800 transition hover:border-[#b8760a] hover:bg-[#fdf8ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
    >
      {icon}
      {children}
    </button>
  );
}
 
/* ---------- Page ---------- */
const Signup = () => {
  const [form, setForm] = useState(EMPTY_FORM);
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
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (!form.agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
 
    setSubmitting(true);
    try {
      // TODO: yaha apni signup API call lagao
      console.log({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        referralCode: form.referral.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };
 
  // TODO: Google / Facebook OAuth yaha connect karo
  const handleGoogle = () => console.log("Continue with Google");
  const handleFacebook = () => console.log("Continue with Facebook");
 
  return (
    <main className="grid min-h-screen bg-[#fdf8ee] lg:grid-cols-[1.05fr_1fr]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&display=swap');`}
      </style>
 
      {/* Brand panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#4a0006] via-[#7a0a10] to-[#4a0006] lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#b8760a]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-[#fbe9c2]/10 blur-3xl" />
 
        {/* Logo highlight */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[#fbe9c2]/20 blur-2xl" />
          <Link
            to="/"
            aria-label="PK Jewellery, go to home page"
            className="relative block rounded-[2rem] border border-[#fbe9c2]/60 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] ring-8 ring-[#fbe9c2]/10 transition duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-[#e0a93b]"
          >
            <img
              src={pkLogo}
              alt="PK Jewellery"
              className="h-44 w-44 object-contain xl:h-52 xl:w-52"
              draggable="false"
            />
          </Link>
        </div>
 
        <h2 className="relative mt-10 text-center font-[Fraunces,serif] text-4xl font-normal leading-tight text-[#fbe9c2] [font-optical-sizing:auto] xl:text-[2.75rem]">
          Welcome to the PK family
        </h2>
        <p className="relative mt-3 max-w-sm text-center font-[Fraunces,serif] text-base font-light text-[#fbe9c2]/80">
          Create your account and keep every design you love in one place.
        </p>
 
        <ul className="relative mt-9 space-y-3.5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-[14.5px] text-[#fbe9c2]/90">
              <FiCheckCircle className="h-5 w-5 shrink-0 text-[#e0a93b]" />
              {perk}
            </li>
          ))}
        </ul>
      </aside>
 
      {/* Form panel */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Back to site */}
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#7a0a10] transition hover:text-[#4a0006] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
          >
            <FiArrowLeft className="h-4 w-4" />
            Go back to the site
          </Link>
 
          {/* Logo (mobile) */}
          <div className="mb-6 flex justify-center lg:hidden">
            <Link
              to="/"
              aria-label="PK Jewellery, go to home page"
              className="rounded-2xl border border-[#efe6d2] bg-white p-3 shadow-lg ring-4 ring-[#b8760a]/10 focus:outline-none focus-visible:ring-[#b8760a]"
            >
              <img src={pkLogo} alt="PK Jewellery" className="h-20 w-20 object-contain" draggable="false" />
            </Link>
          </div>
 
          <div className="rounded-3xl border border-[#efe6d2] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(122,10,16,0.35)] sm:p-9">
            <h1 className="text-center font-[Fraunces,serif] text-3xl font-normal text-gray-900 [font-optical-sizing:auto]">
              Create your account
            </h1>
            <p className="mt-2 text-center font-[Fraunces,serif] text-[15px] font-light text-gray-600">
              Join PK Jewellery in less than a minute.
            </p>
 
            {/* Social */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <SocialButton onClick={handleGoogle} icon={<FcGoogle className="h-5 w-5" />}>
                Google
              </SocialButton>
              <SocialButton onClick={handleFacebook} icon={<FaFacebookF className="h-4 w-4 text-[#1877F2]" />}>
                Facebook
              </SocialButton>
            </div>
 
            <div className="my-6 flex items-center gap-4 text-[13px] text-gray-400">
              <span className="h-px flex-1 bg-[#efe6d2]" />
              or sign up with email
              <span className="h-px flex-1 bg-[#efe6d2]" />
            </div>
 
            {/* Email form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field
                id="signup-name"
                label="Full name"
                icon={FiUser}
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
              />
 
              <Field
                id="signup-email"
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
                id="signup-password"
                label="Password"
                icon={FiLock}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={update("password")}
                error={errors.password}
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
 
              <Field
                id="signup-referral"
                label="Reference code (optional)"
                icon={FiGift}
                type="text"
                autoComplete="off"
                placeholder="Enter code if you have one"
                value={form.referral}
                onChange={update("referral")}
                hint="Got a code from a friend? Add it here."
                style={{ textTransform: "uppercase" }}
              />
 
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-5 text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={update("agree")}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#e4d8c0] accent-[#7a0a10]"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className="font-medium text-[#7a0a10] underline underline-offset-2">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="font-medium text-[#7a0a10] underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.agree && <p className="mt-1.5 text-[12.5px] text-[#7a0a10]">{errors.agree}</p>}
              </div>
 
              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-[#7a0a10] text-[15px] font-medium text-[#fbe9c2] shadow-md transition hover:bg-[#4a0006] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>
 
            <p className="mt-6 text-center text-[14px] text-gray-600">
              Already have an account?{" "}
              <Link to="/Login" className="font-medium text-[#7a0a10] underline underline-offset-4 hover:text-[#4a0006]">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
 
export default Signup;
 