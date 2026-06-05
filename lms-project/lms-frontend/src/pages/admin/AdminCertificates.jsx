import { useState, useEffect } from 'react';
import { Award, Download, Search, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { studentService } from '../../services/dataService';

export default function AdminCertificates() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setStudents(await studentService.getAll());
    };
    load();
  }, []);

  const eligible = students.filter(s =>
    (s.courses?.length || 0) >= 1 &&
    ['A+', 'A', 'A-', 'B+', 'B'].includes(s.grade)
  );

  const filtered = eligible.filter(s => s.studentName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout title="Certificates" subtitle="Issue and manage digital certificates">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', width: 260 }}>
          <Search size={14} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }} />
        </div>
        <span className="badge badge-green" style={{ fontSize: 12, padding: '6px 12px' }}>{filtered.length} eligible</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(s => (
          <div key={s.id} className="card" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
            {/* Decorative corner */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `hsl(${s.id * 47}, 55%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white' }}>
                {s.studentName.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>{s.studentName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Grade: <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{s.grade}</span></div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: 'Syne', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>Completed Courses</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {(s.courses || []).map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13 }}>
                    <CheckCircle size={13} color="var(--accent-emerald)" />
                    <span style={{ color: 'var(--text-secondary)' }}>{c.courseName}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={() => alert(`Certificate generated for ${s.studentName}!`)}
            >
              <Award size={15} />
              Issue Certificate
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Award size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>No eligible students found</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Students need a grade of B or higher</div>
          </div>
        )}
      </div>
    </Layout>
  );
}
