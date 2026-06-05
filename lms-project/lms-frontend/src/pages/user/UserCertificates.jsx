import { useEffect, useState } from 'react';
import { Award, Download, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { learningService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export default function UserCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [inProgress, setInProgress] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await learningService.getUserCertificates(user?.username);
      setCertificates(data.certificates || []);
      setInProgress(data.inProgress || []);
    };
    load();
  }, [user?.username]);
  return (
    <Layout title="My Certificates" subtitle="View and download your earned certificates">
      {certificates.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} color="var(--accent-emerald)" /> Earned Certificates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 16 }}>
            {certificates.map(cert => (
              <div key={cert.id} style={{
                background: 'linear-gradient(135deg, #1a1040 0%, #0f172a 100%)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: 20,
                padding: 28,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', top: -60, right: -40 }} />
                <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', bottom: -20, left: 20 }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                  <div>
                    <div style={{ fontSize: 10, fontFamily: 'Syne', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 8 }}>Certificate of Completion</div>
                    <div style={{ fontFamily: 'Syne', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>EduNexus Learning Platform</div>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
                    <Award size={22} color="white" />
                  </div>
                </div>

                {/* Course name */}
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6, lineHeight: 1.2 }}>{cert.course}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Taught by {cert.instructor}</div>

                <div style={{ display: 'flex', gap: 24, marginBottom: 22 }}>
                  {[['Score', `${cert.score}%`], ['Grade', cert.grade], ['Issued', cert.date]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'white', fontSize: 14 }}>{val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginBottom: 20 }}>
                  Credential ID: {cert.credential}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                    onClick={() => alert('Downloading certificate PDF...')}
                  >
                    <Download size={14} />Download PDF
                  </button>
                  <button
                    style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => alert('Share link copied!')}
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In progress towards cert */}
      <div>
        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: '0 0 16px', color: 'var(--text-secondary)' }}>
          In Progress
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {inProgress.map(({ course, progress }) => (
            <div key={course} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} color="#3b82f6" style={{ opacity: 0.5 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{course}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36 }}>{progress}%</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Need {100 - progress}% more</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
