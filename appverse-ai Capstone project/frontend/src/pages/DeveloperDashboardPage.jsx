import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appsAPI, reviewsAPI, developerAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Badge, Button, Spinner, EmptyState, StarRating, AppIcon } from "../components/shared/index";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

export default function DeveloperDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [deletingId, setDeletingId] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [downloadsLoading, setDownloadsLoading] = useState(false);
  const [downloadMeta, setDownloadMeta] = useState(null);

  useEffect(() => {
    loadApps();
  }, [user]);

  const loadApps = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        developerAPI.apps({ size: 50 }),
        developerAPI.stats(),
      ]);
      setApps(appsRes.data.data?.content || []);
      setStats(statsRes.data.data);
    } catch {
      toast.error("Failed to load apps");
    } finally {
      setLoading(false);
    }
  };

  const loadDownloads = async () => {
    setDownloadsLoading(true);
    try {
      const { data } = await developerAPI.downloads({ page: 0, size: 20 });
      const payload = data.data || {};
      setDownloads(payload.content || []);
      setDownloadMeta(payload);
    } catch {
      toast.error("Failed to load download history");
    } finally {
      setDownloadsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "downloads" && downloads.length === 0 && !downloadsLoading) {
      loadDownloads();
    }
  }, [activeTab]);

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this app?")) return;
    setDeletingId(appId);
    try {
      await appsAPI.delete(appId);
      setApps((prev) => prev.filter((a) => a.id !== appId));
      toast.success("App deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const totalDownloads = stats?.totalDownloads ?? apps.reduce((s, a) => s + (a.downloadCount || 0), 0);
  const totalRevenue   = stats?.totalRevenue ?? apps.reduce((s, a) => s + (parseFloat(a.price || 0) * (a.downloadCount || 0)), 0);
  const avgRating      = stats?.avgRating != null ? Number(stats.avgRating).toFixed(2) : (apps.length ? (apps.reduce((s, a) => s + parseFloat(a.avgRating || 0), 0) / apps.length).toFixed(2) : "—");
  const chartSeries = stats?.series || [];

  const TABS = ["overview", "my apps", "analytics", "reviews", "downloads"];

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Portal</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.fullName || user?.username}</p>
          </div>
          <Button onClick={() => navigate("/developer/upload")}>
            <AppIcon name="app" className="w-4 h-4 text-white" />
            Upload New App
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Apps", value: apps.length, icon: "app", color: "text-primary-400" },
            { label: "Total Downloads", value: totalDownloads.toLocaleString(), icon: "download", color: "text-emerald-400" },
            { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: "revenue", color: "text-yellow-400" },
            { label: "Avg. Rating", value: avgRating, icon: "star", color: "text-pink-400" },
          ].map((s) => (
            <div key={s.label} className="bg-dark-700 border border-white/5 rounded-2xl p-5">
              <AppIcon name={s.icon} className={`w-6 h-6 mb-2 ${s.color}`} filled={s.icon === "star"} />
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-8 border-b border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary-500 text-primary-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
              {tab === "my apps" && apps.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded-full">{apps.length}</span>
              )}
              {tab === "downloads" && downloads.length > 0 && (
                <span className="ml-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
                  {(downloadMeta?.totalElements || downloads.length).toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Monthly Downloads</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1e30", border: "1px solid #ffffff10", borderRadius: 12, color: "#fff" }} />
                  <Line type="monotone" dataKey="downloads" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1e30", border: "1px solid #ffffff10", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">App Status Breakdown</h3>
              {apps.length > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={[
                        { name: "Approved", value: apps.filter(a => a.status === "APPROVED").length },
                        { name: "Pending",  value: apps.filter(a => a.status === "PENDING").length },
                        { name: "Rejected", value: apps.filter(a => a.status === "REJECTED").length },
                      ]} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {[
                      { label: "Approved", color: "#6366f1", count: apps.filter(a => a.status === "APPROVED").length },
                      { label: "Pending",  color: "#ec4899", count: apps.filter(a => a.status === "PENDING").length },
                      { label: "Rejected", color: "#10b981", count: apps.filter(a => a.status === "REJECTED").length },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-semibold ml-auto">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState icon="chart" title="No apps yet" />
              )}
            </div>

            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Top Apps by Downloads</h3>
              <div className="space-y-3">
                {[...apps].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)).slice(0, 5).map((app, i) => (
                  <div key={app.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-600 w-4">#{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-lg">
                      <AppIcon name="app" className="w-4 h-4 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{app.name}</p>
                      <p className="text-xs text-gray-500">{(app.downloadCount || 0).toLocaleString()} downloads</p>
                    </div>
                    <StarRating rating={app.avgRating || 0} size="sm" showNumber={false} />
                  </div>
                ))}
                {apps.length === 0 && <EmptyState icon="app" title="Upload your first app" />}
              </div>
            </div>
          </div>
        )}

        {activeTab === "my apps" && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : apps.length === 0 ? (
              <EmptyState
                icon="app"
                title="No apps yet"
                description="Upload your first app to get started"
                action={<Button onClick={() => navigate("/developer/upload")}>Upload App</Button>}
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/5">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      {["App", "Status", "Downloads", "Rating", "Revenue", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {apps.map((app) => (
                      <tr key={app.id} className="bg-dark-800 hover:bg-dark-700 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary-500/20 flex items-center justify-center text-lg">
                              <AppIcon name="app" className="w-4.5 h-4.5 text-primary-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{app.name}</p>
                              <p className="text-xs text-gray-500">v{app.version}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={
                            app.status === "APPROVED" ? "success" :
                            app.status === "PENDING" ? "warning" :
                            "danger"
                          }>{app.status}</Badge>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-300">{(app.downloadCount || 0).toLocaleString()}</td>
                        <td className="px-5 py-4"><StarRating rating={app.avgRating || 0} size="sm" /></td>
                        <td className="px-5 py-4 text-sm text-emerald-400">
                          ₹{(parseFloat(app.price || 0) * (app.downloadCount || 0)).toFixed(0)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/apps/${app.id}`}>
                              <Button size="sm" variant="ghost">View</Button>
                            </Link>
                            <Button size="sm" variant="ghost" onClick={() => toast.info("Edit coming soon")}>Edit</Button>
                            <Button
                              size="sm"
                              variant="danger"
                              loading={deletingId === app.id}
                              onClick={() => handleDelete(app.id)}
                            >Del</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Downloads vs Revenue (6 months)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1e30", border: "1px solid #ffffff10", borderRadius: 12, color: "#fff" }} />
                  <Bar yAxisId="left" dataKey="downloads" fill="#6366f1" radius={[4, 4, 0, 0]} name="Downloads" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} name="Revenue ₹" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-6">Key Metrics</h3>
              <div className="space-y-5">
                {[
                  { label: "Conversion Rate", value: "3.2%", desc: "Visitors who download" },
                  { label: "Retention Rate", value: "68%", desc: "Users who stay after 7 days" },
                  { label: "Avg. Session Time", value: "8m 34s", desc: "Average usage per session" },
                  { label: "Crash Free Rate", value: "99.2%", desc: "Sessions without crashes" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{m.label}</span>
                      <span className="text-sm font-semibold text-primary-400">{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-600 to-pink-500 rounded-full" style={{ width: m.value }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "downloads" && (
          <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Download History</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Recent downloads of your apps</p>
              </div>
              <Badge variant="info" className="bg-primary-500/10 text-primary-600 border-primary-500/20">
                {(downloadMeta?.totalElements || downloads.length || 0).toLocaleString()} downloads
              </Badge>
            </div>

            {downloadsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : downloads.length === 0 ? (
              <EmptyState
                icon="download"
                title="No downloads yet"
                description="Downloads for your apps will appear here once users start installing them."
              />
            ) : (
              <div className="space-y-3">
                {downloads.map((download) => (
                  <div key={download.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-700 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                      {download.app?.iconUrl ? (
                        <img src={download.app.iconUrl} alt={download.app?.name} className="w-full h-full object-cover" />
                      ) : (
                        <AppIcon name="app" className="w-5 h-5 text-primary-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{download.app?.name}</p>
                        {download.app?.category && (
                          <Badge variant="info" className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20">
                            {download.app.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {download.user?.fullName || download.user?.username || "Anonymous user"}
                        {download.platform ? ` · ${download.platform}` : ""}
                        {download.downloadedAt ? ` · ${new Date(download.downloadedAt).toLocaleString()}` : ""}
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-gray-400 sm:text-right">
                      <p className="font-medium text-slate-700 dark:text-gray-300">Version {download.app?.version || "—"}</p>
                      {download.ipAddress && <p>IP {download.ipAddress}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
