insert into public.service_categories (business_id, name, description, sort_order)
select id, 'Tattoo', 'Disenos, sesiones y retoques.', 1
from public.businesses where slug = 'ink-beauty-studio';

insert into public.service_categories (business_id, name, description, sort_order)
select id, 'Piercing', 'Perforaciones y cuidado posterior.', 2
from public.businesses where slug = 'ink-beauty-studio';

insert into public.service_categories (business_id, name, description, sort_order)
select id, 'Belleza', 'Servicios esteticos por cita.', 3
from public.businesses where slug = 'ink-beauty-studio';

insert into public.services (business_id, category_id, name, description, price_from, duration_minutes, requires_deposit, deposit_amount, sort_order)
select b.id, c.id, 'Tatuaje pequeno', 'Pieza pequena o linework.', 25000, 60, true, 10000, 1
from public.businesses b join public.service_categories c on c.business_id = b.id and c.name = 'Tattoo'
where b.slug = 'ink-beauty-studio';

insert into public.services (business_id, category_id, name, description, price_from, duration_minutes, requires_deposit, deposit_amount, sort_order)
select b.id, c.id, 'Piercing nariz', 'Perforacion con guia de cuidado.', 18000, 30, true, 5000, 2
from public.businesses b join public.service_categories c on c.business_id = b.id and c.name = 'Piercing'
where b.slug = 'ink-beauty-studio';
