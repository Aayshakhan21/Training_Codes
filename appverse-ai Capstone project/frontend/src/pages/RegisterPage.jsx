// src/pages/RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/shared/index";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", username: "", email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.username.trim() || form.username.length < 3) e.username = "Min 3 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) e.password = "Must include letters and numbers";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await register({ fullName: form.fullName, username: form.username, email: form.email, password: form.password });
    setLoading(false);
    if (result.success) navigate("/verify-email", { state: { token: result.verificationToken, email: form.email } });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-pink-500 shadow-lg shadow-primary-500/30 mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-gray-400 text-sm mt-1">Join AppVerse AI today</p>
        </div>

        <div className="bg-dark-700 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
            <Input label="Username" placeholder="johndoe" value={form.username} onChange={set("username")} error={errors.username} />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} />
            <Input label="Password" type="password" placeholder="Min 8 chars, letters + numbers" value={form.password} onChange={set("password")} error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
