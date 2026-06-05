import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Bell, Award,
  FileText, HelpCircle, BookMarked, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { group: 'Overview', items: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  ]},
  { group: 'Management', items: [
    { label: 'Courses', icon: BookOpen, path: '/admin/courses' },
    { label: 'Students', icon: Users, path: '/admin/students' },
    { label: 'Enrollments', icon: Layers, path: '/admin/enrollments' },
  ]},
  { group: 'Content', items: [
    { label: 'Certificates', icon: Award, path: '/admin/certificates' },
    { label: 'Reports', icon: FileText, path: '/admin/reports' },
  ]},
];

const userNav = [
  { group: 'Main', items: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard' },
    { label: 'My Courses', icon: BookMarked, path: '/user/courses' },
    { label: 'Browse All', icon: BookOpen, path: '/user/browse' },
  ]},
  { group: 'Progress', items: [
    { label: 'Grades', icon: GraduationCap, path: '/user/grades' },
    { label: 'Certificates', icon: Award, path: '/user/certificates' },
  ]},
  { group: 'Support', items: [
    { label: 'Help Center', icon: HelpCircle, path: '/user/help' },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const nav = user?.role === 'ADMIN' ? adminNav : userNav;
  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        width: collapsed ? 72 : 248,
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 72,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
        }}>
          <GraduationCap size={18} color="white" />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>EduNexus</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {user?.role === 'ADMIN' ? 'Admin Portal' : 'Student Portal'}
            </div>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: -14,
          top: 86,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s',
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {nav.map(({ group, items }) => (
          <div key={group}>
            {!collapsed && (
              <div style={{ fontSize: 10, fontFamily: 'Syne', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 4 }}>
                {group}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map(({ label, icon: Icon, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`sidebar-link ${isActive(path) ? 'active' : ''}`}
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '11px' : '11px 16px',
                  }}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User profile */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        {!collapsed && (
          <div style={{
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.12)',
            borderRadius: 12,
            padding: '12px',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0) || user?.username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || user?.username}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="sidebar-link"
          style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: 'var(--accent-rose)',
            width: '100%',
          }}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
