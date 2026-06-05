import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';
import { TrendingUp, Users, BookOpen, Award, Activity } from 'lucide-react';
import Layout from '../../components/Layout';
import { courseService, getStats, learningService } from '../../services/dataService';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)', fontFamily: 'Syne' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [courseData, statsData] = await Promise.all([
        courseService.getAll(),
        getStats(),
      ]);
      const analytics = await learningService.getAnalytics();
      setCourses(courseData);
      setStats(statsData);
      setMonthlyData(analytics.monthlyActivity || []);
      setRadarData(analytics.radar || []);
    };
    load();
  }, []);

  const courseEnrollmentData = courses.map(c => ({ name: c.courseName.split(' ').slice(0, 3).join(' '), enrolled: c.enrolled || 0, capacity: 60 }));
  const categoryData = courses.reduce((acc, c) => {
    const cat = c.category || 'Other';
    const found = acc.find(a => a.name === cat);
    if (found) found.value++;
    else acc.push({ name: cat, value: 1 });
    return acc;
  }, []);

  const kpis = [
    { label: 'Total Enrollments', value: stats.totalEnrollments || 0, icon: TrendingUp, color: '#3b82f6', change: '+18%' },
    { label: 'Active Students', value: stats.totalStudents || 0, icon: Users, color: '#10b981', change: '+12%' },
    { label: 'Course Catalog', value: stats.totalCourses || 0, icon: BookOpen, color: '#f59e0b', change: '+4' },
    { label: 'Completion Rate', value: '72%', icon: Award, color: '#8b5cf6', change: '+5%' },
  ];

  return (
    <Layout title="Analytics" subtitle="Insights on platform performance and learning outcomes">
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {kpis.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: 11, color: color, fontWeight: 600, marginTop: 6 }}>{change} vs last month</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>Monthly Activity</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 20px' }}>Enrollments, completions & dropouts</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="enrollments" name="Enrollments" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="completions" name="Completions" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="dropouts" name="Dropouts" fill="#f43f5e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>Category Breakdown</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px' }}>Courses per subject area</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData.length ? categoryData : [{ name: 'No data', value: 1 }]} cx="50%" cy="50%" outerRadius={70} paddingAngle={4} dataKey="value">
                {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course enrollment bars + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>Course Enrollment</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 20px' }}>Current vs capacity per course</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courseEnrollmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="enrolled" name="Enrolled" fill="#3b82f6" radius={[0,4,4,0]} />
              <Bar dataKey="capacity" name="Capacity" fill="rgba(59,130,246,0.15)" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>Subject Engagement</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px' }}>Engagement score by category</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar name="Engagement" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
