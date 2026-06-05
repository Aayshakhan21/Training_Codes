import { useEffect, useState } from 'react';
import { GraduationCap, TrendingUp, Award, BookOpen } from 'lucide-react';
import Layout from '../../components/Layout';
import { learningService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

const gradeColor = (g) => {
  if (g.startsWith('A')) return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)' };
  if (g.startsWith('B')) return { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' };
  return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)' };
};

export default function UserGrades() {
  const { user } = useAuth();
  const [gradeData, setGradeData] = useState([]);
  const [avg, setAvg] = useState('0.0');
  const [gpa, setGpa] = useState('0.00');

  useEffect(() => {
    const load = async () => {
      const data = await learningService.getUserGrades(user?.username);
      setGradeData(data.grades || []);
      setAvg(Number(data.avgScore || 0).toFixed(1));
      setGpa(Number(data.gpa || 0).toFixed(2));
    };
    load();
  }, [user?.username]);

  return (
    <Layout title="My Grades" subtitle="Academic performance overview">
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'GPA', value: gpa, icon: Award, color: '#f59e0b', sub: 'Cumulative' },
          { label: 'Avg Score', value: `${avg}%`, icon: TrendingUp, color: '#10b981', sub: 'This semester' },
          { label: 'Courses', value: gradeData.length, icon: BookOpen, color: '#3b82f6', sub: 'Graded' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Syne', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
              </div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={21} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grade cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {gradeData.map(({ course, grade, score, assignments, completed }) => {
          const { color, bg, border } = gradeColor(grade);
          return (
            <div key={course} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={20} color={color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>{course}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{completed}/{assignments} assignments completed</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color }}>{grade}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{score}%</div>
                </div>
              </div>

              {/* Score bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div style={{ height: '100%', borderRadius: 3, width: `${score}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 36 }}>{score}/100</span>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
