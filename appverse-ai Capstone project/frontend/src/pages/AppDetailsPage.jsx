import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { aiAPI, appsAPI, reviewsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { AppIcon, Badge, Button, EmptyState, Spinner, StarRating } from "../components/shared/index";
import AppCard from "../components/marketplace/AppCard";
import toast from "react-hot-toast";

const SENTIMENT_ICON = { POSITIVE: "smile", NEGATIVE: "sad", NEUTRAL: "neutral" };

function parseJsonList(value) {
  if (!value) return [];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeText(value, fallback = "—") {
  return value ? value : fallback;
}

function getReviewFlags(review) {
  const isFake = Boolean(review?.isFake ?? review?.fakeReview ?? review?.fake);
  const isFlagged = Boolean(review?.isFlagged ?? review?.flagged);
  return { isFake, isFlagged };
}

export default function AppDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isAppOwned, fetchOwnedApps } = useAppContext();

  const [app, setApp] = useState(null);
  const [latestDownloadUrl, setLatestDownloadUrl] = useState("");
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewSummaryLoading, setReviewSummaryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewInsights, setReviewInsights] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", content: "" });
  const [purchaseForm, setPurchaseForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadDetails = async () => {
      setLoading(true);
      setReviewsLoading(true);
      try {
        const appResponse = await appsAPI.getById(id);
        if (!mounted) return;

        const appData = appResponse.data.data;
        setApp(appData);
        setReviewSummaryLoading(true);

        const [reviewsResult, similarResult, summaryResult, versionsResult] = await Promise.allSettled([
          reviewsAPI.getByApp(id),
          aiAPI.similarApps({ currentApp: { id: Number(id) }, limit: 6 }),
          aiAPI.reviewSummary({ appId: Number(id), appName: appData?.name || "App" }),
          appsAPI.versions(id),
        ]);

        if (versionsResult.status === "fulfilled") {
          const versions = versionsResult.value.data.data || [];
          setLatestDownloadUrl(versions?.[0]?.downloadUrl || "");
        } else {
          setLatestDownloadUrl("");
        }

        const isPaid = Boolean(appData?.price && Number(appData.price) > 0);
        const ownsApp = Boolean(
          user && appData?.developer?.id && Number(user.id) === Number(appData.developer.id)
        );
        const isAdmin = user?.role === "ADMIN";
        const downloaded = isAppOwned(id);

        if (!isPaid || ownsApp || isAdmin || downloaded) {
          setIsPurchased(true);
        } else if (isAuthenticated) {
          const purchaseResponse = await appsAPI.purchaseStatus(id);
          if (!mounted) return;
          setIsPurchased(Boolean(purchaseResponse.data.data?.purchased));
        } else {
          setIsPurchased(false);
        }

        if (reviewsResult.status === "fulfilled") {
          setReviews(reviewsResult.value.data.data?.content || []);
        } else {
          setReviews([]);
        }

        if (similarResult.status === "fulfilled") {
          const items = similarResult.value.data.data?.similarApps || [];
          const resolved = await Promise.all(
            items.map(async (item) => {
              try {
                const appRes = await appsAPI.getById(item.appId);
                return { ...appRes.data.data, reason: item.reason, score: item.score };
              } catch {
                return null;
              }
            })
          );
          setSimilar(resolved.filter(Boolean));
        } else {
          setSimilar([]);
        }

        if (summaryResult.status === "fulfilled") {
          setReviewSummary(summaryResult.value.data.data || null);
        } else {
          setReviewSummary(null);
        }
      } catch {
        toast.error("Failed to load app details");
      } finally {
        if (mounted) {
          setLoading(false);
          setReviewsLoading(false);
          setReviewSummaryLoading(false);
        }
      }
    };

    loadDetails();
    return () => {
      mounted = false;
    };
  }, [id, isAuthenticated, user, isAppOwned]);

  const screenshots = useMemo(() => {
    const items = parseJsonList(app?.screenshots);
    if (items.length > 0) return items;
    return app?.bannerUrl ? [app.bannerUrl] : [];
  }, [app]);

  const tags = useMemo(() => parseJsonList(app?.tags), [app]);

  const isFree = !app?.price || parseFloat(app.price) === 0;
  const canOpen = isAppOwned(id);
  const canInstall = isFree && !canOpen;
  const ratingValue = Number(app?.avgRating || 0);
  const ratingCount = app?.reviewCount || reviews.length || 0;
  const updatedDate = app?.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "Recently";
  const highlightItems = [
    {
      label: "Rating",
      value: ratingValue.toFixed(1),
      detail: `${ratingCount} reviews`,
    },
    {
      label: "Installs",
      value: (app?.downloadCount || 0).toLocaleString(),
      detail: "Downloaded by users",
    },
    {
      label: "Size",
      value: app?.sizeMb ? `${app.sizeMb} MB` : "N/A",
      detail: safeText(app?.minOsVersion, "Any OS"),
    },
    {
      label: "Updated",
      value: updatedDate,
      detail: `v${safeText(app?.version)}`,
    },
  ];

  const recordDownload = async () => {
    await appsAPI.download(id);
    await fetchOwnedApps();
    setApp((current) =>
      current
        ? { ...current, downloadCount: (current.downloadCount || 0) + 1 }
        : current
    );
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await recordDownload();
      toast.success("Download started!");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpen = async () => {
    if (latestDownloadUrl) {
      window.open(latestDownloadUrl, "_blank", "noopener,noreferrer");
      return;
    }

    toast.success("This app is already installed.");
  };

  const handlePrimaryAction = () => {
    if (canOpen) {
      handleOpen();
      return;
    }

    if (canInstall) {
      handleDownload();
      return;
    }

    if (!isAuthenticated) {
      toast.error("Login to purchase this app");
      navigate("/login");
      return;
    }

    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Login to purchase this app");
      navigate("/login");
      return;
    }

    setPurchaseLoading(true);
    try {
      await appsAPI.purchaseDemo(id, purchaseForm);
      setIsPurchased(true);
      setShowPurchaseModal(false);
      toast.success("Demo payment successful");
      await recordDownload();
      await fetchOwnedApps();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: app.name,
          text: app.shortDesc || app.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch {
      toast.error("Could not share app");
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Login to submit a review");
      return;
    }

    setReviewLoading(true);
    try {
      const { data } = await reviewsAPI.add(id, user.id, reviewForm);
      setReviews((current) => [data.data, ...current]);
      setReviewInsights({
        sentiment: data.data?.sentiment,
        confidence: data.data?.aiConfidence,
        predictedRating: data.data?.predictedRating,
        trustScore: data.data?.trustScore,
        moderationReason: data.data?.moderationReason,
      });
      setReviewForm({ rating: 5, title: "", content: "" });
      toast.success("Review submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!app) return <EmptyState icon="search" title="App not found" />;

  return (
    <div className="min-h-screen bg-dark-900">
      <section className="relative border-b border-white/5 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={app.status === "APPROVED" ? "success" : "warning"}>{app.status}</Badge>
                <span className="text-xs text-gray-500">{app.category?.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{app.name}</h1>
              <p className="text-gray-400 max-w-3xl">
                by <span className="text-primary-400">{app.developer?.fullName || app.developer?.username}</span>
                {" · "}v{app.version}
                {" · "}Updated {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "recently"}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5">
                <div className="flex items-center gap-2">
                  <StarRating rating={ratingValue} size="md" />
                  <span className="text-sm text-gray-400">{ratingCount} reviews</span>
                </div>
                <span className="text-sm text-gray-400 inline-flex items-center gap-1">
                  <AppIcon name="download" className="w-4 h-4 text-gray-400" />
                  {(app.downloadCount || 0).toLocaleString()} installs
                </span>
                {app.sizeMb && (
                  <span className="text-sm text-gray-400 inline-flex items-center gap-1">
                    <AppIcon name="app" className="w-4 h-4 text-gray-400" />
                    {app.sizeMb} MB
                  </span>
                )}
                <span className="text-sm text-gray-400">{safeText(app.minOsVersion, "Any OS")}</span>
              </div>

              <section className="mt-6 rounded-2xl border border-white/5 bg-dark-700 p-5">
                <h2 className="text-lg font-semibold text-white mb-3">About this app</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{app.description}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section className="mt-4 rounded-2xl border border-white/5 bg-dark-700 p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-white">At a glance</h2>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Quick facts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlightItems.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                      <p className="text-xl font-semibold text-white mt-1 truncate">{item.value}</p>
                      <p className="text-xs text-gray-400 mt-2">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            <div className="lg:w-[320px] shrink-0 space-y-4">
              <section className="bg-dark-700 border border-white/5 rounded-2xl p-5 h-fit shadow-2xl">
                <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-dark-600 border border-white/10 flex-shrink-0">
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      <AppIcon name="app" className="w-7 h-7 text-primary-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-white truncate">{app.name}</p>
                  <p className="text-sm text-gray-400 truncate">{app.category?.name}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
                  <p className="text-2xl font-bold text-white">{isFree ? "Free" : `Rs ${app.price}`}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Rating</p>
                  <p className="text-2xl font-bold text-white">{ratingValue.toFixed(1)}</p>
                </div>
              </div>

              <Button size="lg" loading={downloading} onClick={handlePrimaryAction} className="w-full mt-5">
                {canOpen ? "Open" : canInstall ? "Install" : `Buy for Rs ${app.price}`}
              </Button>
              <Button variant="secondary" size="lg" onClick={handleShare} className="w-full mt-3">
                <AppIcon name="share" className="w-4 h-4 text-white" />
                Share App
              </Button>

              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                {canOpen ? "Installed on this device or linked to your account" : isFree ? "Contains ads · In-app purchases" : "One-time purchase · Demo checkout enabled"}
              </p>

              <div className="mt-5 space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Developer</span>
                  <span className="text-white">{safeText(app.developer?.fullName || app.developer?.username)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <span className="text-white">{safeText(app.version)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Downloads</span>
                  <span className="text-white">{(app.downloadCount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <span className="text-white">{safeText(app.category?.name)}</span>
                </div>
              </div>
              </section>

              <section className="bg-dark-700 border border-white/5 rounded-2xl p-5 shadow-2xl">
                <h3 className="text-base font-semibold text-white mb-4">Data safety</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>- App data is loaded in real time from the backend.</li>
                  <li>- Reviews are fetched independently from app details.</li>
                  <li>- Similar apps are computed from live app data.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {screenshots.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {screenshots.slice(0, 3).map((shot, index) => (
                <div
                  key={`${shot}-${index}`}
                  className="rounded-2xl overflow-hidden border border-white/10 bg-dark-700 aspect-[16/10]"
                >
                  <img src={shot} alt={`${app.name} screenshot ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {app.releaseNotes && (
              <section className="bg-dark-700 border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-3">What&apos;s new</h2>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{app.releaseNotes}</p>
              </section>
            )}

            <section className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-white">AI review summary</h2>
                <Badge variant="info">Powered by Gemini</Badge>
              </div>
              {reviewSummaryLoading ? (
                <div className="text-sm text-gray-500">Generating review summary...</div>
              ) : reviewSummary ? (
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{reviewSummary.summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-emerald-300 mb-2">Positive highlights</p>
                      <ul className="space-y-1 text-sm text-gray-200">
                        {(reviewSummary.positiveHighlights || []).map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-rose-300 mb-2">Negative highlights</p>
                      <ul className="space-y-1 text-sm text-gray-200">
                        {(reviewSummary.negativeHighlights || []).map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={reviewSummary.overallSentiment === "POSITIVE" ? "success" : reviewSummary.overallSentiment === "NEGATIVE" ? "danger" : "neutral"}>
                      {reviewSummary.overallSentiment}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No AI summary available yet.</p>
              )}
            </section>

            <section className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Ratings and reviews</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 text-center">
                  <div className="text-5xl font-bold text-white">{ratingValue.toFixed(1)}</div>
                  <StarRating rating={ratingValue} size="md" />
                  <p className="text-sm text-gray-500 mt-2">{ratingCount} reviews</p>
                </div>
                <div className="flex-1 space-y-2 pt-2">
                  {[5, 4, 3, 2, 1].map((score) => {
                    const count = reviews.filter((review) => review.rating === score).length || 0;
                    const width =
                      ratingCount > 0
                        ? `${Math.max(6, Math.round((count / Math.max(1, ratingCount)) * 100))}%`
                        : "6%";
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-4">{score}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">User reviews</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("reviews")}>
                  Write review
                </Button>
              </div>
              {reviewsLoading ? (
                <div className="text-gray-500 text-sm">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <EmptyState icon="review" title="No reviews yet" description="Be the first to review this app!" />
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => {
                    const reviewFlags = getReviewFlags(review);
                    return (
                      <article
                        key={review.id}
                        className={`rounded-2xl border p-4 ${
                          reviewFlags.isFake
                            ? "border-red-500/30 bg-red-500/5"
                            : reviewFlags.isFlagged
                              ? "border-yellow-500/30 bg-yellow-500/5"
                              : "border-white/5 bg-dark-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {review.user?.fullName || review.user?.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {!reviewFlags.isFake && (
                              <>
                                <AppIcon
                                  name={SENTIMENT_ICON[review.sentiment] || "neutral"}
                                  className="w-4 h-4 text-gray-300"
                                />
                                <Badge
                                  variant={
                                    review.sentiment === "POSITIVE"
                                      ? "success"
                                      : review.sentiment === "NEGATIVE"
                                        ? "danger"
                                        : "neutral"
                                  }
                                >
                                  {review.sentiment}
                                </Badge>
                              </>
                            )}
                            {reviewFlags.isFake && <Badge variant="danger">Fake review</Badge>}
                            {!reviewFlags.isFake && reviewFlags.isFlagged && <Badge variant="warning">Flagged by AI</Badge>}
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                        {review.title && <h3 className="text-sm font-semibold text-white mt-3">{review.title}</h3>}
                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{review.content}</p>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <section className="bg-dark-700 border border-white/5 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-4">App info</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Version", safeText(app.version)],
                  ["Category", safeText(app.category?.name)],
                  ["Size", app.sizeMb ? `${app.sizeMb} MB` : "—"],
                  ["Min OS", safeText(app.minOsVersion)],
                  ["Published", app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-dark-700 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Similar apps</h3>
                <span className="text-xs text-gray-500">AI matched</span>
              </div>
              {similar.length === 0 ? (
                <p className="text-sm text-gray-500">No similar apps found yet.</p>
              ) : (
                <div className="space-y-3">
                  {similar.slice(0, 6).map((item) => (
                    <div key={item.id} className="space-y-2">
                      <AppCard app={item} compact />
                      {item.reason && <p className="text-xs text-gray-500 leading-relaxed px-1">{item.reason}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>

          </aside>
        </div>

        <div className="mt-10" id="review-form">
          {activeTab === "reviews" && (
            <section className="bg-dark-700 border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Write a review</h2>
              {isAuthenticated ? (
                <>
                <form onSubmit={handleReviewSubmit} className="grid gap-4 max-w-2xl">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Your rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      size="lg"
                      interactive
                      onChange={(rating) => setReviewForm((current) => ({ ...current, rating }))}
                      showNumber={false}
                    />
                  </div>
                  <input
                    placeholder="Review title (optional)"
                    value={reviewForm.title}
                    onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full bg-dark-600 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  />
                  <textarea
                    placeholder="Share your experience with this app..."
                    value={reviewForm.content}
                    onChange={(event) => setReviewForm((current) => ({ ...current, content: event.target.value }))}
                    rows={5}
                    required
                    minLength={10}
                    className="w-full bg-dark-600 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
                  />
                  <Button type="submit" loading={reviewLoading} className="w-fit">
                    Submit Review
                  </Button>
                </form>
                {reviewInsights && (
                  <div className="mt-6 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4 max-w-2xl">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="text-sm font-semibold text-white">AI review analysis</h3>
                      <Badge variant="info">{reviewInsights.sentiment}</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Confidence</p>
                        <p className="text-white font-semibold">{Number(reviewInsights.confidence || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Predicted rating</p>
                        <p className="text-white font-semibold">{reviewInsights.predictedRating || "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Trust score</p>
                        <p className="text-white font-semibold">{Number(reviewInsights.trustScore || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Moderation</p>
                        <p className="text-white font-semibold">{reviewInsights.moderationReason || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
                </>
              ) : (
                <div className="text-sm text-gray-400">
                  <p className="mb-3">Login to write a review.</p>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-dark-800/95 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{app.name}</p>
            <p className="text-xs text-gray-500">
              {canOpen ? "Ready to open" : canInstall ? "Ready to install" : `Rs ${app.price}`} - {ratingValue.toFixed(1)} rating
            </p>
          </div>
          <Button loading={downloading} onClick={handlePrimaryAction} className="rounded-lg">
            {canOpen ? "Open" : canInstall ? "Install" : "Buy"}
          </Button>
        </div>
      </div>

      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-dark-800 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Demo Checkout</p>
                <h3 className="text-2xl font-semibold text-white mt-1">{app.name}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  This is a simulated payment flow for testing only.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-white text-xl leading-none"
                aria-label="Close checkout"
              >
                x
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Card holder name</label>
                <input
                  required
                  value={purchaseForm.cardHolderName}
                  onChange={(event) =>
                    setPurchaseForm((current) => ({ ...current, cardHolderName: event.target.value }))
                  }
                  className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Card number</label>
                <input
                  required
                  inputMode="numeric"
                  maxLength={19}
                  value={purchaseForm.cardNumber}
                  onChange={(event) =>
                    setPurchaseForm((current) => ({
                      ...current,
                      cardNumber: event.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="4242424242424242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Expiry</label>
                  <input
                    required
                    value={purchaseForm.expiry}
                    onChange={(event) =>
                      setPurchaseForm((current) => ({ ...current, expiry: event.target.value }))
                    }
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder="12/28"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">CVV</label>
                  <input
                    required
                    inputMode="numeric"
                    maxLength={4}
                    value={purchaseForm.cvv}
                    onChange={(event) =>
                      setPurchaseForm((current) => ({
                        ...current,
                        cvv: event.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-lg font-semibold text-white">Rs {app.price}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowPurchaseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={purchaseLoading} className="flex-1">
                  Pay & Install
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
