import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StarRating, Badge, Button } from "../shared/index";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { bookmarksAPI } from "../../services/api";
import toast from "react-hot-toast";

const CATEGORY_EMOJI = {
  Productivity: "P",
  Entertainment: "E",
  Education: "Ed",
  Finance: "F",
  Health: "H",
  Social: "S",
  Utilities: "U",
  Travel: "T",
  Shopping: "Sh",
  News: "N",
};

function formatInstalls(value = 0) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 100) / 10}K`;
  return value.toLocaleString();
}

export default function AppCard({ app, compact = false }) {
  const { downloadApp, isAppOwned } = useAppContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const handleDownload = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOwned) {
      navigate(`/apps/${app.id}`);
      return;
    }
    if (isFree) {
      setDownloading(true);
      await downloadApp(app.id);
      setDownloading(false);
      return;
    }

    navigate(`/apps/${app.id}`);
  };

  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setBookmarking(true);
    try {
      await bookmarksAPI.add(app.id);
      toast.success("Saved to bookmarks");
    } catch {
      toast.error("Could not save bookmark");
    } finally {
      setBookmarking(false);
    }
  };

  const categoryMark = CATEGORY_EMOJI[app.category?.name] || "A";
  const isFree = !app.price || parseFloat(app.price) === 0;
  const isOwned = isAppOwned(app.id);
  const developer = app.developer?.fullName || app.developer?.username || "Verified developer";
  const title = app.name || "Untitled app";

  if (compact) {
    return (
      <Link to={`/apps/${app.id}`} className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition-colors group">
        <div className="w-11 h-11 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-sm font-bold text-primary-300 overflow-hidden flex-shrink-0">
          {app.iconUrl ? <img src={app.iconUrl} alt={title} className="w-full h-full object-cover" /> : categoryMark}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">{title}</p>
          <p className="text-xs text-gray-500 truncate">{app.category?.name || "App"} - {formatInstalls(app.downloadCount || 0)} installs</p>
        </div>
        <div className="text-right flex-shrink-0">
          <StarRating rating={app.avgRating || 0} showNumber={false} size="sm" />
          <p className="text-xs text-gray-500 mt-1">{isFree ? "Free" : `Rs ${app.price}`}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/apps/${app.id}`} className="block group h-full">
      <article className="h-full bg-dark-700 border border-white/5 rounded-lg overflow-hidden hover:border-primary-500/40 hover:bg-dark-600 transition-all duration-200">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <Badge variant="info" className="bg-white/90 text-primary-600 border-primary-200/80 shadow-sm">
              {app.category?.name || "App"}
            </Badge>
            {(app.trendingScore || 0) > 500 && (
              <Badge variant="warning" className="bg-yellow-400 text-yellow-950 border-yellow-200 shadow-sm">
                Trending
              </Badge>
            )}
          </div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-dark-600 border border-white/10 shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {app.iconUrl ? (
                <img src={app.iconUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary-300">{categoryMark}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm truncate group-hover:text-primary-300 transition-colors">{title}</h3>
              <p className="text-xs text-gray-500 truncate">{developer}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 line-clamp-2 mt-3 leading-relaxed min-h-[2.5rem]">
            {app.shortDesc || app.description || "Explore this app in the AppVerse marketplace."}
          </p>

          <div className="grid grid-cols-3 gap-2 my-4 text-center">
            <div className="rounded-md px-2 py-2 border bg-blue-50 border-blue-100 text-slate-900 dark:bg-white/[0.03] dark:border-white/10 dark:text-white">
              <p className="text-xs font-semibold">{Number(app.avgRating || 0).toFixed(1)}</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-500">Rating</p>
            </div>
            <div className="rounded-md px-2 py-2 border bg-emerald-50 border-emerald-100 text-slate-900 dark:bg-white/[0.03] dark:border-white/10 dark:text-white">
              <p className="text-xs font-semibold">{formatInstalls(app.downloadCount || 0)}</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-500">Installs</p>
            </div>
            <div className="rounded-md px-2 py-2 border bg-amber-50 border-amber-100 text-slate-900 dark:bg-white/[0.03] dark:border-white/10 dark:text-white">
              <p className="text-xs font-semibold">{isFree ? "Free" : `Rs ${app.price}`}</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-500">Price</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isOwned || isFree ? "primary" : "outline"}
              loading={downloading}
              onClick={handleDownload}
              className="flex-1 rounded-lg"
            >
              {isOwned ? "Open" : isFree ? "Install" : "Buy"}
            </Button>
            {isAuthenticated && (
              <Button
                size="sm"
                variant="secondary"
                loading={bookmarking}
                onClick={handleBookmark}
                className="rounded-lg px-3"
                title="Save app"
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
