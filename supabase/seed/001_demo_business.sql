insert into public.businesses (
  slug,
  name,
  vertical,
  description,
  phone,
  whatsapp,
  address,
  plan_tier
) values (
  'ink-beauty-studio',
  'Ink Beauty Studio',
  'tattoo_beauty',
  'Agenda demo para servicios por cita.',
  '+506 7000 0000',
  '50670000000',
  'San Jose, Costa Rica',
  'growth'
) on conflict (slug) do nothing;

insert into public.business_theme_settings (business_id)
select id from public.businesses where slug = 'ink-beauty-studio'
on conflict (business_id) do nothing;
