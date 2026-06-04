import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import AppCard from "../components/marketplace/AppCard";
import SharedAutoHeroCarousel from "../components/shared/AutoHeroCarousel";
import { SkeletonCard, Button, Badge } from "../components/shared/index";
import { appsAPI } from "../services/api";
import firstSlide from "../assets/firstSlide.png";
import secondSlide from "../assets/secondSlide.png";
import thirdSlide from "../assets/thirdSlide.png";

const heroSlides = [
  {
    image: firstSlide,
    tag: "FEATURED APP",
    title: "CodeMentor AI",
    description: "Learn to code 10x faster with an AI tutor that adapts to your pace.",
    cta: "Install now",
  },
  {
    image: secondSlide,
    tag: "NEW RELEASE",
    title: "ConnectHub",
    description: "The social space for creators - chat, share, and grow your circle.",
    cta: "Try ConnectHub",
  },
  {
    image: thirdSlide,
    tag: "NEW RELEASE",
    title: "CleanMaster AI",
    description: "Smarter device cleanup powered by on-device AI. Free forever.",
    cta: "Get it free",
  },
];

function ArrowIcon({ direction = "right" }) {
  const path = direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6";
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryIcon({ name }) {
  const common = {
    className: "w-6 h-6",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const iconName = (name || "").toLowerCase();

  if (iconName.includes("product") || iconName.includes("work")) {
    return <svg {...common} className={`${common.className} text-blue-500`}><path d="M10 6h4a2 2 0 0 1 2 2v1h3a1 1 0 0 1 1 1v2H4V10a1 1 0 0 1 1-1h3V8a2 2 0 0 1 2-2Z" /><path d="M4 12v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><path d="M10 12v2h4v-2" /></svg>;
  }

  if (iconName.includes("entertain") || iconName.includes("media")) {
    return <svg {...common} className={`${common.className} text-pink-500`}><path d="M4 7.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5a1 1 0 0 0-1.6-.8L15 10H6a2 2 0 0 0-2 2Z" /><path d="M10.5 12.5 14 15l-3.5 2.5Z" /></svg>;
  }

  if (iconName.includes("educ") || iconName.includes("learn")) {
    return <svg {...common} className={`${common.className} text-emerald-500`}><path d="M12 4 3 8l9 4 9-4-9-4Z" /><path d="M6 10v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" /></svg>;
  }

  if (iconName.includes("finance") || iconName.includes("money")) {
    return <svg {...common} className={`${common.className} text-amber-500`}><path d="M7 7h10a2 2 0 0 1 2 2v8H5V9a2 2 0 0 1 2-2Z" /><path d="M7 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" /><path d="M12 10v4" /><path d="M10 11.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5S13.1 13 12 13s-2 .7-2 1.5.9 1.5 2 1.5 2-.7 2-1.5" /></svg>;
  }

  if (iconName.includes("health") || iconName.includes("care")) {
    return <svg {...common} className={`${common.className} text-rose-500`}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>;
  }

  if (iconName.includes("social")) {
    return <svg {...common} className={`${common.className} text-sky-500`}><path d="M17 20a4 4 0 0 0-8 0" /><path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /><path d="M20 20a3.2 3.2 0 0 0-2.4-3.1" /><path d="M16.5 6.5a3 3 0 1 1 0 5.9" /></svg>;
  }

  if (iconName.includes("util") || iconName.includes("tool")) {
    return <svg {...common} className={`${common.className} text-violet-500`}><path d="m14.7 6.3-2.1 2.1-1.8-.3-1.6 1.6.3 1.8-2.1 2.1-2.4-.4L4 14l2 2 2.4-.4 2.1-2.1 1.8.3 1.6-1.6-.3-1.8 2.1-2.1 2.4.4L20 10l-2-2-2.4.3Z" /><path d="m10.5 10.5 3 3" /></svg>;
  }

  if (iconName.includes("travel")) {
    return <svg {...common} className={`${common.className} text-teal-500`}><path d="M2.5 16.5 21 3l-7.2 18-3.6-7.2-7.7 2.7Z" /><path d="M12.8 13.8 10 11l11-8" /></svg>;
  }

  if (iconName.includes("shop")) {
    return <svg {...common} className={`${common.className} text-orange-500`}><path d="M6 7h15l-1.5 8.5a2 2 0 0 1-2 1.6H8a2 2 0 0 1-2-1.6L4.7 4H2" /><path d="M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /><path d="M17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></svg>;
  }

  if (iconName.includes("news")) {
    return <svg {...common} className={`${common.className} text-slate-500`}><path d="M5 4h11a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Z" /><path d="M8 8h6" /><path d="M8 12h8" /><path d="M8 16h4" /></svg>;
  }

  return <svg {...common} className={`${common.className} text-primary-500`}><circle cx="12" cy="12" r="6" /></svg>;
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AppRail({ apps, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array(4).fill(0).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {apps.slice(0, 4).map((app) => <AppCard key={app.id} app={app} />)}
    </div>
  );
}

export default function HomePage() {
  const {
    trendingApps,
    recommendations,
    categories,
    loading,
    fetchTrending,
    fetchCategories,
    fetchRecommendations,
  } = useAppContext();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [topRated, setTopRated] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [extraLoading, setExtraLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
    fetchCategories();
    if (isAuthenticated && user?.id) fetchRecommendations(user.id);
  }, [fetchTrending, fetchCategories, fetchRecommendations, isAuthenticated, user?.id]);

  useEffect(() => {
    let mounted = true;
    const loadMoreRails = async () => {
      setExtraLoading(true);
      try {
        const [topRatedRes, featuredRes] = await Promise.allSettled([
          appsAPI.topRated(8),
          appsAPI.featured(8),
        ]);
        if (!mounted) return;
        if (topRatedRes.status === "fulfilled") setTopRated(topRatedRes.value.data.data || []);
        if (featuredRes.status === "fulfilled") setFeatured(featuredRes.value.data.data || []);
      } finally {
        if (mounted) setExtraLoading(false);
      }
    };
    loadMoreRails();
    return () => { mounted = false; };
  }, []);

  const heroApps = useMemo(() => {
    const source = recommendations.length > 0 ? recommendations : trendingApps;
    return source.slice(0, 3);
  }, [recommendations, trendingApps]);

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <SharedAutoHeroCarousel />

      <section className="border-b border-white/5 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <Badge variant="default" className="mb-4">AI marketplace</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Discover apps ranked around your activity.
              </h1>
              <p className="text-gray-400 mt-4 max-w-2xl">
                Browse trending, top-rated, similar, and personalized app suggestions from one production-style marketplace surface.
              </p>

              <form onSubmit={submitSearch} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search apps, categories, tools..."
                  className="flex-1 bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                <Button type="submit" size="lg" className="rounded-lg">Search</Button>
              </form>

              <div className="grid grid-cols-3 gap-3 mt-6 max-w-xl">
                {[
                  ["Personalized", isAuthenticated ? "Active" : "Login"],
                  ["Trending", `${trendingApps.length || 0} apps`],
                  ["Categories", `${categories.length || 0}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-dark-700 border border-white/5 p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm font-semibold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-700 border border-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">{isAuthenticated ? "Recommended now" : "Trending now"}</p>
                <Link to={isAuthenticated ? "/recommendations" : "/apps?sort=trendingScore"} className="text-xs text-primary-300 hover:text-primary-200">
                  View all
                </Link>
              </div>
              <div className="space-y-1">
                {(loading ? [] : heroApps).map((app) => <AppCard key={app.id} app={app} compact />)}
                {loading && Array(3).fill(0).map((_, index) => (
                  <div key={index} className="h-16 rounded-lg bg-dark-600 animate-pulse" />
                ))}
                {!loading && heroApps.length === 0 && (
                  <p className="text-sm text-gray-500 p-3">Start exploring apps to fill this feed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader
            title="Browse categories"
            subtitle="Fast entry points for marketplace discovery"
            action={<Link to="/apps" className="text-sm text-primary-300 hover:text-primary-200">All apps</Link>}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/apps?category=${cat.id}`}
                className="group rounded-2xl bg-white dark:bg-dark-700 border border-slate-200 dark:border-white/5 p-5 min-h-[168px] flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-white/10 transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-white/5 shadow-sm transition-transform duration-200 group-hover:scale-105"
                  aria-label={`${cat.name} category`}
                >
                  <CategoryIcon name={cat.name} />
                </div>
                <div className="pt-4">
                  <p className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 truncate">{cat.name}</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 line-clamp-2 leading-6">{cat.description || "Explore related apps"}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && recommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SectionHeader
            title="Recommended for you"
            subtitle="Based on your downloads, ratings, and app categories"
            action={<Link to="/recommendations" className="text-sm text-primary-300 hover:text-primary-200">Open recommendations</Link>}
          />
          <AppRail apps={recommendations} loading={loading} />
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader
          title="Trending right now"
          subtitle="Apps with strong marketplace activity"
          action={<Link to="/apps?sort=trendingScore" className="text-sm text-primary-300 hover:text-primary-200">See all</Link>}
        />
        <AppRail apps={trendingApps} loading={loading} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader
          title="Top rated"
          subtitle="Highly rated apps from the marketplace"
          action={<Link to="/apps?sort=avgRating" className="text-sm text-primary-300 hover:text-primary-200">Explore rated apps</Link>}
        />
        <AppRail apps={topRated.length ? topRated : featured} loading={extraLoading} />
      </section>

      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
          <div className="rounded-lg bg-dark-800 border border-white/5 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold text-white">Build a smarter home feed</h2>
              <p className="text-gray-400 mt-2">Create an account to unlock personalized recommendations and saved apps.</p>
            </div>
            <Button size="lg" onClick={() => navigate("/register")} className="rounded-lg w-full sm:w-auto">
              Get started
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
