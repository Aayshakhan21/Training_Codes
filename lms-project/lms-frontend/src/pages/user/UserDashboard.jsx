import { useState, useEffect } from 'react';
import { BookOpen, Award, Clock, TrendingUp, Play, CheckCircle, BookMarked } from 'lucide-react';
import Layout from '../../components/Layout';
import { learningService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const load = async () => {
      const courses = await learningService.getCoursesProgress(user?.username);
      setAllCourses(courses);
      setMyCourses(courses.slice(0, 3));
      const modulesList = await Promise.all(courses.slice(0, 2).map((course) => learningService.getCourseModules(course.id)));
      const upcomingItems = modulesList
        .flatMap((modules, idx) => modules.flatMap((m) => (m.activities || [])
          .filter((a) => a.activity_type === 'ASSIGNMENT' || a.activity_type === 'PROJECT' || a.activity_type === 'QUIZ')
          .map((a) => ({ task: a.activity_title, course: courses[idx]?.courseName || 'Course', days: Number(a.due_in_days || 7) }))))
        .slice(0, 3);
      setUpcoming(upcomingItems);
    };
    load();
  }, [user?.username]);

  const completedCount = myCourses.filter((c) => (c.progress || 0) >= 100).length;
  const inProgressCount = myCourses.filter((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100).length;
  const stats = [
    { label: 'Enrolled', value: myCourses.length, icon: BookMarked, color: '#3b82f6' },
    { label: 'In Progress', value: inProgressCount, icon: Play, color: '#f59e0b' },
    { label: 'Completed', value: completedCount, icon: CheckCircle, color: '#10b981' },
    { label: 'Certificates', value: completedCount, icon: Award, color: '#8b5cf6' },
  ];

  return (
    <Layout title="My Dashboard" subtitle={`Welcome back, ${user?.name || 'Student'}!`}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* My Courses */}
        <div>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: '0 0 14px' }}>My Courses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myCourses.map((c, i) => {
              const progress = c.progress || 0;
              const isCompleted = progress >= 90;
              return (
                <div key={c.id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `hsl(${c.id * 40 + 200}, 60%, 25%)`, border: `1px solid hsl(${c.id * 40 + 200}, 60%, 35%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={22} color={`hsl(${c.id * 40 + 200}, 80%, 60%)`} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: 0, color: 'var(--text-primary)' }}>{c.courseName}</h4>
                      <span className={`badge ${isCompleted ? 'badge-green' : 'badge-amber'}`}>{isCompleted ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                      {c.instructor} | {c.duration} | {c.level}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${progress}%`, background: isCompleted ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{progress}%</span>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ flexShrink: 0, padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Play size={12} />{isCompleted ? 'Review' : 'Continue'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upcoming */}
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: '24px 0 14px' }}>Available Courses</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {allCourses.slice(3, 5).map(c => (
              <div key={c.id} className="card" style={{ padding: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <BookOpen size={17} color="#3b82f6" />
                </div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--text-primary)' }}>{c.courseName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>{c.instructor} | {c.duration}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{c.level}</span>
                  <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: 11 }}>Enroll</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Learning streak */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={15} color="var(--accent-amber)" />Learning Streak
            </h4>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 48, fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>days in a row!</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>{d}</div>
                  <div style={{ width: '100%', aspectRatio: 1, borderRadius: 4, background: i < 7 ? 'rgba(245,158,11,0.3)' : 'var(--border)', border: i < 7 ? '1px solid rgba(245,158,11,0.4)' : 'none' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming deadlines */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} color="var(--accent-rose)" />Upcoming
            </h4>
            {[
              ...(upcoming.length ? upcoming : [{ task: 'No upcoming assessments', course: 'LMS', days: 0 }])
            ].map(({ task, course, days }) => (
              <div key={task} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{task}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{course}</div>
                </div>
                <span className={`badge ${days <= 3 ? 'badge-rose' : days <= 7 ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: 10 }}>
                  {days}d
                </span>
              </div>
            ))}
          </div>

          {/* Certificate */}
          <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <Award size={22} color="#a78bfa" />
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Certificate Ready!</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Data Structures & Algorithms</div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
