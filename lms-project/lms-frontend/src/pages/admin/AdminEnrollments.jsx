import { useState, useEffect } from 'react';
import { Search, Link, Unlink, Users, BookOpen, ChevronRight } from 'lucide-react';
import Layout from '../../components/Layout';
import { courseService, studentService } from '../../services/dataService';
import { useToast } from '../../components/Toast';

export default function AdminEnrollments() {
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    const [c, s] = await Promise.all([
      courseService.getAll(),
      studentService.getAll(),
    ]);
    setCourses(c);
    setStudents(s);
    if (c.length && !selectedCourse) setSelectedCourse(c[0]);
    else if (selectedCourse) setSelectedCourse(c.find(x => x.id === selectedCourse.id) || c[0]);
  };
  useEffect(() => { load(); }, []);

  const enrolledStudents = selectedCourse
    ? students.filter(s => (s.courseIds || s.courses?.map(c => c.id) || []).includes(selectedCourse.id))
    : [];

  const unenrolledStudents = selectedCourse
    ? students.filter(s => !(s.courseIds || s.courses?.map(c => c.id) || []).includes(selectedCourse.id))
    : [];

  const filteredUnenrolled = unenrolledStudents.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const enroll = async (student) => {
    const currentIds = student.courseIds || student.courses?.map(c => c.id) || [];
    await studentService.update(student.id, { studentName: student.studentName, email: student.email, grade: student.grade }, [...currentIds, selectedCourse.id]);
    toast(`${student.studentName} enrolled in ${selectedCourse.courseName}`);
    await load();
  };

  const unenroll = async (student) => {
    const currentIds = (student.courseIds || student.courses?.map(c => c.id) || []).filter(id => id !== selectedCourse.id);
    await studentService.update(student.id, { studentName: student.studentName, email: student.email, grade: student.grade }, currentIds);
    toast(`${student.studentName} removed from ${selectedCourse.courseName}`, 'info');
    await load();
  };

  return (
    <Layout title="Enrollments" subtitle="Manage student-course assignments">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: 'calc(100vh - 200px)', minHeight: 500 }}>
        {/* Course list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Select Course</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{courses.length} courses available</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {courses.map(c => {
              const count = students.filter(s => (s.courseIds || s.courses?.map(x => x.id) || []).includes(c.id)).length;
              const isSelected = selectedCourse?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(59,130,246,0.25)' : 'transparent'}`,
                    marginBottom: 4,
                    transition: 'all 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#3b82f6' : 'var(--text-primary)', lineHeight: 1.3 }}>{c.courseName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{count} enrolled</div>
                  </div>
                  {isSelected && <ChevronRight size={14} color="#3b82f6" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          {selectedCourse && (
            <>
              {/* Header */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, margin: '0 0 4px' }}>{selectedCourse.courseName}</h3>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {selectedCourse.instructor} | {selectedCourse.level} | {selectedCourse.duration}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: 'var(--accent-blue)' }}>{enrolledStudents.length}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Enrolled</div>
                    </div>
                    <div style={{ width: 1, background: 'var(--border)' }} />
                    <div>
                      <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: 'var(--text-secondary)' }}>{unenrolledStudents.length}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Available</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
                {/* Enrolled */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={15} color="var(--accent-emerald)" />
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--accent-emerald)' }}>Enrolled ({enrolledStudents.length})</span>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {enrolledStudents.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, marginBottom: 4, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${s.id * 47}, 55%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                            {s.studentName.charAt(0)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{s.studentName}</span>
                        </div>
                        <button onClick={() => unenroll(s)} className="btn-danger" style={{ padding: '5px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Unlink size={11} />Remove
                        </button>
                      </div>
                    ))}
                    {enrolledStudents.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 13 }}>No students enrolled yet</div>
                    )}
                  </div>
                </div>

                {/* Available */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <BookOpen size={15} color="var(--accent-blue)" />
                      <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--accent-blue)' }}>Available ({filteredUnenrolled.length})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 10px' }}>
                      <Search size={12} color="var(--text-muted)" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 12, width: '100%' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {filteredUnenrolled.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, marginBottom: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${s.id * 47}, 55%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                            {s.studentName.charAt(0)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{s.studentName}</span>
                        </div>
                        <button onClick={() => enroll(s)} className="btn-primary" style={{ padding: '5px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Link size={11} />Enroll
                        </button>
                      </div>
                    ))}
                    {filteredUnenrolled.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 13 }}>All students enrolled</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
