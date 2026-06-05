import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children, title, subtitle }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar title={title} subtitle={subtitle} />
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }} className="page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
