import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = { success: 'var(--accent-emerald)', error: 'var(--accent-rose)', info: 'var(--accent-blue)' };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999 }}>
        {toasts.map(({ id, message, type }) => {
          const Icon = icons[type] || Info;
          return (
            <div key={id} style={{
              background: 'var(--bg-card)',
              border: `1px solid var(--border-bright)`,
              borderLeft: `3px solid ${colors[type]}`,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 280,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              animation: 'slideUp 0.25s ease',
            }}>
              <Icon size={16} color={colors[type]} />
              <span style={{ fontSize: 13, flex: 1, color: 'var(--text-primary)' }}>{message}</span>
              <button onClick={() => remove(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
