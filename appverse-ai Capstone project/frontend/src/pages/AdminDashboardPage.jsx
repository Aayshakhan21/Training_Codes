import React, { useEffect, useState } from "react";
import { adminAPI, appsAPI, reviewsAPI } from "../services/api";
import { Badge, Button, Spinner, EmptyState, Input, AppIcon } from "../components/shared/index";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [pendingApps, setPendingApps] = useState([]);
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [approvingId, setApprovingId] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [developerSearch, setDeveloperSearch] = useState("");
  const [roleBusyId, setRoleBusyId] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, devRes, pendingRes, flaggedRes, analyticsRes] = await Promise.all([
        adminAPI.stats(),
        adminAPI.users({ size: 50 }),
        adminAPI.developers({ size: 50 }),
        adminAPI.pendingApps({ size: 10 }),
        reviewsAPI.flagged(),
        adminAPI.analytics(),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data?.content || []);
      setDevelopers(devRes.data.data?.content || []);
      setPendingApps(pendingRes.data.data?.content || []);
      setFlaggedReviews(flaggedRes.data.data || []);
      setAnalytics(analyticsRes.data.data || []);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const { data } = await adminAPI.users({ search: userSearch.trim(), size: 50 });
      setUsers(data.data?.content || []);
    } catch {
      toast.error("Failed to search users");
    }
  };

  const searchDevelopers = async () => {
    try {
      const { data } = await adminAPI.developers({ search: developerSearch.trim(), size: 50 });
      setDevelopers(data.data?.content || []);
    } catch {
      toast.error("Failed to search developers");
    }
  };

  const handleApproveApp = async (appId, status) => {
    setApprovingId(appId);
    try {
      await appsAPI.changeStatus(appId, { status });
      setPendingApps((prev) => prev.filter((a) => a.id !== appId));
      toast.success(`App ${status.toLowerCase()}!`);
    } catch {
      toast.error("Action failed");
    } finally {
      setApprovingId(null);
    }
  };

  const handleMakeDeveloper = async (userId) => {
    setRoleBusyId(userId);
    try {
      const { data } = await adminAPI.makeDeveloper(userId);
      const updatedUser = data.data;
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDevelopers((prev) => [updatedUser, ...prev.filter((u) => u.id !== userId)]);
      toast.success("User promoted to developer");
    } catch {
      toast.error("Failed to promote user");
    } finally {
      setRoleBusyId(null);
    }
  };

  const handleRemoveDeveloper = async (userId) => {
    setRoleBusyId(userId);
    try {
      const { data } = await adminAPI.removeDeveloper(userId);
      const updatedUser = data.data;
      setDevelopers((prev) => prev.filter((u) => u.id !== userId));
      setUsers((prev) => [updatedUser, ...prev.filter((u) => u.id !== userId)]);
      toast.success("Developer demoted to user");
    } catch {
      toast.error("Failed to remove developer role");
    } finally {
      setRoleBusyId(null);
    }
  };

  const handleKeyDown = (event, action) => {
    if (event.key === "Enter") action();
  };

  const TABS = ["overview", "pending apps", "users", "developers", "reviews"];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <AppIcon name="admin" className="w-7 h-7 text-primary-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Platform-wide analytics and management</p>
          </div>
          {pendingApps.length > 0 && (
            <Badge variant="warning" className="text-sm py-1.5 px-4 bg-yellow-300/30 text-yellow-950 border-yellow-300 shadow-sm">
              {pendingApps.length} apps pending review
            </Badge>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: "users", color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Developers", value: stats.totalDevelopers, icon: "developer", color: "text-primary-400", bg: "bg-primary-500/10" },
              { label: "Live Apps", value: stats.totalApps, icon: "app", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Total Downloads", value: (stats.totalDownloads || 0).toLocaleString(), icon: "download", color: "text-yellow-400", bg: "bg-yellow-500/10" },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} border border-white/5 rounded-2xl p-5`}>
                <AppIcon name={item.icon} className={`w-6 h-6 mb-2 ${item.color}`} />
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        )}

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
              {tab === "pending apps" && pendingApps.length > 0 && (
                <span className="ml-1.5 text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded-full">{pendingApps.length}</span>
              )}
              {tab === "reviews" && flaggedReviews.length > 0 && (
                <span className="ml-1.5 text-xs bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full">{flaggedReviews.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Weekly Downloads</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1e30", border: "1px solid #ffffff10", borderRadius: 12, color: "#fff" }} />
                  <Line type="monotone" dataKey="downloads" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">New User Registrations</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1e30", border: "1px solid #ffffff10", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="users" fill="#ec4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {stats?.trendingApps?.length > 0 && (
              <div className="lg:col-span-2 bg-dark-700 border border-white/5 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <AppIcon name="trend" className="w-5 h-5 text-primary-400" />
                  Top Trending Apps
                </h3>
                <div className="space-y-3">
                  {stats.trendingApps.slice(0, 5).map((app, index) => (
                    <div key={app.id} className="flex items-center gap-4 py-2">
                      <span className="text-xs font-bold text-gray-600 w-5">#{index + 1}</span>
                      <div className="w-9 h-9 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <AppIcon name="app" className="w-4.5 h-4.5 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.category?.name} · {app.developer?.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-400">{(app.downloadCount || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "pending apps" && (
          <div>
            {pendingApps.length === 0 ? (
              <EmptyState icon="check" title="All caught up!" description="No apps awaiting approval" />
            ) : (
              <div className="space-y-4">
                {pendingApps.map((app) => (
                  <div key={app.id} className="bg-dark-700 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <AppIcon name="app" className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{app.name}</h3>
                        <Badge variant="warning">PENDING</Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{app.shortDesc || app.description}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        by {app.developer?.fullName || app.developer?.username} · {app.category?.name} · v{app.version}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        loading={approvingId === app.id}
                        onClick={() => handleApproveApp(app.id, "APPROVED")}
                      >
                        <AppIcon name="approve" className="w-4 h-4 text-white" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={approvingId === app.id}
                        onClick={() => handleApproveApp(app.id, "REJECTED")}
                      >
                        <AppIcon name="reject" className="w-4 h-4 text-white" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="bg-dark-700 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <Input
                  label="Search users by ID or email"
                  placeholder="e.g. 12 or user@example.com"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, searchUsers)}
                />
              </div>
              <Button variant="secondary" onClick={searchUsers}>Search</Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    {["User", "Role", "Status", "Joined", "Actions"].map((heading) => (
                      <th key={heading} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-4">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-dark-800 hover:bg-dark-700 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.fullName?.[0] || user.username?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.fullName || user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={user.role === "ADMIN" ? "warning" : user.role === "DEVELOPER" ? "info" : "neutral"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={user.isActive ? "success" : "danger"}>
                          {user.isActive ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          size="sm"
                          variant="primary"
                          loading={roleBusyId === user.id}
                          onClick={() => handleMakeDeveloper(user.id)}
                          disabled={user.role !== "USER"}
                        >
                          Make Developer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "developers" && (
          <div className="space-y-4">
            <div className="bg-dark-700 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <Input
                  label="Search developers by ID or email"
                  placeholder="e.g. 12 or dev@example.com"
                  value={developerSearch}
                  onChange={(e) => setDeveloperSearch(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, searchDevelopers)}
                />
              </div>
              <Button variant="secondary" onClick={searchDevelopers}>Search</Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    {["Developer", "Status", "Joined", "Actions"].map((heading) => (
                      <th key={heading} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-4">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {developers.map((user) => (
                    <tr key={user.id} className="bg-dark-800 hover:bg-dark-700 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.fullName?.[0] || user.username?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.fullName || user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={user.isActive ? "success" : "danger"}>
                          {user.isActive ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          size="sm"
                          variant="danger"
                          loading={roleBusyId === user.id}
                          onClick={() => handleRemoveDeveloper(user.id)}
                        >
                          <AppIcon name="remove" className="w-4 h-4 text-white" />
                          Remove Developer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {flaggedReviews.length === 0 ? (
              <EmptyState icon="check" title="No flagged reviews" description="All reviews look clean!" />
            ) : (
              flaggedReviews.map((review) => (
                <div key={review.id} className="bg-dark-700 border border-red-500/20 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white">{review.user?.fullName || review.user?.username}</p>
                      <p className="text-xs text-gray-500">Rating: {review.rating}/5 · {review.app?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.isFake && (
                        <Badge variant="danger">
                          <AppIcon name="fake" className="w-4 h-4 text-red-300" />
                          Fake Detected
                        </Badge>
                      )}
                      <Badge variant="warning">
                        <AppIcon name="warning" className="w-4 h-4 text-yellow-300" />
                        Flagged
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{review.content}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => reviewsAPI.moderate(review.id, true).then(() => {
                      setFlaggedReviews((p) => p.filter((r) => r.id !== review.id));
                      toast.success("Review approved");
                    })}>
                      <AppIcon name="approve" className="w-4 h-4 text-primary-400" />
                      Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => reviewsAPI.moderate(review.id, false).then(() => {
                      setFlaggedReviews((p) => p.filter((r) => r.id !== review.id));
                      toast.success("Review removed");
                    })}>
                      <AppIcon name="remove" className="w-4 h-4 text-white" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
