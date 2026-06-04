import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { recommendAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AppCard from "../components/marketplace/AppCard";
import { SkeletonCard, EmptyState, Badge, Button } from "../components/shared/index";

function SignalCard({ title, value, description }) {
  return (
    <div className="rounded-lg bg-dark-700 border border-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="text-lg font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
}

function Section({ title, subtitle, children, action }) {
  return (
    <section className="mb-12">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [personalized, setPersonalized] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [personalizedRes, trendingRes] = await Promise.allSettled([
          recommendAPI.forUser(user.id, 12),
          recommendAPI.trending(8),
        ]);
        setPersonalized(personalizedRes.status === "fulfilled" ? personalizedRes.value.data.data || [] : []);
        setTrending(trendingRes.status === "fulfilled" ? trendingRes.value.data.data || [] : []);
      } catch {
        setPersonalized([]);
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) load();
  }, [user]);

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="border-b border-white/5 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="default">AI powered</Badge>
                <Badge variant="info">Hybrid recommendations</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white">Your recommendation feed</h1>
              <p className="text-gray-400 mt-2 max-w-2xl">
                Personalized app suggestions use your downloads, ratings, category patterns, and trending marketplace signals.
              </p>
            </div>
            <Link to="/apps">
              <Button variant="secondary" className="rounded-lg w-full sm:w-auto">Browse all apps</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <SignalCard title="Behavior" value="Downloads" description="Apps you install help shape future suggestions." />
          <SignalCard title="Preference" value="Ratings" description="Review scores refine categories and app ranking." />
          <SignalCard title="Market" value="Trending" description="Popular apps fill cold-start and discovery gaps." />
        </div>

        <Section
          title="Recommended for you"
          subtitle="Apps ranked from your user activity and preference signals"
          action={<Badge variant="success">{personalized.length} apps</Badge>}
        >
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : personalized.length === 0 ? (
            <EmptyState
              icon="New user"
              title="Building your profile"
              description="Download or rate a few apps so the recommendation engine has stronger signals."
              action={<Link to="/apps"><Button variant="outline">Explore apps</Button></Link>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {personalized.map((app) => <AppCard key={app.id} app={app} />)}
            </div>
          )}
        </Section>

        <Section
          title="Trending analysis"
          subtitle="Apps with strong recent popularity and marketplace activity"
          action={<Link to="/apps?sort=trendingScore" className="text-sm text-primary-300 hover:text-primary-200">View trending</Link>}
        >
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array(4).fill(0).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : trending.length === 0 ? (
            <EmptyState icon="No data" title="No trending apps yet" description="Trending apps appear when marketplace activity is available." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trending.map((app) => <AppCard key={app.id} app={app} />)}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
