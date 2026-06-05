import { useState, useEffect } from 'react';
import { BookOpen, Search, Users, Clock, Star, Filter } from 'lucide-react';
import Layout from '../../components/Layout';
import { learningService } from '../../services/dataService';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

export default function UserBrowse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await learningService.getCatalog(user?.username);
      setCourses(data.courses);
      setCategories(data.categories);
    };
    load();
  }, [user?.username]);

  const filtered = courses.filter(c => {
    const matchSearch = (c.courseName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  const handleEnroll = async (id, isEnrolled) => {
    if (!user?.username) return;
    if (isEnrolled) {
      await learningService.unenrollCourse(user.username, id);
      setCourses((prev) => prev.map((c) => c.id === id ? { ...c, isEnrolled: false, enrolled: Math.max(0, (c.enrolled || 0) - 1) } : c));
      toast('Unenrolled from course', 'info');
    } else {
      await learningService.enrollCourse(user.username, id);
      setCourses((prev) => prev.map((c) => c.id === id ? { ...c, isEnrolled: true, enrolled: (c.enrolled || 0) + 1 } : c));
      toast('Successfully enrolled!', 'success');
    }
  };

  return (
    <Layout title="Browse Courses" subtitle="Discover and enroll in new courses">
      {/* Search + filters */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses, instructors..."
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                border: `1px solid ${category === cat ? 'var(--accent-blue)' : 'var(--border)'}`,
                background: category === cat ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)',
                color: category === cat ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'Syne',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} courses</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(c => {
          const isEnrolled = Boolean(c.isEnrolled);
          return (
            <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Course header */}
              <div style={{
                height: 120,
                background: c.imageUrl
                  ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.25)), url(${c.imageUrl}) center/cover`
                  : `linear-gradient(135deg, hsl(${c.id * 40 + 200}, 50%, 18%), hsl(${c.id * 40 + 220}, 60%, 12%))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: `hsl(${c.id * 40 + 200}, 60%, 40%)`, opacity: 0.1, top: -30, right: -30 }} />
                <BookOpen size={40} color={`hsl(${c.id * 40 + 200}, 70%, 60%)`} style={{ opacity: 0.9 }} />
                {isEnrolled && (
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>Enrolled</span>
                  </div>
                )}
              </div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{c.category || 'General'}</span>
                  <span className={`badge ${c.level === 'Beginner' ? 'badge-green' : c.level === 'Advanced' ? 'badge-rose' : 'badge-amber'}`} style={{ fontSize: 10 }}>{c.level || 'Beginner'}</span>
                </div>

                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 6px', lineHeight: 1.35, color: 'var(--text-primary)' }}>{c.courseName}</h4>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{c.instructor || 'Staff'}</div>

                <div style={{ display: 'flex', gap: 14, marginBottom: 14, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />{c.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={12} />{c.enrolled || 0}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24' }}>
                    <Star size={12} fill="#fbbf24" />{c.rating}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Rs. {Number(c.priceInr).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 14, textDecoration: 'line-through', color: 'var(--text-muted)' }}>Rs. {Number(c.listPriceInr).toLocaleString('en-IN')}</div>
                </div>

                <button
                  onClick={() => handleEnroll(c.id, isEnrolled)}
                  className={isEnrolled ? 'btn-secondary' : 'btn-primary'}
                  style={{ width: '100%' }}
                >
                  {isEnrolled ? 'Unenroll' : 'Enroll Now'}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Search size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>No courses found</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Try a different search or category</div>
          </div>
        )}
      </div>
    </Layout>
  );
}
