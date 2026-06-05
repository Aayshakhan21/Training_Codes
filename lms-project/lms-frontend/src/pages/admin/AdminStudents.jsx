import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Users, BookOpen, GraduationCap } from 'lucide-react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { studentService, courseService } from '../../services/dataService';
import { useToast } from '../../components/Toast';

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'N/A'];
const emptyForm = { studentName: '', email: '', grade: 'N/A', courseIds: [] };

export default function AdminStudents() {
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const load = async () => {
    setStudents(await studentService.getAll());
    setAllCourses(await courseService.getAll());
  };
  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditId(s.id);
    setForm({
      studentName: s.studentName,
      email: s.email || '',
      grade: s.grade || 'N/A',
      courseIds: (s.courseIds || s.courses?.map(c => c.id) || []).map(Number)
    });
    setShowModal(true);
  };

  const toggleCourse = (id) => {
    const numId = Number(id);
    setForm(f => ({
      ...f,
      courseIds: f.courseIds.includes(numId) ? f.courseIds.filter(c => c !== numId) : [...f.courseIds, numId]
    }));
  };

  const handleSave = async () => {
    if (!form.studentName.trim()) { toast('Student name is required', 'error'); return; }
    if (editId) {
      await studentService.update(editId, { studentName: form.studentName, email: form.email, grade: form.grade }, form.courseIds);
      toast('Student updated successfully');
    } else {
      await studentService.add({ studentName: form.studentName, email: form.email, grade: form.grade }, form.courseIds);
      toast('Student added successfully');
    }
    await load();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    await studentService.delete(id);
    toast('Student removed', 'info');
    await load();
    setShowDeleteModal(null);
  };

  const gradeBadge = (g) => {
    if (g === 'A+' || g === 'A') return 'badge-green';
    if (g === 'B+' || g === 'B') return 'badge-blue';
    if (g === 'A-' || g === 'B-') return 'badge-amber';
    return 'badge-violet';
  };

  return (
    <Layout title="Students" subtitle="Manage student enrollments and profiles">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', width: 280 }}>
          <Search size={14} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} students</div>
          <button className="btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Plus size={15} />Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Enrolled Courses</th>
              <th>Grade</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `hsl(${s.id * 47}, 55%, 45%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      {s.studentName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.studentName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID #{s.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.email || '—'}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(s.courses || []).slice(0, 2).map(c => (
                      <span key={c.id} className="badge badge-blue" style={{ fontSize: 10 }}>{c.courseName.split(' ').slice(0, 2).join(' ')}</span>
                    ))}
                    {(s.courses || []).length > 2 && (
                      <span className="badge badge-violet" style={{ fontSize: 10 }}>+{s.courses.length - 2}</span>
                    )}
                    {(s.courses || []).length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>None</span>}
                  </div>
                </td>
                <td>
                  <span className={`badge ${gradeBadge(s.grade)}`}>{s.grade || 'N/A'}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.joinDate || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(s)} style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => setShowDeleteModal(s)} style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', cursor: 'pointer', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontFamily: 'Syne', fontWeight: 600, color: 'var(--text-secondary)' }}>No students found</div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Student' : 'Add New Student'} maxWidth={560}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Full Name *</label>
            <input className="input-field" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} placeholder="e.g. John Doe" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="student@edu.com" />
            </div>
            <div>
              <label className="label">Grade</label>
              <select className="input-field" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Enrolled Courses ({form.courseIds.length} selected)</label>
            <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0' }}>
              {allCourses.map(c => {
                const selected = form.courseIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCourse(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: selected ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)',
                      border: `1px solid ${selected ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: selected ? '#3b82f6' : 'var(--border)', border: `1px solid ${selected ? '#3b82f6' : 'var(--border-bright)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected && <div style={{ width: 8, height: 8, borderRadius: 2, background: 'white' }} />}
                    </div>
                    <BookOpen size={14} color={selected ? '#3b82f6' : 'var(--text-muted)'} />
                    <span style={{ fontSize: 13, color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{c.courseName}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{c.level}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'Update Student' : 'Add Student'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Remove Student">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{showDeleteModal?.studentName}</strong> from the system? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => setShowDeleteModal(null)}>Cancel</button>
          <button className="btn-danger" style={{ padding: '10px 20px' }} onClick={() => handleDelete(showDeleteModal?.id)}>Remove Student</button>
        </div>
      </Modal>
    </Layout>
  );
}
