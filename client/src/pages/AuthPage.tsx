/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState<any>({
    identifier: "",
    password: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
  });

  const { login, register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location.state?.from ?? "/";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await login({ identifier: form.identifier.trim(), password: form.password });
    navigate(redirectTo, { replace: true });
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    await register({
      email: form.email.trim().toLowerCase(),
      username: form.username.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName?.trim() || undefined,
    });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex items-center justify-center p-[2.4rem]">
      <div className="w-full max-w-[56rem]">
        {/* Brand */}
        <div className="mb-[2.4rem] text-center">
          <h1 className="text-[3.2rem] leading-[1.2] font-semibold">
            chatie <span className="text-indigo-400">auth</span>
          </h1>
          <p className="mt-[0.8rem] text-[1.4rem] text-gray-400">
            {mode === "login"
              ? "Welcome back. Please sign in."
              : "Create your account to start chatting."}
          </p>
        </div>

        {/* Card */}
        <div className="border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-[1.6rem]">
          {/* Tabs */}
          <div className="grid grid-cols-2 rounded-t-[1.6rem] overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={[
                "p-[1.4rem] px-[1.6rem] text-[1.6rem] font-semibold transition-colors",
                mode === "login"
                  ? "text-white bg-gray-900/60"
                  : "text-gray-300 hover:text-gray-100",
              ].join(" ")}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={[
                "p-[1.4rem] px-[1.6rem] text-[1.6rem] font-semibold transition-colors",
                mode === "signup"
                  ? "text-white bg-gray-900/60"
                  : "text-gray-300 hover:text-gray-100",
              ].join(" ")}
            >
              Sign up
            </button>
          </div>

          <div className="p-[2.4rem]">
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-[1rem] p-[1.2rem] text-[1.4rem] mb-[1.6rem]">
                {error}
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="grid gap-[1.6rem]">
                <div>
                  <label className="text-gray-300 text-[1.4rem]">Identifier</label>
                  <input
                    name="identifier"
                    value={form.identifier}
                    onChange={onChange}
                    placeholder="sasha1 or sasha1@example.com"
                    required
                    className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-[1.4rem]">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <button
                  disabled={isLoading}
                  className="w-full p-[1.4rem] px-[1.6rem] text-[1.6rem] font-semibold rounded-[1rem] bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in…" : "Sign in"}
                </button>

                <p className="text-gray-400 text-center text-[1.4rem]">
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-[0.4rem] font-semibold"
                  >
                    Create one
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="grid gap-[1.6rem]">
                <div>
                  <label className="text-gray-300 text-[1.4rem]">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-[1.4rem]">Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    required
                    minLength={3}
                    className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-[1.4rem]">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    minLength={8}
                    className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-[1.2rem]">
                  <div>
                    <label className="text-gray-300 text-[1.4rem]">First name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={onChange}
                      required
                      className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-[1.4rem]">Last name (optional)</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={onChange}
                      className="block w-full mt-[0.6rem] p-[1.2rem] text-[1.6rem] rounded-[1rem] border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className="w-full p-[1.4rem] px-[1.6rem] text-[1.6rem] font-semibold rounded-[1rem] bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating…" : "Create account"}
                </button>

                <p className="text-gray-400 text-center text-[1.4rem]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-[0.4rem] font-semibold"
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-gray-500 mt-[2rem] text-center text-[1.2rem]">
          By continuing you agree to our Terms & Privacy.
        </p>
      </div>
    </div>
  );
}
