import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import TextField from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";
import { loginSchema, signupSchema } from "../schemas/authSchema";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setErrors({});
    setServerError("");
    setValues({
      name: "",
      email: "",
      password: "",
    });
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const schema = isSignup ? signupSchema : loginSchema;
    const result = schema.safeParse(values);

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      if (isSignup) await signup(result.data);
      else await login(result.data);
      navigate("/events");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const heading = isSignup ? "Create your account" : "Welcome back";
  const subtitle = isSignup
    ? "Join your community in a minute."
    : "Log in to see what's on.";

  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      <div
        className="hidden text-white md:flex md:flex-col md:justify-between md:p-12"
        style={{
          background:
            "linear-gradient(150deg, var(--color-brand-500), var(--color-brand-700))",
        }}
      >
        <span className="font-display text-2xl font-extrabold">Gatherly</span>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Find what's happening around you.
          </h2>
          <p className="mt-3 max-w-sm text-white/80">
            Discover local events, RSVP in a tap, and keep track of everything
            you're going to.
          </p>
        </div>
        <span className="text-sm text-white/60">
          Your community, in one place.
        </span>
      </div>

      <div className="flex min-h-screen flex-col">
        <div
          className="rounded-b-[2rem] px-6 pt-12 pb-9 text-white md:hidden"
          style={{
            background:
              "linear-gradient(150deg, var(--color-brand-500), var(--color-brand-700))",
          }}
        >
          <span className="font-display text-2xl font-extrabold">Gatherly</span>
          <h1 className="mt-8 text-3xl font-extrabold text-white">{heading}</h1>
          <p className="mt-2 text-white/80">{subtitle}</p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <div className="hidden md:block">
              <h1 className="text-3xl">{heading}</h1>
              <p className="mt-2 text-ink-500">{subtitle}</p>
            </div>

            {serverError && (
              <div
                className="mb-4 mt-6 rounded-md px-3 py-2 text-sm md:mt-0"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-danger) 12%, white)",
                  color: "var(--color-danger)",
                }}
              >
                {serverError}
              </div>
            )}

            <form
              className="space-y-4 md:mt-6"
              onSubmit={handleSubmit}
              noValidate
            >
              {isSignup && (
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  placeholder="Alex Rivera"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name?.[0]}
                />
              )}
              <TextField
                id="email"
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                error={errors.email?.[0]}
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder={
                  isSignup ? "At least 8 characters" : "Your password"
                }
                value={values.password}
                onChange={handleChange}
                error={errors.password?.[0]}
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={submitting}
              >
                {submitting
                  ? "Please wait…"
                  : isSignup
                    ? "Create account"
                    : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-500 md:text-left">
              {isSignup ? "Already have an account? " : "New here? "}
              <Link
                to={isSignup ? "/login" : "/signup"}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                {isSignup ? "Log in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
