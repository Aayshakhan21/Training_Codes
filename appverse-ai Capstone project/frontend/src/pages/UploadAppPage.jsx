// src/pages/UploadAppPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appsAPI, categoriesAPI } from "../services/api";
import { Button, Input, Select, AppIcon } from "../components/shared/index";
import toast from "react-hot-toast";

export default function UploadAppPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", shortDesc: "", description: "", iconUrl: "", bannerUrl: "",
    categoryId: "", price: "0", version: "1.0.0", releaseNotes: "",
    tags: "", sizeMb: "", minOsVersion: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    categoriesAPI.list().then(({ data }) => setCategories(data.data || []));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const normalizeTags = (value) =>
    value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = "App name is required";
    if (!form.shortDesc.trim())   e.shortDesc = "Short description required";
    if (!form.description.trim()) e.description = "Full description required";
    if (!form.categoryId)         e.categoryId = "Select a category";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await appsAPI.create({
        ...form,
        categoryId: parseInt(form.categoryId),
        price: parseFloat(form.price || 0),
        sizeMb: form.sizeMb ? parseFloat(form.sizeMb) : undefined,
        tags: form.tags.trim() ? JSON.stringify(normalizeTags(form.tags)) : undefined,
      });
      toast.success("App submitted for review!");
      navigate("/developer");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Upload New App</h1>
          <p className="text-gray-400 mt-1">Submit your app for review. Our team will approve within 24-48 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-dark-700 border border-white/5 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            <Input label="App Name *" placeholder="My Awesome App" value={form.name} onChange={set("name")} error={errors.name} />
            <Input label="Short Description *" placeholder="One-line pitch (max 300 chars)" value={form.shortDesc} onChange={set("shortDesc")} error={errors.shortDesc} maxLength={300} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Full Description *</label>
              <textarea
                placeholder="Describe what your app does, key features, use cases..."
                value={form.description}
                onChange={set("description")}
                rows={5}
                className="w-full bg-dark-600 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
            </div>
            <Select label="Category *" value={form.categoryId} onChange={set("categoryId")} error={errors.categoryId}>
              <option value="">Select a category...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>

          {/* Media */}
          <div className="bg-dark-700 border border-white/5 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Media & Assets</h2>
            <Input label="App Icon URL" placeholder="https://example.com/icon.png" value={form.iconUrl} onChange={set("iconUrl")} />
            <Input label="Banner / Screenshot URL" placeholder="https://example.com/banner.png" value={form.bannerUrl} onChange={set("bannerUrl")} />
            {form.iconUrl && (
              <div className="flex items-center gap-4">
                <img src={form.iconUrl} alt="Icon preview" className="w-16 h-16 rounded-xl object-cover border border-white/10" onError={(e) => e.target.style.display = "none"} />
                <p className="text-xs text-gray-500">Icon Preview</p>
              </div>
            )}
          </div>

          {/* Pricing & Version */}
          <div className="bg-dark-700 border border-white/5 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Pricing & Version</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.price} onChange={set("price")}
                    className="w-full bg-dark-600 border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Set 0 for free app</p>
              </div>
              <Input label="Version" placeholder="1.0.0" value={form.version} onChange={set("version")} />
              <Input label="App Size (MB)" type="number" placeholder="e.g. 24.5" value={form.sizeMb} onChange={set("sizeMb")} />
              <Input label="Min OS Version" placeholder="e.g. Android 8.0" value={form.minOsVersion} onChange={set("minOsVersion")} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Release Notes</label>
              <textarea
                placeholder="What's new in this version..."
                value={form.releaseNotes}
                onChange={set("releaseNotes")}
                rows={3}
                className="w-full bg-dark-600 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
              />
            </div>
            <Input label="Tags (comma-separated)" placeholder="productivity, ai, automation" value={form.tags} onChange={set("tags")} />
          </div>

          {/* Terms notice */}
          <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-4 text-sm text-gray-400">
            <p>📋 By submitting, you confirm that your app complies with AppVerse AI's developer policies and guidelines. Apps are reviewed within 24-48 hours.</p>
          </div>

          {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" loading={loading} size="lg" className="flex-1">
                <AppIcon name="share" className="w-4 h-4 text-white" />
                Submit for Review
              </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/developer")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
