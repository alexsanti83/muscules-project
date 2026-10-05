-- =====================================================================
-- Muscules Project · base de datos
-- Pega TODO en Supabase → SQL Editor y pulsa «Run».
-- Se puede ejecutar más de una vez sin perder datos.
-- =====================================================================

-- Tabla de la primera versión (vacía): ya no se usa.
drop table if exists public.registros;
-- (Este archivo ya incluye la actualización v3.)

-- ---------------------------------------------------------------------
-- 1. Perfil de cada usuario: datos fijos y objetivo
-- ---------------------------------------------------------------------
create table if not exists public.perfiles (
  user_id        uuid primary key default auth.uid() references auth.users on delete cascade,
  nombre         text         not null,
  sexo           text         not null check (sexo in ('hombre', 'mujer')),
  altura_cm      numeric(5,1) not null check (altura_cm between 100 and 250),
  fecha_inicio   date         not null,
  peso_inicial   numeric(5,1) not null check (peso_inicial between 30 and 300),
  peso_objetivo  numeric(5,1) not null check (peso_objetivo between 30 and 300),
  semanas        int          not null default 15 check (semanas between 4 and 104),
  pesos_plan     boolean      not null default true,   -- usar los pesos de partida del plan
  plan           jsonb,                                -- plan de entrenamiento editable
  actualizado    timestamptz  not null default now()
);

-- ---------------------------------------------------------------------
-- 2. Mediciones: una fila por día (báscula y cinta métrica)
-- ---------------------------------------------------------------------
create table if not exists public.mediciones (
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  fecha        date not null,
  peso_kg      numeric(5,1),   -- kg
  grasa_pct    numeric(4,1),   -- % grasa corporal (báscula)
  visceral     numeric(4,1),   -- índice de grasa visceral (báscula)
  musculo_pct  numeric(4,1),   -- % músculo esquelético (báscula)
  agua_pct     numeric(4,1),   -- % agua corporal (báscula)
  cuello_cm    numeric(4,1),
  cintura_cm   numeric(5,1),   -- a la altura del ombligo
  cadera_cm    numeric(5,1),
  actualizado  timestamptz not null default now(),
  primary key (user_id, fecha)
);

-- ---------------------------------------------------------------------
-- 3. Sesiones de entrenamiento: una por día
-- ---------------------------------------------------------------------
create table if not exists public.sesiones (
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  fecha        date not null,
  plantilla    text not null,          -- sesión del plan (TA, W1…) o CARDIO
  iniciada     timestamptz not null default now(),
  terminada    timestamptz,            -- vacío mientras la sesión está en curso
  actualizado  timestamptz not null default now(),
  primary key (user_id, fecha)
);

-- ---------------------------------------------------------------------
-- 4. Series: cada serie de cada ejercicio (histórico de pesos)
--    Se guarda una fila en cuanto marcas la serie como hecha.
-- ---------------------------------------------------------------------
create table if not exists public.series (
  user_id      uuid not null default auth.uid(),
  fecha        date not null,
  ejercicio    text not null,          -- p. ej. press_pecho, curl, sentadilla
  serie        int  not null check (serie between 1 and 10),
  kg           numeric(5,1),           -- peso usado (por mano en mancuernas)
  reps         int,                    -- repeticiones, segundos en planchas o minutos de cardio
  nota         text,                   -- tipo de cardio o goma usada
  hecha        boolean not null default false,
  hecha_en     timestamptz,
  actualizado  timestamptz not null default now(),
  primary key (user_id, fecha, ejercicio, serie),
  foreign key (user_id, fecha) references public.sesiones (user_id, fecha) on delete cascade
);

-- ---------------------------------------------------------------------
-- 5. Seguridad: cada usuario solo ve y cambia sus propios datos
-- ---------------------------------------------------------------------
alter table public.perfiles   enable row level security;
alter table public.mediciones enable row level security;
alter table public.sesiones   enable row level security;
alter table public.series     enable row level security;

drop policy if exists "solo mis datos" on public.perfiles;
drop policy if exists "solo mis datos" on public.mediciones;
drop policy if exists "solo mis datos" on public.sesiones;
drop policy if exists "solo mis datos" on public.series;

create policy "solo mis datos" on public.perfiles   for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "solo mis datos" on public.mediciones for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "solo mis datos" on public.sesiones   for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "solo mis datos" on public.series     for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.perfiles, public.mediciones, public.sesiones, public.series to authenticated;
revoke all on public.perfiles, public.mediciones, public.sesiones, public.series from anon;

-- ---------------------------------------------------------------------
-- 6. Vista para consultar el histórico desde Supabase (Table Editor)
--    Solo series hechas, con el nombre de la sesión.
-- ---------------------------------------------------------------------
drop view if exists public.historial_series;
create view public.historial_series with (security_invoker = true) as
select s.user_id, s.fecha, se.plantilla as sesion, s.ejercicio, s.serie, s.kg, s.reps, s.nota, s.hecha_en
from public.series s
join public.sesiones se using (user_id, fecha)
where s.hecha;

grant select on public.historial_series to authenticated;
revoke all on public.historial_series from anon;
