import { type ReactNode } from 'react';
import { CalendarDays, Home, Receipt, Sparkles } from 'lucide-react';

interface ClientLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  clientName?: string;
}

const NAV_ITEMS = [
  { id: 'resumen', label: 'Resumen', icon: <Home size={20} /> },
  { id: 'citas', label: 'Citas', icon: <CalendarDays size={20} /> },
  { id: 'pagos', label: 'Pagos', icon: <Receipt size={20} /> },
  { id: 'promos', label: 'Promos', icon: <Sparkles size={20} /> },
];

export function ClientLayout({ children, activeSection, onSectionChange, clientName }: ClientLayoutProps) {
  const initials = clientName ? clientName.split(' ').map((name) => name[0]).join('').slice(0, 2) : 'ML';

  return (
    <div className="client-shell">
      <header className="client-topbar">
        <span className="client-brand">Mi Atlas</span>
        <div className="client-user">
          <span className="badge badge-green"><span className="dot dot-green" /> Online</span>
          <div className="avatar">{initials}</div>
        </div>
      </header>
      <main className="client-main">{children}</main>
      <nav className="client-bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => onSectionChange(item.id)}>
            {item.icon}<span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
