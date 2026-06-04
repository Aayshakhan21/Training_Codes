import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AppCard from "../components/marketplace/AppCard";
import { SkeletonCard, EmptyState, Button, Badge } from "../components/shared/index";

const QUICK_SEARCHES = ["Photo editor", "Productivity", "AI tools", "Education", "Finance"];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { searchResults, searchLoading, searchApps } = useAppContext();
  const [draft, setDraft] = useState(query);
  const [sort, setSort] = useState("relevance");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    setDraft(query);
    if (query) searchApps(query);
  }, [query, searchApps]);

  const visibleResults = useMemo(() => {
    const filtered = searchResults.filter((app) => {
      const price = parseFloat(app.price || 0);
      return priceFilter === "all" || (priceFilter === "free" ? price === 0 : price > 0);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "rating") return Number(b.avgRating || 0) - Number(a.avgRating || 0);
      if (sort === "downloads") return Number(b.downloadCount || 0) - Number(a.downloadCount || 0);
      if (sort === "latest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
  }, [searchResults, sort, priceFilter]);

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Badge variant="default" className="mb-3">Search</Badge>
          <h1 className="text-3xl font-bold text-white">Find apps</h1>
          <p className="text-gray-400 mt-2">Search by name, category, description, or intent.</p>

          <form onSubmit={submitSearch} className="mt-5 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search marketplace..."
              className="flex-1 bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <Button type="submit" size="lg" className="rounded-lg">Search</Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="px-3 py-1.5 rounded-lg bg-dark-700 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-primary-500/40 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Results for <span className="text-primary-300">"{query}"</span>
            </h2>
            {!searchLoading && <p className="text-sm text-gray-500 mt-1">{visibleResults.length} apps found</p>}
          </div>

          <div className="flex gap-3">
            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500">
              <option value="all">All prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500">
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="downloads">Downloads</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>

        {searchLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : visibleResults.length === 0 ? (
          <EmptyState
            icon="No results"
            title="No results found"
            description={`No apps matched "${query}". Try a broader term or explore all apps.`}
            action={<Link to="/apps"><Button variant="outline">Browse marketplace</Button></Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visibleResults.map((app) => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
}
