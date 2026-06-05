import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, AlertCircle, BookOpen, Users, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Feature = ({ icon: Icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={15} color="#3b82f6" />
    </div>
    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{text}</span>
  </div>
);

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = isRegister
      ? await register({
          name: registerForm.name,
          username: registerForm.username,
          password: registerForm.password,
        })
      : await login(loginForm.username, loginForm.password);

    if (result.success) {
      navigate(result.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
    } else {
      setError(result.error || 'Request failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Left hero */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0d1b35 0%, #0a0d14 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)', top: -100, left: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', bottom: 100, right: 50 }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
            }}>
              <GraduationCap size={24} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: 'white', letterSpacing: '-0.5px' }}>EduNexus</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 500 }}>Learning Management</div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 800, color: 'white', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-1px' }}>
            The future of<br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              education
            </span>{' '}is here.
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 40, maxWidth: 360 }}>
            A powerful platform for institutions, instructors, and students to manage learning journeys from enrollment to certification.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Feature icon={BookOpen} text="Manage unlimited courses and modules" />
            <Feature icon={Users} text="Track student progress and enrollments" />
            <Feature icon={Award} text="Issue and manage digital certificates" />
          </div>

          <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
            {[['500+', 'Courses'], ['12K+', 'Students'], ['98%', 'Completion']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: 'white' }}>{num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div style={{
        width: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              {isRegister ? 'Create account' : 'Welcome back'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
              {isRegister ? 'Register a new learner account' : 'Sign in to your account to continue'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
                setShowPwd(false);
              }}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)',
                background: isRegister ? 'var(--bg-card)' : 'rgba(59,130,246,0.12)',
                color: isRegister ? 'var(--text-secondary)' : 'var(--accent-blue)', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'Syne'
              }}
            >Login</button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
                setShowPwd(false);
              }}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)',
                background: isRegister ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)',
                color: isRegister ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'Syne'
              }}
            >Register</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {isRegister ? 'create account' : 'sign in manually'}
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isRegister && (
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerForm.name}
                  onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="label">Username</label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter your username"
                value={isRegister ? registerForm.username : loginForm.username}
                onChange={e => {
                  const value = e.target.value;
                  if (isRegister) {
                    setRegisterForm({ ...registerForm, username: value });
                  } else {
                    setLoginForm({ ...loginForm, username: value });
                  }
                }}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={isRegister ? registerForm.password : loginForm.password}
                  onChange={e => {
                    const value = e.target.value;
                    if (isRegister) {
                      setRegisterForm({ ...registerForm, password: value });
                    } else {
                      setLoginForm({ ...loginForm, password: value });
                    }
                  }}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.25)',
                borderRadius: 8,
                padding: '10px 14px',
                color: 'var(--accent-rose)',
                fontSize: 13,
              }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}
            >
              {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
