import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'wouter';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
const professionals = ['Ana · Tattoo artist', 'Marco · Piercer', 'Sofia · Beauty specialist'];
const dates = ['Hoy', 'Mañana', 'Viernes', 'Sábado'];
const times = ['10:00 AM', '12:30 PM', '2:30 PM', '4:00 PM', '6:00 PM'];

export function BookingExperience() {
  const { id } = useParams();
  const { services, createAppointment } = useAtlasStore();
  const selected = services.find(service => service.id === id) || services[0];
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
    toast.success('Cita enviada al admin del tenant');
  }

  return (
    <section className="booking-layout">
      <div className="booking-main">
        <span className="eyebrow">Booking flow</span>
        <h1>Solicitud de cita</h1>
        <p>El cliente elige servicio, profesional, fecha, hora y deja sus datos. El negocio recibe la solicitud con estado pendiente de depósito.</p>
        <div className="booking-steps">
          <span className="flow-step done"><CheckCircle2 size={14} />Servicio</span>
          <span className="flow-step active">Horario</span>
          <span className="flow-step">Datos</span>
          <span className={`flow-step ${confirmed ? 'done' : ''}`}>Confirmar</span>
        </div>

        {!confirmed ? (
          <div className="booking-form card">
            <BookingBlock title="Profesional"><ChoiceGrid items={professionals} value={professional} onChange={setProfessional} /></BookingBlock>
            <BookingBlock title="Fecha"><ChoiceGrid items={dates} value={date} onChange={setDate} /></BookingBlock>
            <BookingBlock title="Hora"><ChoiceGrid items={times} value={time} onChange={setTime} /></BookingBlock>
            <BookingBlock title="Datos del cliente">
              <div className="form-grid">
                <label className="field"><span>Nombre</span><input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Ej. Maria Lopez" /></label>
                <label className="field"><span>WhatsApp</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Ej. 8888 8888" /></label>
              </div>
              <label className="field"><span>Notas</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Idea, zona, referencia o detalles importantes." /></label>
            </BookingBlock>
          </div>
        ) : (
          <div className="confirmation-card card">
            <CheckCircle2 size={42} />
            <h2>Cita solicitada</h2>
            <p>La solicitud ya fue agregada al panel admin de este tenant.</p>
            <div className="summary-line"><span>Cliente</span><strong>{clientName}</strong></div>
            <div className="summary-line"><span>Horario</span><strong>{date} · {time}</strong></div>
            <div className="summary-line"><span>Profesional</span><strong>{professional}</strong></div>
          </div>
        )}
      </div>

      <aside className="booking-summary card">
        <span className="pill">Resumen</span>
        <h3>{selected.name}</h3>
        <p>{selected.duration} minutos · {selected.category}</p>
        <div className="summary-line"><span>Precio desde</span><strong>{money(selected.price)}</strong></div>
        <div className="summary-line"><span>Depósito</span><strong>{money(selected.deposit)}</strong></div>
        <div className="summary-line"><span>Horario</span><strong>{date} · {time}</strong></div>
        <div className="summary-line"><span>Profesional</span><strong>{professional.split(' · ')[0]}</strong></div>
        <button disabled={!canConfirm || confirmed} onClick={confirmBooking} className="btn primary full">Confirmar solicitud</button>
        {!canConfirm && <small className="form-hint">Completa nombre y WhatsApp para confirmar.</small>}
        <Link href={`/${selected.tenantSlug}`} className="center-link">Volver al catálogo</Link>
      </aside>
    </section>
  );
}

function BookingBlock({ title, children }: { title: string; children: ReactNode }) {
  return <section className="form-section"><h3>{title}</h3>{children}</section>;
}

function ChoiceGrid({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="choice-grid">{items.map(item => <button key={item} onClick={() => onChange(item)} className={`choice-button ${value === item ? 'selected' : ''}`}>{item}</button>)}</div>;
}
