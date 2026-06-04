import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { Button, Input } from "../components/shared/index";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const location = useLocation();
  const [form, setForm] = useState({
    token: location.state?.token || "",
    email: location.state?.email || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authAPI.verifyEmail(form.token);
      toast.success("Email verified");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-700 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Verify Email</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" value={form.email} disabled />
          <Input label="Verification Token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
          <Button type="submit" loading={loading} className="w-full">Verify</Button>
        </form>
        <p className="text-sm text-gray-400 mt-4">
          Go to <Link to="/login" className="text-primary-400">login</Link>
        </p>
      </div>
    </div>
  );
}
