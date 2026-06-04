// src/components/shared/index.js
import React from "react";

export function AppIcon({ name, className = "w-5 h-5", strokeWidth = 1.8, filled = false }) {
  const common = {
    className,
    fill: filled ? "currentColor" : "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const value = String(name || "").toLowerCase();

  if (value.includes("search")) {
    return <svg {...common}><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></svg>;
  }
  if (value.includes("profile") || value.includes("user")) {
    return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
  }
  if (value.includes("users") || value.includes("people") || value.includes("team")) {
    return <svg {...common}><path d="M17 20a4 4 0 0 0-8 0" /><path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /><path d="M20 20a3.2 3.2 0 0 0-2.4-3.1" /><path d="M16.5 6.5a3 3 0 1 1 0 5.9" /></svg>;
  }
  if (value.includes("bookmark")) {
    return <svg {...common}><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z" /></svg>;
  }
  if (value.includes("notification") || value.includes("bell")) {
    return <svg {...common}><path d="M15 17H9a3 3 0 0 1-3-3v-2a6 6 0 0 1 12 0v2a3 3 0 0 1-3 3Z" /><path d="M10 17a2 2 0 0 0 4 0" /></svg>;
  }
  if (value.includes("logout")) {
    return <svg {...common}><path d="M10 17l5-5-5-5" /><path d="M15 12H5" /><path d="M19 4v16" /></svg>;
  }
  if (value.includes("admin") || value.includes("zap") || value.includes("dashboard")) {
    return <svg {...common}><path d="M12 2 3 6v6c0 5.5 3.7 10.6 9 12 5.3-1.4 9-6.5 9-12V6l-9-4Z" /><path d="M12 7v5" /><path d="M12 16h.01" /></svg>;
  }
  if (value.includes("developer") || value.includes("code")) {
    return <svg {...common}><path d="M9 18 3 12l6-6" /><path d="M15 6l6 6-6 6" /><path d="M14 4 10 20" /></svg>;
  }
  if (value.includes("download") || value.includes("install")) {
    return <svg {...common}><path d="M12 3v10" /><path d="m8 9 4 4 4-4" /><path d="M5 19h14" /></svg>;
  }
  if (value.includes("trend") || value.includes("trending") || value.includes("chart")) {
    return <svg {...common}><path d="M4 19h16" /><path d="M7 15l3-3 3 2 5-6" /><path d="M15 8h3v3" /></svg>;
  }
  if (value.includes("revenue") || value.includes("money") || value.includes("coin")) {
    return <svg {...common}><path d="M7 7h10a2 2 0 0 1 2 2v8H5V9a2 2 0 0 1 2-2Z" /><path d="M12 10v4" /><path d="M10 11.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5S13.1 13 12 13s-2 .7-2 1.5.9 1.5 2 1.5 2-.7 2-1.5" /></svg>;
  }
  if (value.includes("review") || value.includes("comment") || value.includes("chat")) {
    return <svg {...common}><path d="M4 5h16v10H8l-4 4V5Z" /></svg>;
  }
  if (value.includes("app") || value.includes("phone")) {
    return <svg {...common}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M10 6h4" /><path d="M11.5 16.5h1" /></svg>;
  }
  if (value.includes("star") || value.includes("rating")) {
    return <svg {...common} fill="currentColor" stroke="none"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" /></svg>;
  }
  if (value.includes("warning") || value.includes("flag")) {
    return <svg {...common}><path d="M10.3 4.5 2.7 18a1.5 1.5 0 0 0 1.3 2.2h16a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a1.9 1.9 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 16h.01" /></svg>;
  }
  if (value.includes("fake") || value.includes("bot")) {
    return <svg {...common}><path d="M9 5a3 3 0 0 1 6 0v1h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V5Z" /><path d="M9 12h.01" /><path d="M15 12h.01" /></svg>;
  }
  if (value.includes("approve") || value.includes("success") || value.includes("check")) {
    return <svg {...common}><path d="m5 13 4 4L19 7" /></svg>;
  }
  if (value.includes("reject") || value.includes("remove") || value.includes("delete") || value.includes("trash")) {
    return <svg {...common}><path d="M4 7h16" /><path d="M6 7l1 13h10l1-13" /><path d="M9 11v5" /><path d="M15 11v5" /><path d="M9 4h6l1 3H8l1-3Z" /></svg>;
  }
  if (value.includes("share")) {
    return <svg {...common}><path d="M15 8a3 3 0 1 0-2.8-4" /><path d="M6 13a3 3 0 1 0 0-6" /><path d="M15 20a3 3 0 1 0-2.8-4" /><path d="M8.5 9.5l5 2.8" /><path d="m13.5 11.7-5 2.8" /></svg>;
  }
  if (value.includes("smile") || value.includes("happy") || value.includes("positive")) {
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 13.5c.7 1.2 1.9 2 3 2s2.3-.8 3-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>;
  }
  if (value.includes("sad") || value.includes("negative")) {
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 15c.7-1.2 1.9-2 3-2s2.3.8 3 2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>;
  }
  if (value.includes("neutral")) {
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 12h6" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>;
  }
  if (value.includes("empty") || value.includes("none")) {
    return <svg {...common}><path d="M4 7h16v10H4z" /><path d="M8 7l1.5-3h5L16 7" /></svg>;
  }

  return <svg {...common}><circle cx="12" cy="12" r="6" /></svg>;
}

function EmptyStateIcon({ name }) {
  return <AppIcon name={name} className="w-14 h-14 text-primary-400" />;
}

// ── Spinner ───────────────────────────────────────────────
export function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={`${sizes[size]} ${className} animate-spin rounded-full border-2 border-primary-500 border-t-transparent`} />
  );
}

// ── Full-page loader ──────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-900">
      <div className="text-center">
        <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent mb-4">
          AppVerse AI
        </div>
        <Spinner size="lg" />
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:  "bg-primary-500/20 text-primary-300 border border-primary-500/30",
    success:  "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning:  "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    danger:   "bg-red-500/20 text-red-300 border border-red-500/30",
    info:     "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    neutral:  "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── Star Rating ───────────────────────────────────────────
export function StarRating({ rating = 0, max = 5, size = "sm", showNumber = true, interactive = false, onChange }) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <svg
          key={star}
          className={`${sizes[size]} ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => interactive && onChange?.(star)}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showNumber && (
        <span className="text-xs text-gray-400 ml-1">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────
export function EmptyState({ icon = "app", title = "Nothing here", description = "", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4">
        <EmptyStateIcon name={icon} />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-dark-700 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-dark-600" />
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-dark-600" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-dark-600 rounded w-3/4" />
            <div className="h-3 bg-dark-600 rounded w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-dark-600 rounded" />
        <div className="h-3 bg-dark-600 rounded w-5/6" />
        <div className="flex justify-between mt-4">
          <div className="h-6 bg-dark-600 rounded w-16" />
          <div className="h-8 bg-dark-600 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", loading = false, disabled = false, className = "", ...props }) {
  const variants = {
    primary:   "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25",
    secondary: "bg-dark-600 hover:bg-dark-500 text-white border border-white/10",
    danger:    "bg-red-600 hover:bg-red-500 text-white",
    ghost:     "hover:bg-white/5 text-gray-300 hover:text-white",
    outline:   "border border-primary-500 text-primary-400 hover:bg-primary-500/10",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={`w-full bg-dark-600 border ${error ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────
export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={`w-full bg-dark-600 border ${error ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = "md" }) {
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-dark-700 rounded-2xl border border-white/10 w-full ${sizes[size]} shadow-2xl animate-slide-up`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
