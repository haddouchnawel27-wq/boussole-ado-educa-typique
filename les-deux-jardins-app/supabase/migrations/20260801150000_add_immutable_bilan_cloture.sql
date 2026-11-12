alter table public.clients
  add column if not exists bilan_cloture jsonb;

create or replace function public.prevent_validated_bilan_cloture_mutation()
returns trigger language plpgsql as $$
begin
  if nullif(old.bilan_cloture #>> '{praticienneValidation,valideAt}', '') is not null
     and new.bilan_cloture is distinct from old.bilan_cloture then
    raise exception 'Un bilan de clôture validé est immuable';
  end if;
  return new;
end;
$$;

drop trigger if exists clients_bilan_cloture_immutable on public.clients;
create trigger clients_bilan_cloture_immutable
before update of bilan_cloture on public.clients
for each row execute function public.prevent_validated_bilan_cloture_mutation();
