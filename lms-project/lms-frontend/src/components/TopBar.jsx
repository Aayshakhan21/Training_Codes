import { useEffect, useState } from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { learningService } from '../services/dataService';

export default function TopBar({ title, subtitle }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      setNotifications(await learningService.getNotifications(user?.username));
    };
    load();
  }, [user?.username]);

  const unread = notifications.filter(n => n.unread).length;

  return (
    <div style={{
      height: 72,
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 14px',
          width: 200,
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Search..."
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 13,
              width: '100%',
            }}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              position: 'relative',
            }}
          >
            <Bell size={16} />
            {unread > 0 && (
              <div style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-rose)',
                border: '2px solid var(--bg-secondary)',
              }} />
            )}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute',
              top: 46,
              right: 0,
              width: 300,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-bright)',
              borderRadius: 14,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              zIndex: 100,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13 }}>Notifications</span>
                <span className="badge badge-rose">{unread} new</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  background: n.unread ? 'rgba(59,130,246,0.04)' : 'transparent',
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: n.unread ? 'var(--accent-blue)' : 'transparent',
                    marginTop: 5,
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
        }}>
          {user?.name?.charAt(0) || user?.username?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
