import React, { useEffect, useState } from "react";
import { bookmarksAPI } from "../services/api";
import AppCard from "../components/marketplace/AppCard";
import { EmptyState, Spinner } from "../components/shared/index";

export default function BookmarksPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await bookmarksAPI.list();
        setItems(data.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Bookmarks</h1>
      {loading ? <Spinner size="lg" /> : items.length === 0 ? (
        <EmptyState icon="🔖" title="No saved apps" description="Bookmark apps from the marketplace to see them here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((bookmark) => <AppCard key={bookmark.id} app={bookmark.app} />)}
        </div>
      )}
    </div>
  );
}
