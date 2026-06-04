import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { Button, Input } from "../components/shared/index";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const location = useLocation();
  const [form, setForm] = useState({
    token: location.state?.token || "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword(form);
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-700 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
          <Input label="New Password" type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
        </form>
        <p className="text-sm text-gray-400 mt-4">
          Return to <Link to="/login" className="text-primary-400">login</Link>
        </p>
      </div>
    </div>
  );
}
