import { useState, useEffect } from 'react';
import { FileText, Download, Users, BookOpen, TrendingUp, Filter } from 'lucide-react';
import Layout from '../../components/Layout';
import { courseService, studentService, getStats } from '../../services/dataService';

export default function AdminReports() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      const [courseData, studentData, statsData] = await Promise.all([
        courseService.getAll(),
        studentService.getAll(),
        getStats(),
      ]);
      setCourses(courseData);
      setStudents(studentData);
      setStats(statsData);
    };
    load();
  }, []);

  const reports = [
    { title: 'Enrollment Summary', desc: 'Overview of all student enrollments by course', icon: Users, color: '#3b82f6', rows: students.length },
    { title: 'Course Catalog', desc: 'Complete list of courses with details', icon: BookOpen, color: '#10b981', rows: courses.length },
    { title: 'Grade Distribution', desc: 'Grade breakdown across all students', icon: TrendingUp, color: '#f59e0b', rows: students.length },
    { title: 'Monthly Activity', desc: 'Enrollments and completions by month', icon: FileText, color: '#8b5cf6', rows: 6 },
  ];

  const gradeDistrib = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'N/A'].map(g => ({
    grade: g,
    count: students.filter(s => s.grade === g).length,
  })).filter(x => x.count > 0);

  return (
    <Layout title="Reports" subtitle="Generate and download platform reports">
      {/* Report cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
        {reports.map(({ title, desc, icon: Icon, color, rows }) => (
          <div key={title} className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{desc}</div>
                <div style={{ fontSize: 11, color: color, marginTop: 4, fontWeight: 600 }}>{rows} records</div>
              </div>
            </div>
            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
              onClick={() => alert(`Downloading ${title} report...`)}
            >
              <Download size={13} />Export
            </button>
          </div>
        ))}
      </div>

      {/* Inline data tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Enrolled Courses */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 16px' }}>Top Enrolled Courses</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Level</th>
                  <th>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {[...courses].sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0)).slice(0, 6).map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{c.courseName}</td>
                    <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{c.level}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{c.enrolled || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 16px' }}>Grade Distribution</h3>
          {gradeDistrib.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gradeDistrib.map(({ grade, count }) => (
                <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{grade}</div>
                  <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: 4, width: `${(count / students.length) * 100}%`, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', width: 24, textAlign: 'right' }}>{count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: 13 }}>No grade data available</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
