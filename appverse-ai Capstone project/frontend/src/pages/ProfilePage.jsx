import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Badge } from "../components/shared/index";
import { usersAPI } from "../services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await usersAPI.updateMe(form);
      toast.success("Profile updated!");
      setForm({
        fullName: data.data.fullName || "",
        username: data.data.username || "",
        email: data.data.email || "",
      });
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setSaving(true);
    try {
      await usersAPI.uploadAvatar(avatarFile);
      toast.success("Avatar updated!");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setSaving(false);
    }
  };

  const roleColor = { USER: "neutral", DEVELOPER: "info", ADMIN: "warning" };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="bg-dark-700 border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.fullName || user?.username} className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.[0] || user?.username?.[0] || "U"
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.fullName || user?.username}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={roleColor[user?.role] || "neutral"}>{user?.role}</Badge>
                <span className="text-xs text-gray-600">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              disabled={!editing}
            />
            <Input
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={!editing}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!editing}
            />
            {editing && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-500"
                />
                <Button type="button" variant="secondary" onClick={handleAvatarUpload} loading={saving} disabled={!avatarFile}>
                  Upload Avatar
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            {editing ? (
              <>
                <Button onClick={handleSave} loading={saving}>Save Changes</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-red-400 mb-2">Logout</h3>
          <p className="text-xs text-gray-500 mb-4">Logging out will clear your session and require you to sign in again.</p>
          <Button variant="danger" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
