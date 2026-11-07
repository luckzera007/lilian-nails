-- Lilian Nails: rode este arquivo inteiro no SQL Editor do Supabase.

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  studio_name text default 'Lilian Nails',
  whatsapp text default '5541999999999',
  instagram text default 'liliannails',
  address text default 'Rua das Flores, 123 – Centro, Curitiba/PR',
  open_days int[] default '{2,3,4,5,6}',
  open_time time default '09:00',
  close_time time default '18:00',
  step_min int default 30,
  hero_image text,
  about_image text,
  about_text text default 'Sou a Lilian, nail designer apaixonada por cuidar de cada detalhe.'
);
insert into settings (id) values (1) on conflict do nothing;

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_min int not null default 60,
  image_url text,
  active boolean not null default true,
  sort int not null default 0
);

create table if not exists portfolio (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists blocked (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  start_time time,
  end_time time,
  reason text
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  service_name text not null,
  day date not null,
  start_time time not null,
  duration_min int not null,
  client_name text not null check (char_length(client_name) between 3 and 120),
  client_phone text not null check (client_phone ~ '^[0-9]{10,13}$'),
  status text not null default 'pending' check (status in ('pending','confirmed','canceled')),
  created_at timestamptz not null default now()
);

-- Impede dois agendamentos sobrepostos (mesmo se duas clientes clicarem juntas).
create or replace function prevent_overlap() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status <> 'canceled' and exists (
    select 1 from bookings b
    where b.day = new.day and b.status <> 'canceled' and b.id <> new.id
      and b.start_time < new.start_time + make_interval(mins => new.duration_min)
      and b.start_time + make_interval(mins => b.duration_min) > new.start_time
  ) then
    raise exception 'Horário indisponível';
  end if;
  return new;
end $$;
drop trigger if exists bookings_no_overlap on bookings;
create trigger bookings_no_overlap before insert or update on bookings
  for each row execute function prevent_overlap();

-- Visão pública: só dia, hora e duração (sem dados das clientes).
create or replace view public_busy as
  select day, start_time, duration_min from bookings where status <> 'canceled';
grant select on public_busy to anon, authenticated;

-- Segurança (RLS). Qualquer usuária logada no Supabase Auth é administradora:
-- crie só o usuário da Lilian e DESATIVE "Allow new users to sign up" em Authentication.
alter table settings enable row level security;
alter table services enable row level security;
alter table portfolio enable row level security;
alter table blocked enable row level security;
alter table bookings enable row level security;

create policy "settings leitura" on settings for select using (true);
create policy "settings admin" on settings for all to authenticated using (true) with check (true);
create policy "services leitura" on services for select using (true);
create policy "services admin" on services for all to authenticated using (true) with check (true);
create policy "portfolio leitura" on portfolio for select using (true);
create policy "portfolio admin" on portfolio for all to authenticated using (true) with check (true);
create policy "blocked leitura" on blocked for select using (true);
create policy "blocked admin" on blocked for all to authenticated using (true) with check (true);
create policy "bookings cliente cria" on bookings for insert to anon, authenticated with check (status = 'pending');
create policy "bookings admin" on bookings for all to authenticated using (true) with check (true);

-- Imagens
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true) on conflict do nothing;
create policy "imagens leitura" on storage.objects for select using (bucket_id = 'portfolio');
create policy "imagens admin" on storage.objects for all to authenticated
  using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');

-- Dados de exemplo (apague/edite pelo painel)
insert into services (name, description, price, duration_min, sort) values
 ('Alongamento em gel','Extensão com molde, estrutura resistente e acabamento natural.',180,150,1),
 ('Fibra de vidro','Alongamento leve e flexível, ideal para unhas finas e duráveis.',200,150,2),
 ('Banho de gel','Camada de gel sobre a unha natural para reforçar e proteger.',110,90,3),
 ('Esmaltação em gel','Cor intensa e brilho por até 3 semanas.',70,60,4),
 ('Nail art','Desenhos, pedrarias e efeitos personalizados.',15,30,5),
 ('Manutenção','Reposição e correção do alongamento a cada 15 a 20 dias.',120,120,6);
