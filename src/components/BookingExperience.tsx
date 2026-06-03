import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'wouter';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
const professionals = ['Ana · Especialista', 'Marco · Profesional', 'Sofia · Consultora'];
const dates = ['Hoy', 'Mañana', 'Viernes', 'Sábado'];
const times = ['10:00 AM', '12:30 PM', '2:30 PM', '4:00 PM', '6:00 PM'];

export function BookingExperience() {
  const { id } = useParams();
  const { services, createAppointment } = useAtlasStore();
  const selected = services.find((service) => service.id === id) || services[0];
  const [professional, setProfessional] = useState(professionals[0]);
  const [date, setDate] = useState(dates[1]);
  const [time, setTime] = useState(times[3]);
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const canConfirm = clientName.trim().length > 2 && phone.trim().length > 6;

  function confirmBooking() {
    if (!canConfirm) return;
    createAppointment({
      tenantSlug: selected.tenantSlug,
      client: clientName,
      clientPhone: phone,
      service: selected.name,
      time,
      date,
      notes: `${notes} · Profesional: ${professional}`,
    });
    setConfirmed(true);
    toast.success('Solicitud enviada al panel del negocio');
  }

  if (confirmed) {
    return (
      <section className="booking-shell" style={{ gridTemplateColumns: '1fr', maxWidth: 540 }}>
        <article className="card" style={{ textAlign: 'center', padding: 44 }}>
          <CheckCircle2 size={52} style={{ color: 'var(--emerald)', margin: '0 auto 18px' }} />
          <h1 style={{ fontSize: 34, marginBottom: 8 }}>Solicitud enviada</h1>
          <p style={{ marginBottom: 24 }}>El negocio ya puede verla desde su panel admin.</p>
          <div style={{ textAlign: 'left' }}>
            <Summary label="Cliente" value={clientName} />
            <Summary label="Servicio" value={selected.name} />
            <Summary label="Horario" value={`${date} · ${time}`} />
            <Summary label="Profesional" value={professional} />
          </div>
          <Link href={`/${selected.tenantSlug}`} className="btn btn-secondary btn-full" style={{ marginTop: 24 }}>Volver al negocio</Link>
        </article>
      </section>
    );
  }

  return (
    <section className="booking-shell">
      <div>
        <span className="eyebrow">Reserva pública</span>
        <h1 style={{ fontSize: 42, marginTop: 8 }}>{selected.name}</h1>
        <p style={{ maxWidth: 620, marginTop: 10 }}>Elegí profesional, fecha y hora. La solicitud entra al workspace del negocio como pendiente de confirmación.</p>
        <div className="booking-steps">
          <span className="booking-step done"><CheckCircle2 size={12} />Servicio</span>
          <span className="booking-step active"><Clock size={12} />Horario</span>
          <span className="booking-step">Datos</span>
          <span className="booking-step">Confirmar</span>
        </div>
        <div className="card" style={{ marginTop: 18 }}>
          <BookingBlock title="Profesional"><ChoiceGrid items={professionals} value={professional} onChange={setProfessional} /></BookingBlock>
          <BookingBlock title="Fecha"><ChoiceGrid items={dates} value={date} onChange={setDate} /></BookingBlock>
          <BookingBlock title="Hora"><ChoiceGrid items={times} value={time} onChange={setTime} /></BookingBlock>
          <BookingBlock title="Datos del cliente">
            <div className="form-row">
              <label className="field"><label>Nombre</label><input className="input" value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Ej. Maria Lopez" /></label>
              <label className="field"><label>Teléfono</label><input className="input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="8888 8888" /></label>
            </div>
            <label className="field" style={{ marginTop: 12 }}><label>Notas</label><textarea className="input" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Detalles importantes para preparar la cita." /></label>
          </BookingBlock>
        </div>
      </div>
      <aside className="booking-summary">
        <article className="card">
          <span className="badge badge-amber">{selected.category}</span>
          <h3 style={{ fontSize: 22, marginTop: 14 }}>{selected.name}</h3>
          <p>{selected.duration} minutos</p>
          <Summary label="Precio desde" value={money(selected.price)} />
          <Summary label="Depósito" value={money(selected.deposit)} />
          <Summary label="Horario" value={`${date} · ${time}`} />
          <Summary label="Profesional" value={professional.split(' · ')[0]} />
          <button disabled={!canConfirm} onClick={confirmBooking} className="btn btn-primary btn-full" style={{ marginTop: 18 }}>Confirmar solicitud</button>
          {!canConfirm && <small style={{ display: 'block', color: 'var(--text-3)', textAlign: 'center', marginTop: 10 }}>Completa nombre y teléfono.</small>}
        </article>
        <article className="card" style={{ marginTop: 14 }}>
          <ShieldCheck size={20} />
          <h3 style={{ fontSize: 16 }}>Confirmación segura</h3>
          <p>El negocio revisa la solicitud y confirma el depósito.</p>
        </article>
      </aside>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div>;
}

function BookingBlock({ title, children }: { title: string; children: ReactNode }) {
  return <section style={{ marginBottom: 22 }}><h3 style={{ fontSize: 16, marginBottom: 12 }}>{title}</h3>{children}</section>;
}

function ChoiceGrid({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="choice-grid">{items.map((item) => <button key={item} type="button" onClick={() => onChange(item)} className={`choice-btn ${value === item ? 'selected' : ''}`}>{item}</button>)}</div>;
}
