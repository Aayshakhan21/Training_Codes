import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { downloadsAPI } from "../services/api";
import { AppIcon, Badge, Button, EmptyState, Spinner } from "../components/shared/index";
import toast from "react-hot-toast";

export default function DownloadsPage() {
  const { fetchOwnedApps } = useAppContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const loadDownloads = async () => {
    setLoading(true);
    try {
      const { data } = await downloadsAPI.mine({ page: 0, size: 50 });
      setItems(data.data?.content || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load download history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  const handleRemove = async (downloadId) => {
    setRemovingId(downloadId);
    try {
      await downloadsAPI.remove(downloadId);
      toast.success("Removed from download history");
      await loadDownloads();
      await fetchOwnedApps();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove app");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Download History</h1>
            <p className="text-sm text-gray-400 mt-1">Apps you have downloaded or unlocked.</p>
          </div>
          <Badge variant="neutral">{items.length.toLocaleString()} downloads</Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="download"
            title="No downloads yet"
            description="Your downloaded apps will appear here once you install or unlock them."
            action={
              <Link to="/apps">
                <Button variant="outline">Browse marketplace</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {items.map((download) => (
              <div key={download.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <Link to={`/apps/${download.app?.id}`} className="w-12 h-12 rounded-xl overflow-hidden bg-dark-600 flex-shrink-0">
                  {download.app?.iconUrl ? (
                    <img src={download.app.iconUrl} alt={download.app?.name || "App"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AppIcon name="app" className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/apps/${download.app?.id}`} className="text-sm font-semibold text-white hover:text-primary-300 transition-colors truncate">
                      {download.app?.name || "Unknown app"}
                    </Link>
                    {download.app?.category && <Badge variant="neutral">{download.app.category}</Badge>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {download.downloadedAt ? new Date(download.downloadedAt).toLocaleString() : "Unknown date"}
                    {download.platform ? ` • ${download.platform}` : ""}
                  </p>
                </div>

                <div className="text-sm text-gray-400 sm:text-right">
                  <p className="text-white font-medium">
                    {download.app?.version ? `Version ${download.app.version}` : "Version unavailable"}
                  </p>
                  {download.ipAddress && <p className="text-xs mt-1">IP {download.ipAddress}</p>}
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  loading={removingId === download.id}
                  onClick={() => handleRemove(download.id)}
                  className="sm:ml-2"
                >
                  Remove this app
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
