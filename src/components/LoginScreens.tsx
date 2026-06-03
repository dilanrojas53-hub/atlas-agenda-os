import { Link, useParams } from 'wouter';
import { Lock, ShieldCheck, UserRound } from 'lucide-react';

export function AdminLogin() {
  const { slug } = useParams();
  return (
    <div className="login-shell">
      <div className="login-card login-admin">
        <div className="login-logo"><Lock size={20} /></div>
        <h2 className="login-title">Panel admin</h2>
        <p className="login-sub">Acceso exclusivo para administradores del negocio.</p>
        <div className="form-stack">
          <div className="field"><label>Email del admin</label><input className="input" placeholder="admin@negocio.com" /></div>
          <div className="field"><label>Contraseña</label><input className="input" type="password" placeholder="••••••••" /></div>
          <Link className="btn btn-primary btn-full" style={{ marginTop:8 }} href={`/admin/${slug||'ink-beauty-studio'}`}>
            Entrar demo
          </Link>
        </div>
        <div className="login-divider"><span>O</span></div>
        <p style={{ fontSize:12, color:'var(--text-3)', textAlign:'center' }}>En producción se validará con Supabase Auth por tenant.</p>
        <Link href="/" className="login-back">← Volver al inicio</Link>
      </div>
    </div>
  );
}

export function ClientLogin() {
  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo" style={{ background:'var(--emerald-dim)', border:'1px solid rgba(16,185,129,.3)' }}>
          <UserRound size={20} style={{ color:'var(--emerald)' }} />
        </div>
        <h2 className="login-title">Mi espacio Atlas</h2>
        <p className="login-sub">Tu cuenta personal. Citas, pagos, comprobantes y puntos.</p>
        <div className="form-stack">
          <div className="field"><label>Teléfono o email</label><input className="input" placeholder="+506 8888 0000" /></div>
          <Link className="btn btn-primary btn-full" style={{ marginTop:8 }} href="/client/demo">
            Entrar demo
          </Link>
        </div>
        <div className="login-divider"><span>Nuevo cliente</span></div>
        <p style={{ fontSize:12, color:'var(--text-3)', textAlign:'center' }}>Recibís un código por WhatsApp para acceder.</p>
        <Link href="/" className="login-back">← Volver</Link>
      </div>
    </div>
  );
}

export function SuperAdminLogin() {
  return (
    <div className="login-shell">
      <div className="login-card login-super">
        <div className="login-logo"><ShieldCheck size={20} /></div>
        <h2 className="login-title">Control center</h2>
        <p className="login-sub">Acceso interno Digital Atlas. Solo personal autorizado.</p>
        <div className="form-stack">
          <div className="field"><label>Email Digital Atlas</label><input className="input" placeholder="admin@digitalatlas.cr" /></div>
          <div className="field"><label>Contraseña</label><input className="input" type="password" placeholder="••••••••" /></div>
          <Link className="btn btn-full" style={{ marginTop:8, background:'var(--gradient-brand)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 20px', borderRadius:'999px', fontWeight:600, fontSize:14 }} href="/super-admin">
            Entrar demo
          </Link>
        </div>
        <Link href="/" className="login-back">← Inicio</Link>
      </div>
    </div>
  );
}
