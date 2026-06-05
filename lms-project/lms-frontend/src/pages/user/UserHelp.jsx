import { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react';
import Layout from '../../components/Layout';
import { learningService } from '../../services/dataService';

const iconMap = { Mail, MessageCircle, Phone };

export default function UserHelp() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await learningService.getHelp();
      setFaqs(data.faqs || []);
      setContacts(data.contacts || []);
    };
    load();
  }, []);

  return (
    <Layout title="Help Center" subtitle="Find answers and get support">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: '0 0 16px' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <HelpCircle size={16} color="var(--accent-blue)" />
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14 }}>{faq.q}</span>
                  </div>
                  {openFaq === i ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px 48px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, margin: 0 }}>Contact Support</h3>
          {contacts.map(({ icon, label, sub, color, action }) => {
            const Icon = iconMap[icon] || Mail;
            return (
              <div key={label} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13 }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
                  </div>
                </div>
                <button className="btn-secondary" style={{ width: '100%', fontSize: 12, padding: '8px' }}>{action}</button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
