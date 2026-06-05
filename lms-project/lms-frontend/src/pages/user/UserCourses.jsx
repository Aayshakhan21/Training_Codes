import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import Layout from '../../components/Layout';
import { learningService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export default function UserCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [courseModules, setCourseModules] = useState({});
  const [videoModal, setVideoModal] = useState({ open: false, title: '', url: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const toEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : '';
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : '';
    }
    return '';
  };

  useEffect(() => {
    const load = async () => {
      const allCourses = await learningService.getCoursesProgress(user?.username);
      setCourses(allCourses);
      const modulesEntries = await Promise.all(
        allCourses.map(async (course) => [course.id, await learningService.getCourseModules(course.id)])
      );
      setCourseModules(Object.fromEntries(modulesEntries));
    };
    load();
  }, [user?.username]);

  const getStatus = (id) => {
    const p = courses.find((c) => c.id === id)?.progress || 0;
    if (p === 100) return 'completed';
    if (p > 0) return 'in-progress';
    return 'not-started';
  };

  const filtered = courses.filter(c => {
    const matchSearch = (c.courseName || '').toLowerCase().includes(search.toLowerCase());
    const status = getStatus(c.id);
    if (filter === 'all') return matchSearch;
    if (filter === 'in-progress') return matchSearch && status === 'in-progress';
    if (filter === 'completed') return matchSearch && status === 'completed';
    return matchSearch;
  });

  return (
    <Layout title="My Courses" subtitle="Track your enrolled courses and progress">
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', width: 240 }}>
          <Search size={14} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search my courses..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'in-progress', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: `1px solid ${filter === f ? 'var(--accent-blue)' : 'var(--border)'}`,
                background: filter === f ? 'rgba(59,130,246,0.1)' : 'var(--bg-card)',
                color: filter === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'Syne',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(c => {
          const progress = c.progress || 0;
          const status = getStatus(c.id);
          const modules = courseModules[c.id] || [];
          const moduleNames = modules.slice(0, 4).map((m) => m.module_title);
          const firstVideo = modules
            .flatMap((m) => m.activities || [])
            .find((a) => a.activity_type === 'VIDEO' && a.resource_link);
          return (
            <div key={c.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  background: `hsl(${c.id * 40 + 180}, 50%, 20%)`,
                  border: `1px solid hsl(${c.id * 40 + 180}, 50%, 30%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <BookOpen size={28} color={`hsl(${c.id * 40 + 180}, 70%, 60%)`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, margin: 0 }}>{c.courseName}</h3>
                    <span className={`badge ${status === 'completed' ? 'badge-green' : status === 'in-progress' ? 'badge-amber' : 'badge-violet'}`}>
                      {status.replace('-', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                    {c.instructor} · {c.level} · {c.duration} · {c.category}
                  </div>

                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{
                        width: `${progress}%`,
                        background: status === 'completed'
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{progress}%</span>
                  </div>

                  {/* Modules */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {moduleNames.map((mod, i) => {
                      const done = i < Math.floor(progress / 25);
                      return (
                        <div key={mod} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '5px 10px',
                          borderRadius: 20,
                          background: done ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)',
                          border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                          fontSize: 11,
                          color: done ? 'var(--accent-emerald)' : 'var(--text-muted)',
                        }}>
                          {done ? <CheckCircle size={11} /> : <Clock size={11} />}
                          {mod}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                      onClick={() => {
                        const embed = toEmbedUrl(firstVideo?.resource_link);
                        if (!embed) return;
                        setVideoModal({
                          open: true,
                          title: firstVideo.activity_title || `${c.courseName} - Video`,
                          url: embed,
                        });
                      }}
                    >
                      <Play size={13} />{status === 'completed' ? 'Review Course' : 'Continue Learning'}
                    </button>
                    <button className="btn-secondary" style={{ fontSize: 13 }}>View Details</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>No courses found</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filter or browse available courses</div>
          </div>
        )}
      </div>

      {videoModal.open && (
        <div
          onClick={() => setVideoModal({ open: false, title: '', url: '' })}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(980px, 96vw)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>{videoModal.title}</div>
              <button className="btn-secondary" onClick={() => setVideoModal({ open: false, title: '', url: '' })}>Close</button>
            </div>
            <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
              <iframe
                title={videoModal.title}
                src={videoModal.url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
