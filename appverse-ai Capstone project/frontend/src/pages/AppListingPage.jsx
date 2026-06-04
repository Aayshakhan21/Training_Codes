import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AppCard from "../components/marketplace/AppCard";
import { SkeletonCard, EmptyState, Button, Badge } from "../components/shared/index";
import { usePagination } from "../hooks/usePagination";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Latest" },
  { value: "downloadCount-desc", label: "Most Downloaded" },
  { value: "avgRating-desc", label: "Highest Rated" },
  { value: "trendingScore-desc", label: "Trending" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PRICE_FILTERS = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

export default function AppListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { apps, categories, totalPages, totalElements, currentPage, loading, fetchApps, fetchCategories, setFilter } = useAppContext();

  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(() => {
    const sortParam = searchParams.get("sort");
    return sortParam ? `${sortParam}-desc` : "createdAt-desc";
  });
  const [priceFilter, setPriceFilter] = useState("all");
  const [minRating, setMinRating] = useState("0");

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const [sortBy, direction] = sort.split("-");
    setFilter({
      selectedCategory: selectedCat || null,
      sortBy,
      sortDir: direction,
      currentPage: 0,
    });

    const nextParams = {};
    if (selectedCat) nextParams.category = selectedCat;
    if (sortBy !== "createdAt") nextParams.sort = sortBy;
    setSearchParams(nextParams, { replace: true });
  }, [selectedCat, sort, setSearchParams]);

  useEffect(() => {
    const [sortBy, direction] = sort.split("-");
    fetchApps({ categoryId: selectedCat || undefined, sortBy, direction, page: currentPage });
  }, [selectedCat, sort, currentPage]);

  const visibleApps = useMemo(() => {
    return apps.filter((app) => {
      const price = parseFloat(app.price || 0);
      const rating = Number(app.avgRating || 0);
      const priceMatches = priceFilter === "all" || (priceFilter === "free" ? price === 0 : price > 0);
      const ratingMatches = rating >= Number(minRating);
      return priceMatches && ratingMatches;
    });
  }, [apps, priceFilter, minRating]);

  const selectedCategoryName = categories.find((cat) => String(cat.id) === String(selectedCat))?.name;
  const { pages, hasPrev, hasNext } = usePagination(totalPages, currentPage, () => {});

  const handlePage = (page) => {
    setFilter({ currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCat("");
    setPriceFilter("all");
    setMinRating("0");
    setSort("createdAt-desc");
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <Badge variant="default" className="mb-3">Marketplace</Badge>
              <h1 className="text-3xl font-bold text-white">App marketplace</h1>
              <p className="text-gray-400 mt-2">Browse, sort, and compare apps across the AppVerse catalog.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-full sm:min-w-[360px]">
              <div className="rounded-lg bg-dark-700 border border-white/5 p-3">
                <p className="text-xs text-gray-500">Results</p>
                <p className="text-sm text-white font-semibold">{totalElements || visibleApps.length}</p>
              </div>
              <div className="rounded-lg bg-dark-700 border border-white/5 p-3">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-white font-semibold truncate">{selectedCategoryName || "All"}</p>
              </div>
              <div className="rounded-lg bg-dark-700 border border-white/5 p-3">
                <p className="text-xs text-gray-500">Page</p>
                <p className="text-sm text-white font-semibold">{currentPage + 1}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 rounded-lg bg-dark-700 border border-white/5 p-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">Categories</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCat("")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    !selectedCat ? "bg-primary-600 text-white" : "bg-dark-600 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  All apps
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(String(selectedCat) === String(cat.id) ? "" : String(cat.id))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      String(selectedCat) === String(cat.id)
                        ? "bg-primary-600 text-white"
                        : "bg-dark-600 text-gray-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:w-[520px]">
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Sort</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full bg-dark-600 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500">
                  {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Price</span>
                <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="w-full bg-dark-600 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500">
                  {PRICE_FILTERS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Rating</span>
                <select value={minRating} onChange={(event) => setMinRating(event.target.value)} className="w-full bg-dark-600 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500">
                  <option value="0">Any rating</option>
                  <option value="3">3.0+</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(12).fill(0).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : visibleApps.length === 0 ? (
          <EmptyState
            icon="No apps"
            title="No apps found"
            description="Try a different category, price, or rating filter."
            action={<Button onClick={clearFilters} variant="outline">Clear filters</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleApps.map((app) => <AppCard key={app.id} app={app} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
            <button
              disabled={!hasPrev}
              onClick={() => handlePage(currentPage - 1)}
              className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-primary-500/30 transition-colors text-sm"
            >
              Prev
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage ? "bg-primary-600 text-white" : "bg-dark-700 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              disabled={!hasNext}
              onClick={() => handlePage(currentPage + 1)}
              className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-primary-500/30 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
