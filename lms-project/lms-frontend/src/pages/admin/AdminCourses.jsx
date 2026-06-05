import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BookOpen, Search, Users, Clock, Play } from 'lucide-react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { courseService, learningService } from '../../services/dataService';
import { useToast } from '../../components/Toast';

const emptyForm = {
  courseName: '',
  instructor: '',
  category: '',
  level: '',
  duration: '',
  imageUrl: '',
  publishedBy: '',
  badge: '',
  rating: '',
  ratingCount: '',
  priceInr: '',
  listPriceInr: '',
  description: '',
};

export default function AdminCourses() {
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [previewVideo, setPreviewVideo] = useState({ open: false, title: '', url: '' });
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [durations, setDurations] = useState([]);

  const load = async () => {
    const data = await courseService.getAll();
    setCourses(data);
    const derivedLevels = Array.from(new Set(data.map((c) => c.level).filter(Boolean)));
    const derivedCategories = Array.from(new Set(data.map((c) => c.category).filter(Boolean)));
    const derivedDurations = Array.from(new Set(data.map((c) => c.duration).filter(Boolean)));
    setLevels(derivedLevels.length ? derivedLevels : ['Beginner', 'Intermediate', 'Advanced']);
    setCategories(derivedCategories.length ? derivedCategories : ['General']);
    setDurations(derivedDurations.length ? derivedDurations : ['12 weeks']);
  };
  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c =>
    c.courseName.toLowerCase().includes(search.toLowerCase()) &&
    (!filterLevel || c.level === filterLevel)
  );

  const openAdd = () => {
    setEditId(null);
    setForm({
      ...emptyForm,
      category: categories[0] || 'General',
      level: levels[0] || 'Beginner',
      duration: durations[0] || '12 weeks',
      publishedBy: 'LMS Academy',
      badge: 'Popular',
      rating: '4.5',
      ratingCount: '1000',
      priceInr: '499',
      listPriceInr: '2999',
    });
    setShowModal(true);
  };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({
      courseName: c.courseName || '',
      instructor: c.instructor || '',
      category: c.category || categories[0] || 'General',
      level: c.level || levels[0] || 'Beginner',
      duration: c.duration || durations[0] || '12 weeks',
      imageUrl: c.imageUrl || '',
      publishedBy: c.publishedBy || 'LMS Academy',
      badge: c.badge || 'Popular',
      rating: c.rating ?? '4.5',
      ratingCount: c.ratingCount ?? '1000',
      priceInr: c.priceInr ?? '499',
      listPriceInr: c.listPriceInr ?? '2999',
      description: c.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.courseName.trim()) { toast('Course name is required', 'error'); return; }
    if (editId) {
      await courseService.update(editId, form);
      toast('Course updated successfully');
    } else {
      await courseService.add(form);
      toast('Course added successfully');
    }
    await load();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    await courseService.delete(id);
    toast('Course deleted', 'info');
    await load();
    setShowDeleteModal(null);
  };

  const levelBadge = (level) => {
    if (level === 'Beginner') return 'badge-green';
    if (level === 'Intermediate') return 'badge-amber';
    return 'badge-rose';
  };

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

  const handlePreview = async (course) => {
    const modules = await learningService.getCourseModules(course.id);
    const firstVideo = (modules || [])
      .flatMap((m) => m.activities || [])
      .find((a) => a.activity_type === 'VIDEO' && a.resource_link);
    const embed = toEmbedUrl(firstVideo?.resource_link);
    if (!embed) {
      toast('No preview video found for this course', 'info');
      return;
    }
    setPreviewVideo({
      open: true,
      title: firstVideo.activity_title || `${course.courseName} - Preview`,
      url: embed,
    });
  };

  return (
    <Layout title="Courses" subtitle="Manage your course catalog">
      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', width: 240 }}>
            <Search size={14} color="var(--text-muted)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }} />
          </div>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="input-field" style={{ width: 160, padding: '9px 12px' }}>
            <option value="">All Levels</option>
            {levels.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} courses</div>
          <button className="btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Plus size={15} />Add Course
          </button>
        </div>
      </div>

      {/* Courses grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ padding: 22 }}>
            <div style={{
              height: 140,
              borderRadius: 12,
              marginBottom: 14,
              background: c.imageUrl
                ? `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.35)), url(${c.imageUrl}) center/cover`
                : 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.12))',
              border: '1px solid var(--border)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="#3b82f6" />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(c)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => setShowDeleteModal(c)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', cursor: 'pointer', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 6px', color: 'var(--text-primary)', lineHeight: 1.3 }}>{c.courseName}</h4>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{c.instructor || 'Instructor TBD'}</div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              <span className={`badge ${levelBadge(c.level)}`}>{c.level || 'Beginner'}</span>
              <span className="badge badge-blue">{c.category || 'General'}</span>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <Clock size={12} />{c.duration || 'N/A'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <Users size={12} />{c.enrolled || 0} students
              </div>
            </div>

            {/* Enrollment bar */}
            <div style={{ marginTop: 14 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (c.enrolled || 0) / 60 * 100)}%` }} />
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Enrollment</span>
              <span>{c.enrolled || 0}/60</span>
            </div>

            <button className="btn-secondary" style={{ marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => handlePreview(c)}>
              <Play size={14} />Watch Preview
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>No courses found</div>
            <div style={{ fontSize: 13 }}>Try adjusting your search or add a new course</div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Course' : 'Add New Course'} maxWidth={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Course Name *</label>
            <input className="input-field" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} placeholder="e.g. Introduction to Python" />
          </div>
          <div>
            <label className="label">Instructor</label>
            <input className="input-field" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} placeholder="e.g. Dr. Jane Smith" />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input-field" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Level</label>
              <select className="input-field" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {levels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Published By</label>
              <input className="input-field" value={form.publishedBy} onChange={e => setForm({ ...form, publishedBy: e.target.value })} placeholder="LMS Academy" />
            </div>
            <div>
              <label className="label">Badge</label>
              <input className="input-field" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="Popular" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Rating</label>
              <input className="input-field" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
            </div>
            <div>
              <label className="label">Rating Count</label>
              <input className="input-field" type="number" min="0" value={form.ratingCount} onChange={e => setForm({ ...form, ratingCount: e.target.value })} placeholder="1000" />
            </div>
            <div>
              <label className="label">Price INR</label>
              <input className="input-field" type="number" min="0" step="0.01" value={form.priceInr} onChange={e => setForm({ ...form, priceInr: e.target.value })} placeholder="499" />
            </div>
          </div>
          <div>
            <label className="label">List Price INR</label>
            <input className="input-field" type="number" min="0" step="0.01" value={form.listPriceInr} onChange={e => setForm({ ...form, listPriceInr: e.target.value })} placeholder="2999" />
          </div>
          <div>
            <label className="label">Duration</label>
            <select className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
              {durations.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief course description..." rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'Update Course' : 'Add Course'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Course">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{showDeleteModal?.courseName}</strong>? This will also remove it from all enrolled students.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => setShowDeleteModal(null)}>Cancel</button>
          <button className="btn-danger" style={{ padding: '10px 20px' }} onClick={() => handleDelete(showDeleteModal?.id)}>Delete Course</button>
        </div>
      </Modal>

      {previewVideo.open && (
        <div
          onClick={() => setPreviewVideo({ open: false, title: '', url: '' })}
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
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>{previewVideo.title}</div>
              <button className="btn-secondary" onClick={() => setPreviewVideo({ open: false, title: '', url: '' })}>Close</button>
            </div>
            <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
              <iframe
                title={previewVideo.title}
                src={previewVideo.url}
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
