import React, { useEffect, useState } from "react";
import { notificationsAPI } from "../services/api";
import { Badge, Button, EmptyState, Spinner } from "../components/shared/index";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await notificationsAPI.list();
        setItems(data.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markAll = async () => {
    await notificationsAPI.markAllRead();
    const { data } = await notificationsAPI.list();
    setItems(data.data || []);
  };

  return (
    <div className="min-h-screen bg-dark-900 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
        <Button variant="secondary" onClick={markAll}>Mark all read</Button>
      </div>
      {loading ? <Spinner size="lg" /> : items.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-dark-700 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    {!item.isRead && <Badge variant="warning">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{item.message}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={async () => {
                  await notificationsAPI.markRead(item.id);
                  const { data } = await notificationsAPI.list();
                  setItems(data.data || []);
                }}>
                  Mark read
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
