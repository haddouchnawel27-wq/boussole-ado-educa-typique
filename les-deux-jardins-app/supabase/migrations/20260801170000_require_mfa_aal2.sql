-- La protection visuelle de l'application ne suffit pas : les cinq tables
-- professionnelles refusent aussi les lectures et écritures sans session AAL2.
-- Ces politiques sont restrictives et s'ajoutent aux politiques d'isolement
-- par praticienne déjà présentes dans schema.sql.

drop policy if exists "mfa aal2 required" on public.practitioners;
create policy "mfa aal2 required" on public.practitioners
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

drop policy if exists "mfa aal2 required" on public.clients;
create policy "mfa aal2 required" on public.clients
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

drop policy if exists "mfa aal2 required" on public.seances;
create policy "mfa aal2 required" on public.seances
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

drop policy if exists "mfa aal2 required" on public.syntheses;
create policy "mfa aal2 required" on public.syntheses
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');

drop policy if exists "mfa aal2 required" on public.questionnaire_responses;
create policy "mfa aal2 required" on public.questionnaire_responses
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2')
  with check ((select auth.jwt()->>'aal') = 'aal2');
