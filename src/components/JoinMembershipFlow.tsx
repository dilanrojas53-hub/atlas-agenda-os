import { Link, useParams } from 'wouter';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAtlasStore } from '../state/AtlasStore';

export function JoinMembershipFlow() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType