import { Link, useParams } from 'wouter';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAtlasStore } from '../state/AtlasStore';

const plans = [
  { name: 'MMA mensual', price: '₡35 000', detail: 'Clases grupales y seguimiento de alumno' },
  { name: 'Boxeo mensual', price: '₡28 000', detail: 'Técnica, acondicionamiento y horarios flexibles' },
  { name: 'BJJ mensual', price: '₡32 000', detail: 'Fundamentos, sparring y progreso' },
];

export function JoinMembershipFlow() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
      <section className="public-tenant-hero">
        <div>
          <span className="eyebrow">Registro de alumno</span>
         