// src/components/shared/Navbar.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import { AppIcon } from "./index";

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isDeveloper } = useAuth();
  const { searchApps, searchResults, searchLoading } = useAppContext();
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || (document.documentElement.classList.contains("light") ? "light" : "dark"));
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchApps(debouncedQuery);
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, [debouncedQuery, searchApps]);

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme !== "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSearch(false);
      setQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/apps", label: "Marketplace" },
    { to: "/recommendations", label: "For You", auth: true },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-dark-800/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="font-bold text-white text-lg hidden sm:block">
              App<span className="text-primary-400">Verse</span> <span className="text-xs font-normal text-primary-300 bg-primary-500/20 px-1.5 py-0.5 rounded-full">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) =>
              (!l.auth || isAuthenticated) ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              ) : null
            )}
          </div>

          <div className="flex-1 max-w-sm mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <AppIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="w-full bg-dark-700 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-dark-600 transition-all"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </form>

            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-dark-700 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.slice(0, 5).map((app) => (
                  <Link
                    key={app.id}
                    to={`/apps/${app.id}`}
                    onClick={() => { setShowSearch(false); setQuery(""); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-lg">
                      {app.iconUrl ? <img src={app.iconUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <AppIcon name="app" className="w-4.5 h-4.5 text-primary-300" />}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.category?.name}</p>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-center text-xs text-primary-400 py-2 hover:bg-white/5 transition-colors border-t border-white/5"
                >
                  View all results →
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-dark-700 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-600 transition-colors theme-toggle"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="h-4 w-4 rounded-full bg-gradient-to-br from-yellow-300 to-primary-500 border border-white/20" />
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {isAuthenticated ? (
              <>
                {isDeveloper() && (
                  <Link to="/developer" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                    <AppIcon name="developer" className="w-4 h-4 text-gray-300" />
                    Dev Portal
                  </Link>
                )}
                {isAdmin() && (
                  <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-2 rounded-lg transition-colors">
                    <AppIcon name="admin" className="w-4 h-4 text-yellow-300" />
                    Admin
                  </Link>
                )}

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.[0] || user?.username?.[0] || "U"}
                    </div>
                  </button>
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-52 bg-dark-700 border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="mt-1 inline-block text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">{user?.role}</span>
                      </div>
                      <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <AppIcon name="profile" className="w-4 h-4 text-gray-300" />
                        My Profile
                      </Link>
                      <Link to="/bookmarks" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <AppIcon name="bookmark" className="w-4 h-4 text-gray-300" />
                        Bookmarks
                      </Link>
                      <Link to="/notifications" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <AppIcon name="notification" className="w-4 h-4 text-gray-300" />
                        Notifications
                      </Link>
                      <Link to="/downloads" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <AppIcon name="download" className="w-4 h-4 text-gray-300" />
                        Download History
                      </Link>
                      <hr className="border-white/5 my-1" />
                      <button onClick={() => { logout(); setShowProfile(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                        <AppIcon name="logout" className="w-4 h-4 text-red-400" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-colors">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1">
            <button
              type="button"
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </button>
            {navLinks.map((l) =>
              (!l.auth || isAuthenticated) ? (
                <Link key={l.to} to={l.to} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  {l.label}
                </Link>
              ) : null
            )}
            {isDeveloper() && <Link to="/developer" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Developer Portal</Link>}
            {isAdmin() && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-500/10 rounded-lg"><AppIcon name="admin" className="w-4 h-4 text-yellow-300" />Admin Dashboard</Link>}
          </div>
        )}
      </div>
    </nav>
  );
}
