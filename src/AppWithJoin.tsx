import { Link, Route, Switch, useParams } from 'wouter';
import AtlasApp from './AtlasApp';
import { PublicLayout } from './layouts/PublicLayout';
import { useAtlasStore } from './state/AtlasStore';

function JoinPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  const appUrl = '/app/' + tenant.slug + '/login';
  const publicUrl = '/' + tenant.slug;
  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
      <section className="public-tenant