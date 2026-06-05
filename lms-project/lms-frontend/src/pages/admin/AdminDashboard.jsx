import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, TrendingUp, Award, ArrowUpRight,
  Plus, Eye, GraduationCap, Clock, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Layout from '../../components/Layout';
import { getStats, courseService, studentService, learningService } from '../../services/dataService';

const categoryColors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

const StatCard = ({ icon: Icon, label, value, change, color, bg }) => (
  <div className="stat-card card" style={{ background: bg }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 12, fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>{label}</div>
        <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        {change && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <ArrowUpRight size={14} color="var(--accent-emerald)" />
            <span style={{ fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 600 }}>{change}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>this month</span>
          </div>
        )}
      </div>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: `${color}20`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={22} color={color} />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', gap: 8 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [statsData, courseData, studentData] = await Promise.all([
        getStats(),
        courseService.getAll(),
        studentService.getAll(),
      ]);
      const analytics = await learningService.getAnalytics();
      setStats(statsData);
      setCourses(courseData.slice(0, 5));
      setStudents(studentData.slice(0, 6));
      setEnrollmentData((analytics.monthlyActivity || []).map((m) => ({
        month: m.month,
        students: m.enrollments,
        courses: Math.max(1, Math.round(m.enrollments / 4)),
      })));
    };
    load();
  }, []);

  const categoryData = courses.reduce((acc, c) => {
    const cat = c.category || 'Other';
    const found = acc.find(a => a.name === cat);
    if (found) found.value++;
    else acc.push({ name: cat, value: 1 });
    return acc;
  }, []);

  return (
    <Layout title="Dashboard" subtitle={`Welcome back, Administrator | ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={BookOpen} label="Total Courses" value={stats.totalCourses || 0} change="+2" color="#3b82f6" bg="var(--bg-card)" />
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents || 0} change="+8" color="#10b981" bg="var(--bg-card)" />
        <StatCard icon={TrendingUp} label="Enrollments" value={stats.totalEnrollments || 0} change="+15" color="#f59e0b" bg="var(--bg-card)" />
        <StatCard icon={Award} label="Avg Courses/Student" value={stats.avgCoursesPerStudent || 0} color="#8b5cf6" bg="var(--bg-card)" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 24 }}>
        {/* Enrollment chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>Enrollment Trends</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Student & course growth over 6 months</p>
            </div>
            <span className="badge badge-green">+18% growth</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="courseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="students" name="Students" stroke="#3b82f6" fill="url(#studentGrad)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              <Area type="monotone" dataKey="courses" name="Courses" stroke="#06b6d4" fill="url(#courseGrad)" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>Course Categories</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 16px' }}>Distribution by subject</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData.length ? categoryData : [{ name: 'No Data', value: 1 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                {categoryData.map((_, idx) => (
                  <Cell key={idx} fill={categoryColors[idx % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categoryData.map((cat, idx) => (
              <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: categoryColors[idx % categoryColors.length] }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Courses */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: 0 }}>Courses</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate('/admin/courses')}>
                <Eye size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />View All
              </button>
              <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate('/admin/courses')}>
                <Plus size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />Add
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {courses.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={16} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.courseName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.instructor || 'Unassigned'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)' }}>{c.enrolled || 0}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>students</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: 0 }}>Students</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate('/admin/students')}>
                <Eye size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />View All
              </button>
              <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate('/admin/students')}>
                <Plus size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />Add
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {students.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `hsl(${s.id * 47}, 60%, 45%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'white',
                  }}>
                    {s.studentName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.studentName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.courses?.length || 0} courses</div>
                  </div>
                </div>
                <span className={`badge ${s.grade === 'A+' || s.grade === 'A' ? 'badge-green' : s.grade === 'B+' || s.grade === 'B' ? 'badge-blue' : 'badge-amber'}`}>
                  {s.grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Add New Course', icon: BookOpen, color: '#3b82f6', path: '/admin/courses' },
          { label: 'Add Student', icon: Users, color: '#10b981', path: '/admin/students' },
          { label: 'View Analytics', icon: TrendingUp, color: '#f59e0b', path: '/admin/analytics' },
          { label: 'Manage Enrollments', icon: GraduationCap, color: '#8b5cf6', path: '/admin/enrollments' },
        ].map(({ label, icon: Icon, color, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.background = `${color}08`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color={color} />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{label}</span>
          </button>
        ))}
      </div>
    </Layout>
  );
}
