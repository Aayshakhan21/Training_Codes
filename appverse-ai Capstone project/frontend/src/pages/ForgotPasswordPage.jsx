import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Button, Input } from "../components/shared/index";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      toast.success("Reset token generated");
      navigate("/reset-password", { state: { token: data.data?.token } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-700 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-400 mb-6">We’ll generate a reset token for this account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" loading={loading} className="w-full">Send Reset Token</Button>
        </form>
        <p className="text-sm text-gray-400 mt-4">
          Back to <Link to="/login" className="text-primary-400">login</Link>
        </p>
      </div>
    </div>
  );
}
