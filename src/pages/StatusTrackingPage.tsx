import { Link, useParams } from 'wouter';
import { CalendarDays, CheckCircle2, Clock, Dumbbell, MessageCircle, Receipt, ShieldCheck, Sparkles, Wallet, XCircle } from 'lucide-react';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

type Step = { key: string; label: string; text: string; icon: JSX.Element };

const appointmentSteps: Step[] = [
  { key: 'pending_deposit', label: 'Solicitud recibida', text: 'El negocio recibió tu solicitud y revisará disponibilidad.', icon: <Clock /> },
  { key: 'confirmed', label: 'Cita confirmada', text: 'Tu espacio fue confirmado por el negocio.', icon: <CalendarDays /> },
  { key: 'en_proceso', label: 'En proceso', text: 'El servicio está en curso o por iniciar.', icon: <Sparkles /> },
  { key: 'completed', label: 'Completada', text: 'La cita quedó completada y pasa al historial.', icon: <CheckCircle2 /> },
];

const membershipSteps: Step[] = [
  { key: 'requested', label: 'Solicitud enviada', text: 'La academia recibió tu solicitud de registro.', icon: <Clock /> },
  { key: 'receipt_uploaded', label: 'Comprobante en revisión', text: 'El equipo revisa tu comprobante SINPE.', icon: <Receipt /> },
  { key: 'paid', label: 'Membresía activa', text: 'Tu pago fue validado y tu plan está activo.', icon: <Dumbbell /> },
];

function statusIndex(status: string, steps: Step[]) {
  const exact = steps.findIndex((step) => step.key === status);
  if (exact >= 0) return exact;
  if (status === 'confirmed') return 1;
  if (status === 'paid') return steps.length - 1;
  if (status === 'rejected' || status === 'cancelled' || status === 'late') return 0;
  return 0;
}

function StatusPill({ status }: { status: string }) {
  const danger = ['cancelled', 'rejected', 'late'].includes(status);
  const success = ['confirmed', 'completed', 'paid'].includes(status);
  return <span className={`status-track-pill ${danger ? 'danger' : success ? 'success' : 'warning'}`}>{status}</span>;
}

function Timeline({ steps, status }: { steps: Step[]; status: string }) {
  const current = statusIndex(status, steps);
  const isDanger = ['cancelled', 'rejected', 'late'].includes(status);
  return (
    <div className="status-timeline">
      {isDanger ? (
        <div className="status-alert danger"><XCircle /><div><strong>Requiere atención</strong><span>El estado actual necesita revisión del negocio o del cliente.</span></div></div>
      ) : null}
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <article key={step.key} className={`status-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="status-step-icon">{done ? <CheckCircle2 /> : step.icon}</div>
            <div>
              <strong>{step.label}</strong>
              <span>{step.text}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function StatusTrackingPage() {
  const { id } = useParams();
  const store = useAtlasStore();
  const appointment = store.appointments.find((item) => item.id === id);
  const membership = store.memberships.find((item) => item.id === id);
  const record = appointment || membership;

  if (!record) {
    return (
      <main className="status-page-shell">
        <section className="status-card card">
          <span className="eyebrow">Seguimiento</span>
          <h1>No encontramos este registro</h1>
          <p>Revisá el enlace o volvé a la página principal del negocio.</p>
          <Link className="btn btn-secondary" href="/">Volver a Digital Atlas</Link>
        </section>
      </main>
    );
  }

  const isAppointment = Boolean(appointment);
  const tenant = store.getTenant(record.tenantSlug);
  const status = String(record.status || 'pending_deposit');
  const title = isAppointment ? appointment!.service : membership!.plan;
  const client = isAppointment ? appointment!.client : membership!.client;

  return (
    <main className="status-page-shell">
      <section className="status-card card">
        <div className="status-header-row">
          <div>
            <span className="eyebrow">{isAppointment ? 'Seguimiento de cita' : 'Seguimiento de membresía'}</span>
            <h1>{title}</h1>
            <p>{tenant.name} · {client}</p>
          </div>
          <StatusPill status={status} />
        </div>
        <Timeline steps={isAppointment ? appointmentSteps : membershipSteps} status={status} />
        <div className="status-detail-grid">
          {isAppointment ? (
            <>
              <Detail icon={<CalendarDays />} label="Horario" value={`${appointment!.date || 'Fecha pendiente'} · ${appointment!.time}`} />
              <Detail icon={<Wallet />} label="Depósito" value={appointment!.depositStatus || 'pending'} />
              <Detail icon={<MessageCircle />} label="Notas" value={appointment!.notes || 'Sin notas'} />
            </>
          ) : (
            <>
              <Detail icon={<Dumbbell />} label="Plan" value={membership!.plan} />
              <Detail icon={<Wallet />} label="Monto" value={money(membership!.amount)} />
              <Detail icon={<Receipt />} label="Pago" value={membership!.due} />
            </>
          )}
        </div>
        <div className="status-actions">
          <Link className="btn btn-primary" href={`/app/${tenant.slug}/login`}>Abrir mi cuenta</Link>
          <Link className="btn btn-secondary" href={`/${tenant.slug}`}>Volver al negocio</Link>
        </div>
        <div className="status-note"><ShieldCheck /><span>Esta vista replica la lógica útil de tracking de SmartMenu: estado separado, timeline claro y acciones específicas sin mezclar admin con cliente.</span></div>
      </section>
    </main>
  );
}

function Detail({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
  return <article className="status-detail"><div>{icon}</div><span>{label}</span><strong>{value}</strong></article>;
}
