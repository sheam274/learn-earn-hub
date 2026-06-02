## Stack & Foundations

- TanStack Start (file-based routes under `src/routes/`), Tailwind v4, shadcn.
- Enable Lovable Cloud for Postgres, auth (email/password + Google), storage.
- Design tokens added to `src/styles.css` (no gradients, flat palette):
  - `--primary` Deep Blue, `--accent` Cyan, `--background` Off-White, `--foreground` Charcoal, `--destructive` Crimson.
  - Utility classes: `.glass` (only for hero/profile metric cards), `.crossover` (`relative -mt-10 z-10`), `.lift` (hover translate + shadow), `.page-enter` (slide-in).
- Route head() set per page for SEO (title, description, og:*).

## Database (Lovable Cloud / Postgres)

Migration creates these tables (snake_case, RLS enabled, GRANTs to authenticated + service_role, separate `user_roles` table for admin — never on profile):

- `profiles` — id (uuid, fk auth.users), name, discipline, skills text[], avatar_url, created_at.
- `app_role` enum (`admin`, `student`) + `user_roles` (id, user_id fk, role) + `has_role(uuid, app_role)` security-definer function.
- `learning_modules` — id, discipline, section_slug (unique with discipline), title, video_url, documentation_body (markdown), created_by, updated_at.
- `skill_quizzes` — id, module_id fk, question, choices text[], correct_answer.
- `user_credentials` — id, user_id fk, credential_name, score int, verified_at.
- `job_marketplace` — id (uuid), job_title, company, is_remote bool, salary_range, requirements text[], is_live bool, created_at.
- `cv_records` — id (uuid), user_id fk, selected_style ('standard'|'premium'), builder_payload jsonb, updated_at.

RLS summary: students read+write only their own rows on profiles/credentials/cv_records; learning_modules + job_marketplace public-readable (only `is_live` jobs for anon); admin policies via `has_role(auth.uid(), 'admin')` allow full CRUD.

Seed: one admin role row (assigned to the first signed-up user via SQL note in chat), a handful of modules per discipline, sample jobs, sample quizzes.

## Routes (all separate pages)

Public:
- `/` — landing (hero glass card, value props, CTA).
- `/auth` — login + signup (email/password + Google), redirects to `/dashboard`.
- `/jobs` — searchable/filterable marketplace (text, remote toggle, discipline). Public read of `is_live`.

Authenticated (`src/routes/_authenticated/`, integration-managed gate):
- `/dashboard` — profile snapshot (glass), credentials earned, recommended modules, recent jobs.
- `/learn` — index of disciplines (CSE, EEE, Civil) with topic cards.
- `/learn/$discipline/$topic` — dynamic page: YouTube embed placeholder + markdown drawer + "Take Assessment" CTA.
- `/assessments` — list of quizzes; quiz runner with timer; on ≥80% inserts into `user_credentials`.
- `/cv-builder` — form for personal info, education, experience, skills; live preview; style toggle Standard vs Premium; print CSS for clean PDF; saves payload to `cv_records`.
- `/cv-parser` — drag-and-drop `.txt`/`.pdf` (text only for v1), client-side keyword dictionary per discipline, returns ranked job-sector matches with % score; suggests open jobs.

Admin (`src/routes/_authenticated/admin/`, extra `has_role` gate via server fn):
- `/admin/dashboard` — overview counts.
- `/admin/modules` — CRUD on `learning_modules` (and quizzes per module).
- `/admin/jobs` — CRUD + toggle `is_live`.
- `/admin/users` — list profiles, view credentials, grant/revoke admin role, adjust credential records.

## Server Functions (createServerFn)

- `profile.functions.ts` — getMyProfile, upsertMyProfile.
- `learning.functions.ts` — listModules, getModule, adminUpsertModule, adminDeleteModule.
- `assessments.functions.ts` — getQuiz, submitQuiz (server-side scoring + cred insert).
- `cv.functions.ts` — getMyCv, saveMyCv.
- `jobs.functions.ts` — listJobs (public), adminUpsertJob, adminToggleLive.
- `admin.functions.ts` — listUsers, grantAdmin, revokeAdmin, adjustCredential. All admin fns assert `has_role` server-side.

All protected fns use `requireSupabaseAuth`; `attachSupabaseAuth` confirmed in `src/start.ts`.

## UI / Layout

- Global header with Deep Blue bar, Cyan active link underline, mobile drawer.
- Hero on `/` and profile metrics on `/dashboard` use `.glass`.
- Crossover panel: dashboard's "Quick Actions" overlaps the hero band.
- Crimson badges for live job tag + error states.
- Buttons: Cyan primary action, outline secondary; `.lift` micro-animation on cards.
- Print stylesheet for `/cv-builder` preview.

## Out of scope for v1 (called out)

- PDF parsing of binary PDFs (v1 accepts `.txt` and pasted text; we can add pdf.js later).
- Real video content (YouTube placeholders only).
- Payments / certificate PDFs.
- Email notifications.

## Acceptance

- Sign up, sign in (email + Google), land on `/dashboard`.
- Browse `/learn`, open a topic, take a quiz, earn a credential on ≥80%.
- Build a CV in both styles, save, print preview clean.
- Parse a pasted resume on `/cv-parser`, see ranked matches.
- Admin user can CRUD modules/jobs and grant admin role.
- All pages have unique `head()` meta; responsive on mobile/desktop; no gradients used.
