import { CalendarDays, CheckCircle2, Dumbbell, Home, Image as ImageIcon, KeyRound, Receipt, Sparkles, Upload, UserRound, Wallet, X } from 'lucide-react';
import { toast } from 'sonner';
import { resolveCustomerDashboard, type CustomerWidgetKey } from '../platform/customerExperience';
import { useBusinessMedia } from '../platform/businessMedia';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

type TenantLike = { slug: string; vertical: string; name: string };

type CustomerDashboardRendererProps = {
  tenant: TenantLike;
  activeSection: string;
  onSectionChange: (section: string) => void;
};

function iconFor(key: string) {
  const icons = {
    home: <Home size={20} />,
    calendar: <CalendarDays size={20} />,
    dumbbell: <Dumbbell size={20} />,
    receipt: <Receipt size={20} />,
    sparkles: <Sparkles size={20} />,
    user: <UserRound size={20} />,
  } as Record<string, JSX.Element>;
  return icons[key] || <Home size={20} />;
}

function exitClientZone(slug: string) {
  window.localStorage.removeItem(`atlas-gate:client:${slug}`);
  window.location.href = `/${slug}`;
}

export function CustomerDashboardRenderer({ tenant, activeSection, onSectionChange }: CustomerDashboardRendererProps) {
  const spec = resolveCustomerDashboard(tenant.vertical);
  const widgets = spec.sections[activeSection] || spec.sections.inicio || [];
  const isMembership = spec.vertical === 'membership';
  const primaryWidget = widgets[0];
  const secondaryWidgets = widgets.slice(1);
  const media = useBusinessMedia(tenant.slug);
  const heroStyle = media.heroImage ? { backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,255,255,.74)), url(${media.heroImage.url})` } : undefined;

  return (
    <div className="client-shell">
      <header className="client-topbar">
        <LinkBack slug={tenant.slug} />
        <span className="client-brand">{tenant.name}</span>
        <div className="client-user"><span className="badge badge-green"><span className="dot dot-green" /> {isMembership ? 'Alumno' : 'Cliente'}</span><button className="client-exit" onClick={() => exitClientZone(tenant.slug)}>Salir</button><div className="avatar">ML</div></div>
      </header>
      <main className="client-main client-dashboard-main">
        <section className="client-hero client-hero-premium client-visual-hero" style={heroStyle}>
          <div>
            <span className="eyebrow">{isMembership ? 'Cuenta de alumno' : 'Cuenta del cliente'}</span>
            <h1>{spec.title}</h1>
            <p>{spec.subtitle}</p>
          </div>
          <div className="client-score"><span>240</span><small>{isMembership ? 'puntos' : 'beneficios'}</small></div>
        </section>

        <section className="client-status-strip">
          <div><span>Estado</span><strong>{isMembership ? 'Membresía activa' : 'Cita en seguimiento'}</strong></div>
          <div><span>Negocio</span><strong>{tenant.name}</strong></div>
          <div><span>Próximo paso</span><strong>{isMembership ? 'Validar pago' : 'Confirmar depósito'}</strong></div>
        </section>

        <MediaStrip tenantSlug={tenant.slug} isMembership={isMembership} />

        <section className="client-dashboard-layout">
          {primaryWidget ? <CustomerWidget widget={primaryWidget} tenant={tenant} featured /> : null}
          <div className="client-widget-grid">
            {secondaryWidgets.map((widget) => <CustomerWidget key={widget} widget={widget} tenant={tenant} />)}
          </div>
        </section>
      </main>
      <nav className="client-bottom-nav">
        {spec.nav.map((item) => (
          <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => onSectionChange(item.id)}>
            {iconFor(item.iconKey)}<span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function MediaStrip({ tenantSlug, isMembership }: { tenantSlug: string; isMembership: boolean }) {
  const media = useBusinessMedia(tenantSlug);
  const title = isMembership ? 'Imágenes de la academia' : 'Imágenes del estudio';
  const emptyText = isMembership ? 'Subí fotos de clases, espacios, eventos o productos para darle vida al portal.' : 'Subí fotos del local, resultados, preparación o productos para que el cliente entienda mejor el servicio.';

  async function handleFile(file: File | undefined, role: 'hero' | 'gallery') {
    if (!file) return;
    await media.addImageFromFile(file, role);
    toast.success(role === 'hero' ? 'Hero actualizado' : 'Imagen agregada');
  }

  return (
    <section className="client-media-panel card">
      <div className="client-media-head">
        <div>
          <span className="eyebrow">Contenido visual</span>
          <h3>{title}</h3>
          <p>{media.images.length ? 'Estas imágenes alimentan el hero y la galería de la cuenta.' : emptyText}</p>
        </div>
        <div className="media-upload-actions">
          <label className="btn btn-secondary btn-sm"><Upload size={15} /> Hero<input type="file" accept="image/*" onChange={(e) => void handleFile(e.target.files?.[0], 'hero')} /></label>
          <label className="btn btn-primary btn-sm"><ImageIcon size={15} /> Galería<input type="file" accept="image/*" onChange={(e) => void handleFile(e.target.files?.[0], 'gallery')} /></label>
        </div>
      </div>
      {media.images.length ? (
        <div className="client-media-grid">
          {media.images.slice(0, 6).map((image) => (
            <article key={image.id} className={`client-media-card ${image.role === 'hero' ? 'is-hero' : ''}`}>
              <img src={image.url} alt={image.title} />
              <div><strong>{image.role === 'hero' ? 'Hero' : image.title}</strong><span>{image.caption}</span></div>
              <button aria-label="Eliminar imagen" onClick={() => media.removeImage(image.id)}><X size={14} /></button>
            </article>
          ))}
        </div>
      ) : <div className="client-media-empty"><ImageIcon /><span>Sin imágenes todavía</span></div>}
    </section>
  );
}

function LinkBack({ slug }: { slug: string }) {
  return <a className="client-back-link" href={`/${slug}`}>Vista pública</a>;
}

function CustomerWidget({ widget, tenant, featured = false }: { widget: CustomerWidgetKey; tenant: TenantLike; featured?: boolean }) {
  const { memberships, appointments, uploadReceipt } = useAtlasStore();
  const isMembership = tenant.vertical === 'membership';
  const tenantMemberships = memberships.filter((item) => item.tenantSlug === tenant.slug);
  const tenantAppointments = appointments.filter((item) => item.tenantSlug === tenant.slug);
  const pendingMembership = tenantMemberships.find((item) => item.status !== 'paid');
  const nextAppointment = tenantAppointments[0];
  const className = featured ? 'card client-feature-card' : 'card client-widget-card';

  if (widget === 'membership_status') {
    const current = tenantMemberships[0];
    return <article className={className}><Dumbbell /><span className="badge badge-green">Plan activo</span><h3>Mi membresía</h3><p>{current ? current.plan : 'Sin plan activo'}</p><strong>{current ? current.due : 'Consulta planes disponibles'}</strong><small>Desde aquí se controla el estado del alumno dentro del negocio.</small></article>;
  }

  if (widget === 'upcoming_appointment') {
    return <article className={className}><CalendarDays /><span className="badge badge-green">Próxima acción</span><h3>Mi próxima cita</h3><p>{nextAppointment ? `${nextAppointment.service} · ${nextAppointment.time}` : 'No tienes citas activas'}</p><strong>{nextAppointment ? nextAppointment.status : 'Reservar nuevo servicio'}</strong><small>Tu cita, depósito y preparación quedan conectados a esta cuenta.</small></article>;
  }

  if (widget === 'payment_task' && isMembership) {
    return <article className={className}><Wallet /><span className="badge badge-amber">Pago SINPE</span><h3>Pago de mensualidad</h3><p>{pendingMembership ? `${pendingMembership.plan} · ${pendingMembership.due}` : 'No hay pagos pendientes'}</p><button className="btn btn-primary btn-full" disabled={!pendingMembership} onClick={() => { if (!pendingMembership) return; uploadReceipt(pendingMembership.id, 'sinpe-demo.jpg'); toast.success('Comprobante subido a revisión'); }}>Subir comprobante</button></article>;
  }

  if (widget === 'payment_task') {
    return <article className={className}><Wallet /><span className="badge badge-amber">Reserva</span><h3>Depósito de reserva</h3><p>{nextAppointment ? 'Depósito pendiente de confirmación por el negocio.' : 'No hay depósitos pendientes.'}</p><strong>SINPE disponible</strong></article>;
  }

  if (widget === 'access_pass') {
    return <article className={className}><KeyRound /><span className="badge badge-green">Acceso</span><h3>Pase de alumno</h3><p>Estado de entrada y beneficios activos.</p><strong>Acceso permitido</strong></article>;
  }

  if (widget === 'upcoming_classes') {
    return <article className={className}><Dumbbell /><span className="badge badge-violet">Agenda</span><h3>Próximas clases</h3><p>MMA · 6:00 PM</p><p>BJJ · 7:30 PM</p><p>Boxeo · 8:00 AM</p></article>;
  }

  if (widget === 'appointment_history') {
    return <article className={className}><CheckCircle2 /><span className="badge badge-violet">Historial</span><h3>Servicios realizados</h3><p>{tenantAppointments.length ? `${tenantAppointments.length} citas registradas` : 'Sin historial todavía'}</p></article>;
  }

  if (widget === 'membership_history') {
    const total = tenantMemberships.reduce((sum, item) => sum + item.amount, 0);
    return <article className={className}><Receipt /><span className="badge badge-violet">Pagos</span><h3>Historial de pagos</h3><p>{tenantMemberships.length} registros</p><strong>{money(total)}</strong></article>;
  }

  if (widget === 'aftercare') {
    return <article className={className}><Sparkles /><span className="badge badge-amber">Cuidado</span><h3>{isMembership ? 'Recomendaciones' : 'Preparación y cuidados'}</h3><p>{isMembership ? 'Indicaciones de clase, equipo recomendado y próximos objetivos.' : 'Indicaciones antes y después del servicio.'}</p></article>;
  }

  if (widget === 'promotions') {
    return <article className={className}><Sparkles /><span className="badge badge-amber">Beneficio</span><h3>Promociones</h3><p>Beneficios activos para este negocio.</p><strong>Bienvenida activa</strong></article>;
  }

  return <article className={className}><Sparkles /><span className="badge badge-violet">Loyalty</span><h3>{isMembership ? 'Puntos' : 'Beneficios'}</h3><p>Saldo disponible para beneficios.</p><strong>240</strong></article>;
}
